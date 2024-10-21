import os
import random
from module.db import Database
from flask import Flask, request, session, jsonify, redirect
from flask_cors import CORS
from module.vocal_analysis import VocalAnalysis
from module.range_check import extract_pitch
from module.pitch_shift import change_pitch_without_speed


# Flask 앱 초기화 및 설정
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})
app.secret_key = os.getenv("SECRET_KEY", "Um_AI_Diary_Hungry_BBC_BBQ_Chicken")

UPLOAD_FOLDER = 'assets/audio/user/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TONE_UPLOAD_FOLDER'] = os.path.join(UPLOAD_FOLDER, 'tone')
app.config['RANGE_UPLOAD_FOLDER'] = os.path.join(UPLOAD_FOLDER, 'range')

db = Database()

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


# @app.route("/weekly_ranking", methods=["GET"])
# def get_weekly_ranking():
#     try:
#         data = db.get_weekly_ranking()
#         if data:
#             return jsonify({'status': 'success', 'data': data}), 200
#         return jsonify({'status': 'fail', 'message': 'No ranking data found'}), 404
#     except Exception as e:
#         return jsonify({'status': 'fail', 'message': str(e)}), 500

@app.route("/index", methods=["GET", "POST"])
def index():
    print(session['user_id'])
    if session['user_id']:
        weekly_data = db.get_weekly_ranking()
        user_data = db.get_user_info(session['user_id'])
        user_vocal_data = db.get_vocal_data(session['user_id'])

        pitch_score = user_vocal_data['pitch_score']
        print(pitch_score)
        beat_score = user_vocal_data['beat_score']
        pronunciation_score = user_vocal_data['pronunciation_score']

        session['user_tone'] = user_data['user_tone']
        session['user_level'] = user_data['user_level']

        print(user_vocal_data)
        return jsonify({'status':'success', 'data':weekly_data,
                        'pitch_score':pitch_score, 'beat_score':beat_score,
                        'pronunciation_score':pronunciation_score}), 200
    else:
        return jsonify({'status':'fail', 'message':'로그인 상태가 아닙니다.'}), 404

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        session['user_id'] = data['id']
        session['user_password'] = data['password']

        return db.db_login(session['user_id'], session['user_password'])
    return jsonify({"message": "로그인 에러"}), 400


@app.route('/logout', methods=['POST'])
def logout():
    # 세션 또는 토큰을 삭제하여 로그아웃 처리
    session.clear()
    # 성공적인 로그아웃 응답을 JSON 형태로 반환
    return jsonify({"message": "Logged out successfully!"}), 200

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

@app.route('/get_user_name', methods=['GET'])
def get_user_name():
    # Fetch user_id from session


    if session['user_id']:
        user_data = db.get_user_info(session['user_id'])  # Replace with your database logic
        print(user_data)

        if user_data:
            return jsonify({'status': 'success', 'user_name': user_data['user_name']})
        else:
            return jsonify({'status': 'fail', 'message': 'User not found'}), 404
    else:
        return jsonify({'status': 'fail', 'message': 'User not logged in'}), 401

@app.route("/uploads", methods=["GET", "POST"])
def upload():
    print('업로드: '+ session['artist'], session['title'])
    filename = f"{session['artist']}-{session['title']}.wav"

    file_path = save_uploaded_file(request, app.config['UPLOAD_FOLDER'], filename)
    if isinstance(file_path, tuple):
        return file_path  # 에러 응답 처리

    va = VocalAnalysis(session['artist'], session['title'])
    va.recording_result()
    return jsonify({"message": "File saved successfully", "file_path": file_path}), 200

@app.route("/test", methods=["GET", "POST"])
def test():
    if 'user_id' in session:
        print(session['user_id'])
        return {'user_id': session['user_id']}
    elif 'user_id' and 'artist' in session:
        return {'user_id': session['user_id'], 'artist':session['artist']}
    
    return jsonify({"message": "세션에 아이디가 없습니다."}), 400

@app.route("/training", methods=["GET", "POST"])
def training():
    data = request.get_json()
    session['artist'] = data.get("artist", "")
    session['title'] = data.get("songTitle", "")

    va = VocalAnalysis(session['artist'], session['title'])
    print(session['artist'], session['title'])
    lrc = va.process_music_files()
    return jsonify({'lyrics': lrc})

