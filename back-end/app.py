import os
from module.db import Database

from flask import Flask, request, session, jsonify, redirect
from flask_cors import CORS, cross_origin  # Cross-Origin Resorce Sharing 
                                           # 서로 다른 도메인 간에 리소스를 주고 받는 것을 허용해주거나 차단하는 설정

from module.vocal_analysis import VocalAnalysis

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "Um_AI_Diary_Hungry_BBC_BBQ_Chicken"

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = Database()

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        
        user_id = data['id']
        user_password = data['password']
        
        login_data = db.db_login(user_id, user_password)
        return login_data
    else:

        return {"message":"로그인 에러"}

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.get_json()
    
        user_id = data['id']
        user_age = data['age']
        user_gender = data['gender']
        user_name = data['name']
        user_pw = data['password']

        register_data = db.db_register(user_id, user_name, user_age, user_gender, user_pw)
        print(register_data)
        return register_data

# 녹음 관련
@app.route("/range_check", methods=["GET", "POST"])
def range_check():
    test = 369.99

    return jsonify({'frequency':test})

    
@app.route("/uploads", methods=["GET", "POST"])
def upload():
    # 업로드 폴더 경로 설정
    UPLOAD_FOLDER = 'uploads/'
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)


       # 'audio_file'은 JavaScript에서 전송한 FormData key와 일치해야 합니다.
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file part"}), 400

    file = request.files['audio']

    # 파일이 비어있지 않은지 확인
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # 파일 저장
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        return jsonify({"message": "File saved successfully", "file_path": file_path}), 200

@app.route("/vocal_analysis", methods=["GET", "POST"])
def vocal_analysis():
    va = VocalAnalysis('flower')
    
    pitch_score, wrong_segments = va.pitch_comparison()
    
    print(pitch_score, wrong_segments)

    wrong_lyrics, _ = va.find_incorrect()

    return jsonify({'음정 점수':pitch_score, '틀린 구간 초(시작, 끝)': wrong_segments, '틀린 가사':wrong_lyrics})


 #랭킹 데이터 -- 민지원
@app.route('/weekly_ranking', methods=['GET'])
def get_weekly_ranking():
    try:
        data = db.get_weekly_ranking()

        if data:
            return jsonify({'status': 'success', 'data': data}), 200
        else:
            return jsonify({'status': 'fail', 'message': 'No ranking data found'}), 404
    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)



