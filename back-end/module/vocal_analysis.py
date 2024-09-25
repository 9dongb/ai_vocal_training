import os
import librosa                                       # 음성 분석을 위함
import numpy as np
import soundfile as sf
import tensorflow as tf
import tensorflow_hub as hub
from scipy.interpolate import interp1d
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # GUI 없는 백엔드 사용

import difflib
import speech_recognition as s_r
from bs4 import BeautifulSoup
import urllib
import json
import re
import requests


class VocalAnalysis:
    def __init__(self, title, artist):
        self.title = title
        self.artist = artist
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
        resampled_diff = artist_resampled - user_resampled

        threshold = 0.03                               # 오차 인정 범위

        # 음정 차이에 따른 평가
        result = np.where(abs(diff) <= threshold, "Correct", 
                            np.where(diff > threshold, "Flat", 
                                    np.where(diff < -threshold, "Sharp", None)))
        
        resampled_result = np.where(abs(resampled_diff) <= threshold, "Correct", 
                            np.where(resampled_diff > threshold, "Flat", 
                                    np.where(resampled_diff < -threshold, "Sharp", None)))

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

        correct_score = round((np.sum(result=='Correct') / len(result))*100, 2)

        return correct_score, resampled_wrong_segments

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
    
    def find_incorrect(self):                        # 틀린 구간의 가사를 찾아주는 함수 정의

        wrong_segment_file = []
        for s in os.listdir(f'assets/audio/artist'):
            if f'flower_segment' in s:
                wrong_segment_file.append(s)

        lyrics_path = f'assets/lyrics/{self.title}.txt'
        
        incorrect_lyrics = []
        incorrect_similar = []
        for w in wrong_segment_file:
            audio_path = f'assets/audio/artist/{w}'
                
            r = s_r.Recognizer()
            
            song = s_r.AudioFile(audio_path)                                # 오디오 파일 로드

            with song as source:
                audio = r.record(source)

            result = r.recognize_google(audio_data=audio, language='ko-KR') # 음성을 텍스트로 변환

            f = open(lyrics_path, 'r', encoding='utf-8')                                      # 읽기 모드로 파일 준비
            lyrics = f.readlines()                                          # 각 줄을 element로 받는 리스트 반환
            lyrics = list(map(lambda x: x.replace('\n',''), lyrics))        # 각 리스트에서 \n 제외하고 리스트 반환

            threshold = 0.09                                                # 임계값

                                                                            # SequenceMatcher 방법
            lyrics_index = []
            lyrics_similarity = []
            
            for index, ly in enumerate(lyrics):
                answer_bytes = bytes(ly, 'utf-8')
                input_bytes = bytes(result, 'utf-8')
                answer_bytes_list = list(answer_bytes)
                input_bytes_list = list(input_bytes)
                
                sm = difflib.SequenceMatcher(None, answer_bytes_list, input_bytes_list)
                similar = sm.ratio()

                if similar not in lyrics_similarity:                        # 중복된 가사 아닐 경우
                    lyrics_index.append(index)
                    lyrics_similarity.append(similar)
                                                                            # 최대 유사도와 임계값 범위의 가사와 인덱스 추출 
            incorrect_section = [(index, similarity) for index, similarity in zip(lyrics_index, lyrics_similarity) if max(lyrics_similarity)-threshold<= similarity <= max(lyrics_similarity)]

            for index, similarity in incorrect_section:
                print(index, similarity)
                incorrect_lyrics.append(lyrics[index])
                incorrect_similar.append(similarity)

            
        for w in wrong_segment_file:                # 분석 후 틀린 구간 오디오 삭제
            os.remove(f'assets/audio/artist/{w}')

        return incorrect_lyrics, incorrect_similar

##################################################################################################################################


    def extract_artist_and_title(self, file_name):
        #
        base_name = os.path.splitext(file_name)[0]
        
        # 파일명에서 '-'로 구분된 아티스트와 곡명 추출
        if '-' in base_name:
            artist, title = base_name.split('-', 1)
            return artist.strip(), title.strip()
        else:
            return None, None

    # Bugs에서 아티스트와 트랙 ID 검색 (앨범명 없이 검색)
    def get_artist_track_id(self, artist_name, title):
        search_url = f'https://music.bugs.co.kr/search/track?q={artist_name} {title}'
        search_soup = BeautifulSoup(requests.get(search_url).text, 'html.parser')
        
        # 검색 결과에서 트랙 ID 추출
        track_tag = search_soup.select_one("tr[trackid]")
        if track_tag:
            track_id = track_tag.get('trackid')
            return track_id
        return None

    # 가사 다운로드
    def download_lyrics(self, track_id, file_path):
        lyrics_url = f'http://api.bugs.co.kr/3/tracks/{track_id}/lyrics?&api_key=b2de0fbe3380408bace96a5d1a76f800'

        urllib.request.urlretrieve(lyrics_url, f"{file_path}.lrc")

        with open(f'{file_path}.lrc', encoding='UTF8') as json_file:
            data = json.load(json_file)
        
        return data.get('result', {}).get('lyrics', None)

    # LRC 파일 생성
    def lrc_maker(self, file_path, lyrics_text):
        TIME = []
        LYRICS = []
        mm = []
        ss = []
        xx = []

        lyrics_lines = lyrics_text.replace("＃", "\n").split("\n")
        for line in lyrics_lines:
            time_marker, lyric = line.rsplit("|", 1)
            TIME.append(float(time_marker))
            LYRICS.append(lyric)

        for time in TIME:
            xx.append(f"{time % 1:.2f}"[1:])
            ss.append(f"{int(time) % 60:02}")
            mm.append(f"{int(time) // 60:02}")

        with open(f'{file_path}.lrc', 'w', encoding='UTF8') as file:
            for i in range(len(TIME)):
                file.write(f"[{mm[i]}:{ss[i]}{xx[i]}]{LYRICS[i]}\n")

        print(f"{file_path}.lrc 파일을 생성했습니다.")


    def process_music_files(self):
        artist = self.artist
        title = self.title
        file_path = 'assets/audio/artist/lrc/' + artist + '-' + title

        if os.path.isfile(file_path+'.lrc') != True:
                
            # Bugs에서 아티스트명과 곡명으로 트랙 ID 검색
            track_id = self.get_artist_track_id(artist, title)
            
            if track_id:
                    
                lyrics = self.download_lyrics(track_id, file_path)
                if lyrics:
                
                    self.lrc_maker(file_path, lyrics)
        lrc = self.read_lrc(file_path+'.lrc')
        return lrc
        
    # LRC 파일 읽기
    def read_lrc(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        lrc_data = []
        for line in lines:
            match = re.match(r'\[(\d+):(\d+\.\d+)\](.*)', line)
            if match:
                minutes = int(match.group(1))
                seconds = float(match.group(2))
                text = match.group(3).strip()
                lrc_data.append((minutes * 60 + seconds, text))
        return lrc_data
##################################################################################################################################