@app.route("/vocal_analysis", methods=["GET", "POST"])
def vocal_analysis():
    va = VocalAnalysis(session['artist'], session['title'])
    pitch_score, wrong_segments, artist_resampled, user_resampled = va.pitch_comparison()
    wrong_lyrics, _ = va.find_incorrect()
    beat_score = round(va.score_cover()['accuracy'], 2)
    pronunciation_score = va.pronunciation_score() or 0.0

    total_score = (pitch_score+beat_score+pronunciation_score)/3
    db.vocal_data(session['user_id'], 0, 80.25, 50.25, 70.25)
    
    print(artist_resampled)
    return jsonify({
        '종합 점수': total_score,
        '음정 점수': pitch_score,
        '박자 점수': beat_score,
        '발음 점수': pronunciation_score,
        '틀린 구간 초(시작, 끝)': wrong_segments,
        '틀린 가사': wrong_lyrics,
        'artist_resampled':artist_resampled,
         'user_resampled':user_resampled
    })

@app.route("/range_check", methods=["GET", "POST"])
def range_check():
    file_path = save_uploaded_file(request, app.config["RANGE_UPLOAD_FOLDER"], 'user_range.wav')
    if isinstance(file_path, tuple):
        return file_path  # 에러 응답 처리

    frequency = round(float(extract_pitch(file_path)), 2)
    return jsonify({'frequency': frequency})


@app.route("/uploads/tone", methods=["GET", "POST"])
def ai_tone():
    file_path = save_uploaded_file(request, app.config["TONE_UPLOAD_FOLDER"], 'user_tone.wav')
    if isinstance(file_path, tuple):
        return file_path  # 에러 응답 처리

    va = VocalAnalysis()
    tone = va.tone_classification()['label']
    
    # 곡과 아티스트를 튜플로 저장
    test_list = {
        '발라드': [('안아줘', '정준일', './img/songs/cover_hug_Circle_big.png'), ('너였다면', '정승환', './img/songs/cover_if_it_is_you.png'), 
                    ('밤편지', '아이유', './img/songs/cover_letter_at_night.png')],
        '댄스': [('Supernova', 'aespa', './img/songs/cover_supernova.png'), ('마지막처럼', 'BLACKPINK', './img/songs/cover_last_Circle_big.png'),
                    ('Magnetic', '아일릿', './img/songs/cover_magnetic.png')],
        '락': [('사랑, 결코 시들지 않는', '서문탁', './img/songs/cover_love_never.png'), ('나는 나비', 'YB', './img/songs/cover_im_butterfly.png'),
                    ('매일 매일 기다려', '티삼스', './img/songs/cover_every_wait.png')],
        '트로트': [('아모르파티', '김연자', './img/songs/cover_amorparty.png'), ('어머나', '장윤정', './img/songs/cover_oops.png'),
                    ('찐이야', '영탁', './img/songs/cover_jjin_Circle_big.png')]
    }

    # 해당 음색의 곡과 아티스트 랜덤 선택
    recommend, artist, image = random.choice(test_list[tone])
    
    print(tone, recommend, artist, image)
    return jsonify({'result': tone, 'recommend': recommend, 'artist': artist, 'image': image})


@app.route("/my_page", methods=["GET", "POST"])
def my_page():

    # 임시로 정보 보냅니다
    return {'level':10, 'pitch':80, 'beat':70, 'tone':'발라드'}

 #음역대 데이터(pitch)
@app.route("/pitch_change", methods=["GET", "POST"])
def pitch_change():
    try:
        data = request.json
        if data is None:
            return jsonify({"error": "No JSON data received"}), 400
        
        pitch = data.get('pitch')
        if pitch is None:
            return jsonify({"error": "Pitch value is missing"}), 400
        
        file_name = f"{session['artist']}-{session['title']}"

        pitch = int(pitch)
        if pitch!=0:
            print(f"음정을 {pitch}해주세요")
            change_pitch_without_speed(file_name, pitch, 0)
            change_pitch_without_speed(file_name, pitch, 1)
        return jsonify({
            "message": "Pitch value received successfully",
            "pitch": pitch
        })
    except ValueError:
        return jsonify({"error": "Invalid pitch value"}), 400
    except Exception as e:
        print(f"Error in pitch_change: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    

if __name__ == "__main__":
    app.run(debug=True)