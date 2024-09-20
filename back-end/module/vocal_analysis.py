import os
import librosa                                       # 음성 분석을 위함
import numpy as np
import soundfile as sf
import tensorflow as tf
import tensorflow_hub as hub
from scipy.interpolate import interp1d
import matplotlib.pyplot as plt

class VocalAnalysis:
    def __init__(self, title):
        self.title = title
        self.sampling_rate = 16000
        self.model = self.model_load()

    def model_load(self):                           
        model_path = os.path.join(os.getcwd(), "models")  # 모델 경로
        
        if not os.path.exists(model_path):                # 모델 경로가 없으면 디렉토리 생성
            os.makedirs(model_path)
    
        print("모델 다운로드 중")
        model = hub.load("https://tfhub.dev/google/spice/2")
        tf.saved_model.save(model, model_path)
        return model
    
    def extract_pitches(self, audio_path, duration):
        model = self.model

        original_y, sr = librosa.load(audio_path, mono=True, duration=duration)                     # SPICE모델은 mono 타입의 오디오만 지원

        MAX_ABS_INT16 = 32768.0                                                                     # 16비트 PCM 형식에서 가능한 최대 절댓값을 나타내는 상수

        y = original_y/float(MAX_ABS_INT16)                                                         # -1과 1사이의 부동 소수점으로 정규화

        model_output = model.signatures["serving_default"](tf.constant(y, tf.float32))              # 음정과 신뢰도를 얻음

        pitch_outputs = model_output["pitch"].numpy()                                               # 음정만 추출
        
        original_duration = len(y) / sr                                                             # 원래 신호의 전체 시간 (초)

        pitch_time = np.linspace(0, original_duration, len(pitch_outputs))                          # 음정 출력의 시간 축 생성 (초 단위)
        resampled_time = np.linspace(0, original_duration, int(original_duration))                  # 원곡 시간 축 생성 (초 단위)

        interp_func = interp1d(pitch_time, pitch_outputs, kind='linear', fill_value="extrapolate")  # 보간 함수 생성
        
        resampled_pitch_outputs = interp_func(resampled_time)                                       # 보간법 적용하여 음정 출력을 원래 신호의 길이에 맞춤

        file_path = audio_path.replace('.wav', '.npy')                                              # 오디오 파일명과 같은 이름으로 npy 파일 생성

        np.save(file_path, resampled_pitch_outputs)                                                 # 오디오 배열 저장

        return pitch_outputs, resampled_pitch_outputs, original_y, sr
    
    def pitch_comparison(self):
        artist_audio_path = f'assets/audio/artist/{self.title}.wav'
        user_audio_path = f'assets/audio/user/{self.title}.wav'

        y, sr =  librosa.load(artist_audio_path, mono=True)
        duration = len(y)/sr

        artist_original, artist_resampled, artist_y, _  = self.extract_pitches(artist_audio_path, duration)
        user_original, user_resampled, _, _ = self.extract_pitches(user_audio_path, duration)

        diff = artist_original - user_original         # 원곡 목소리와 사용자 음정 주파수 오차 계산

        threshold = 0.03                               # 오차 인정 범위

        # 음정 차이에 따른 평가
        result = np.where(abs(diff) <= threshold, "Correct", 
                            np.where(diff > threshold, "Flat", 
                                    np.where(diff < -threshold, "Sharp", None)))
        
        resampled_result = artist_resampled - user_resampled

        correct_score = round((np.sum(result=='Correct') / len(result)) *100, 2)

        plt.rcParams['font.family'] = 'Malgun Gothic' # 한국어 폰트 설정

        correct_indices = np.where(result == 'Correct')[0] # 배열이 Good인 위치 찾기 
        sharp_indices = np.where(result == 'Sharp')[0] # 배열이 high인 위치 찾기 
        flat_indices = np.where(result == 'Flat')[0] # 배열이 high인 위치 찾기 

        plt.figure(figsize=(15, 5)) # 그래프 크기 설정 그리기

        plt.plot(artist_original, label='original', color='blue') # 원곡 음성

        #plt.plot(cover, label='cover', color='orange') # 사용자 입력 음성


        plt.scatter(correct_indices, artist_original[correct_indices], color='orange', label='Good') # 음정 Good
        plt.scatter(sharp_indices, user_original[sharp_indices], color='hotpink', label='higher', marker="^") # 음정 높음
        plt.scatter(flat_indices, user_original[flat_indices], color='lightgrey', label='lower', marker="v") # 음정 낮음

        plt.title(f'원곡과 사용자 보컬의 음정 체크: {correct_score}점')
        plt.xlabel('오디오 프레임')
        plt.ylabel('원곡 파형 / Good / Bad')
        plt.legend()

        wrong_segments = self.find_wrong_segments(result)
        resampled_wrong_segments = self.find_wrong_segments(resampled_result, 1)
        print("틀린 구간 초(시작, 끝):", resampled_wrong_segments)

                                                            # 틀린 구간 강조 표시
        for start, end in wrong_segments:
            plt.axvspan(start, end, color='red', alpha=0.3)
            
        plt.savefig(f'assets/graph/{self.title}.png')       # 그래프 저장

        # 틀린 구간의 오디오 저장
        for index, s in enumerate(resampled_wrong_segments):
            audio_segment = artist_y[s[0]*sr:(s[1]+1)*sr]
            
            sf.write(f'{artist_audio_path.replace(".wav","")}_segment{index+1}.wav', audio_segment, sr)


    def find_wrong_segments(self, result, status=0):                        # 틀린 구간 시작점과 끝점 찾는 함수 (2초를 초과하여 틀렸을 경우만)
        wrong_segments = []
        in_wrong_segment = False
        start_idx = None

        length = 2 if status == 1 else 15
        
        for i in range(len(result)):
            if result[i] != 'Correct':
                if not in_wrong_segment:
                    start_idx = i
                    in_wrong_segment = True
            else:
                if in_wrong_segment:
                    end_idx = i - 1
                    # 틀린 구간의 길이가 1초 초과인지 확인
                    if (end_idx - start_idx) > length:
                        wrong_segments.append((start_idx, end_idx))
                    in_wrong_segment = False

        # 마지막 구간이 틀린 구간으로 끝나는 경우
        if in_wrong_segment:
            end_idx = len(result) - 1
            if (end_idx - start_idx) > 1:
                wrong_segments.append((start_idx, end_idx))
        return wrong_segments