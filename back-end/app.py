import os
from module.db import Database
from flask import Flask, request, session, jsonify, redirect
from flask_cors import CORS
from module.vocal_analysis import VocalAnalysis
from module.range_check import extract_pitch

# Flask 앱 초기화 및 설정
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.getenv("SECRET_KEY", "Um_AI_Diary_Hungry_BBC_BBQ_Chicken")

UPLOAD_FOLDER = 'assets/audio/user/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TONE_UPLOAD_FOLDER'] = os.path.join(UPLOAD_FOLDER, 'tone')
app.config['RANGE_UPLOAD_FOLDER'] = os.path.join(UPLOAD_FOLDER, 'range')

db = Database()

# 테스트용 아티스트와 곡명 설정
artist = '정준일'
title = '안아줘'


# 공통 함수: 폴더가 존재하지 않으면 생성
def ensure_folder_exists(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

# 공통 함수: 업로드된 파일 저장
def save_uploaded_file(request, folder_path, filename):
    ensure_folder_exists(folder_path)
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file part"}), 400
    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    file_path = os.path.join(folder_path, filename)
    file.save(file_path)
    return file_path

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        user_id = data['id']
        user_password = data['password']
        return db.db_login(user_id, user_password)
    return jsonify({"message": "로그인 에러"}), 400

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.get_json()
        user_id = data['id']
        user_name = data['name']
        user_age = data['age']
        user_gender = data['gender']
        user_pw = data['password']
        return db.db_register(user_id, user_name, user_age, user_gender, user_pw)
    return jsonify({"message": "회원가입 에러"}), 400

@app.route("/uploads", methods=["GET", "POST"])
def upload():
    filename = f"{artist}-{title}.wav"
    file_path = save_uploaded_file(request, app.config['UPLOAD_FOLDER'], filename)
    if isinstance(file_path, tuple):
        return file_path  # 에러 응답 처리

    va = VocalAnalysis(artist, title)
    va.recording_result()
    return jsonify({"message": "File saved successfully", "file_path": file_path}), 200

@app.route("/test", methods=["GET", "POST"])
def test():
    if 'title' in session:
        return {'title': session['title']}
    return jsonify({"message": "세션에 제목이 없습니다."}), 400

@app.route("/training", methods=["GET", "POST"])
def training():
    data = request.get_json()
    artist = data.get("artist", "")
    title = data.get("songTitle", "")
    session['artist'] = artist
    session['title'] = title

    va = VocalAnalysis(artist, title)
    lrc = va.process_music_files()
    return jsonify({'lyrics': lrc})

@app.route("/vocal_analysis", methods=["GET", "POST"])
def vocal_analysis():
    va = VocalAnalysis(artist, title)
    pitch_score, wrong_segments = va.pitch_comparison()
    wrong_lyrics, _ = va.find_incorrect()
    beat_score = round(va.score_cover()['accuracy'], 2)
    pronunciation_score = va.pronunciation_score() or 0.0

    return jsonify({
        '음정 점수': pitch_score,
        '박자 점수': beat_score,
        '발음 점수': pronunciation_score,
        '틀린 구간 초(시작, 끝)': wrong_segments,
        '틀린 가사': wrong_lyrics
    })

@app.route("/range_check", methods=["GET", "POST"])
def range_check():
    file_path = save_uploaded_file(request, app.config["RANGE_UPLOAD_FOLDER"], 'user_range.wav')
    if isinstance(file_path, tuple):
        return file_path  # 에러 응답 처리

    frequency = round(float(extract_pitch(file_path)), 2)
    return jsonify({'frequency': frequency})

@app.route("/uploads/tone", methods=["GET", "POST"])
def tone_check():
    file_path = save_uploaded_file(request, app.config["TONE_UPLOAD_FOLDER"], 'user_tone.wav')
    if isinstance(file_path, tuple):
        return file_path  # 에러 응답 처리

    return jsonify({'Result': '발라드'})

@app.route("/weekly_ranking", methods=["GET"])
def get_weekly_ranking():
    try:
        data = db.get_weekly_ranking()
        if data:
            return jsonify({'status': 'success', 'data': data}), 200
        return jsonify({'status': 'fail', 'message': 'No ranking data found'}), 404
    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
