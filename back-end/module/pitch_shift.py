import librosa
import soundfile as sf

def change_pitch_without_speed(input_file, output_file, semitones):
    # Load audio file
    y, sr = librosa.load(input_file)

    # Change pitch without changing speed
    y_shifted = librosa.effects.pitch_shift(y, sr=sr, n_steps=semitones)

    # Save the pitch-shifted audio
    sf.write(output_file, y_shifted, sr)

# 파일 경로
vocal_file = "assets/audio/artist/vocal/"
inst_file = "assets/audio/artist/inst/"

output_file = r"C:\Git\ai_vocal_training\output_semitone_up.wav"

# 반음 올리기 (semitones에 양수 값을 주면 음이 올라감)
semitones = 4  # 1이면 반음 올리기, -1이면 반음 내리기

# 음정 변경 및 속도 유지
change_pitch_without_speed(input_file, output_file, semitones)
