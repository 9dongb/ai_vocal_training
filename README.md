# 🎤 씽킹(SingKing): 인공지능 기반의 보컬 트레이닝 서비스

### 📅 개발기간
- 2024.07.03 ~ 2024.10.18

### ⚙️ 기술스택
- **AI**: Tensorflow
- **Back-end**: Python3, Flask
- **Front-end**: HTML, CSS, JavaScript, React.js
- **Server**: AWS EC2
- **Database**: AWS RDS, MySQL

### 👨‍💼 담당 작업(구동빈)
- **Flask** 소스코드 작성 및 관리
- **librosa**를 통한 **음성 데이터 분석**(음정 비교 기능, 틀린 구간과 가사 찾기) 구현

## 1. 개요
보컬 트레이닝을 필요로 하지만 소모되는 시간과 비용이 부담스러운 음치 및 박치 직장인, 학생에게 시·공간적인 제약 없이 사용자의 노래 가창 요소(발성, 음정, 박자, 가사 전달력)에 대한 **음성 데이터 분석**과 **인공지능 모델**을 활용해 사용자 맞춤형 피드백을 통해 노래 실력 향상에 도움을 기여할 수 있는 인공지능 기반의 보컬 코칭 서비스입니다. 영상만 재생시켜 주는 기존 보컬 코칭 서비스와는 달리 음성 데이터 분석과 인공지능을 활용하여 차별화된 서비스를 제공하는 것을 목적으로 개발하였습니다.

### 프로젝트 주요 내용
-
-
-

<img src="https://github.com/user-attachments/assets/89b3538c-924b-4a13-a0b2-e08f9263fad0" width="70%" height="70%"/>

## 2. 페이지 소개
**■ 메인 페이지**

<img src="https://github.com/user-attachments/assets/952f1263-2318-409a-b476-700717aebc5f" width="20%" height="20%"/>

- 최상단에서 사용자 정보 확인 가능하도록 구현
- 두 번째 행에서 최근 정밀 트레이닝 기록 확인 가능하도록 구현
- 세 번째 행에서 이전 정밀 트레이닝 점수와 현재 점수 비교 가능하도록 구현
- 네 번째 행에서는 정밀 트레이닝 점수의 주간 랭킹 확인 가능하도록 구현

**■ 트레이닝 페이지**

<img src="https://github.com/user-attachments/assets/36b942c0-7ef2-4e69-aecd-fb53d7d33364" width="20%" height="20%"/>

- 4가지를 핵심 기능을 이용할 수 있도록 구현

**■ 트레이닝 페이지 - AI 음색 진단**
- 사용자가 음성을 입력하면 **네 개의 음색 정보**(발라드, 댄스, 락, 트로트) 중 가장 어울리는(유사한) 음색을 선정해 줌
- 음성 데이터를 목소리의 특성 정보를 알 수 있는 MFCC로 변환하여 CNN으로 모델 학습
<img src="https://github.com/user-attachments/assets/44b9d4db-fe26-48cc-811c-8d238f8712f2" width="20%" height="30%"/>
<img src="https://github.com/user-attachments/assets/031cc45a-eaa9-4082-813f-d60f5ed687fd" width="20%" height="30%"/>


**■ 트레이닝 페이지 - 정밀 트레이닝**
- 원하는 곡을 선정한 후 노래 가창 가능
- 사용자 노래의 **음정과 박자**를 원곡 가수의 노래와 비교하여 점수를 산정하고, 두가지 **그래프로 표시**해 줌
- **틀린 구간을 선별**해 가사와 반주를 실행해 반복 연습 가능
<img src="https://github.com/user-attachments/assets/9cceae9a-cbfc-4656-961a-3c62b8dbd509" width="20%" height="20%"/>
<img src="https://github.com/user-attachments/assets/b2cbd1bf-3b79-4782-97d6-1d64a02525cd" width="20%" height="20%"/>
<img src="https://github.com/user-attachments/assets/d6cfddd7-292c-4f1d-8aab-4635fc0e05f9" width="20%" height="20%"/>
<img src="https://github.com/user-attachments/assets/401ba3bf-9ba2-454e-a170-e06760d33c82" width="20%" height="20%"/>
<img src="https://github.com/user-attachments/assets/ab2a84b3-0ca8-41c2-b438-24dea12ee47f" width="17%" height="17%"/>

**■ 트레이닝 페이지 - 음역대 진단**
- 피아노 건반을 눌러서 재생되는 음정을 따라 음을 내면 사용자가 소리낸 음정과 주파수를 보여줌
- 1옥타브 ~ 3옥타브까지 확인 가능
<img src="https://github.com/user-attachments/assets/c48378c5-ad99-4d79-b4f5-7259cd6844bf" width="30%" height="30%"/>

**■ 매칭 페이지**
- 사용자 간의 멘토 멘티 매칭
- 전문가와의 멘토 멘티 매칭
- 사용자 멘토는 레벨 5이상부터 등록 가능
<img src="https://github.com/user-attachments/assets/84711f62-c9e5-4fb3-8b0c-232a9d062839" width="30%" height="30%"/>

**■ 마이 페이지**
- 음색 정보 확인
- 보컬 데이터 확인
- 트레이닝 기록 확인
<img src="https://github.com/user-attachments/assets/dd010647-f565-43e1-8ef3-c4321c95b49f" width="30%" height="30%"/>

## 3. 핵심 트러블 슈팅

<details>
<summary>Flask의 session 정보 유지 불가 문제 </summary>
  
  - 문제 정의
    - Flask의 session에 정보를 저장했을 때, 다른 엔드 포인트에서 session 정보를 인식하지 못하는 문제가 발생했다.
  - 사실 수집
    - 엔드포인트 하나 하나 session을 설정해보았지만, 해당 session을 설정했던 엔드포인트에서만 session 정보를 인식하고 나머지는 모두 인식하지 못한다.
  - 원인추론
    - 새로운 폴더와 HTML 파일 만들어 간단히 session 기능을 테스트해보니 문제가 없다.
    - 같은 코드를 js 파일과 함께 실행하면 session 정보를 인식하지 못한다.
    - js 파일에서 session 정보를 저장하는 것에 문제가 생긴 것 아닐까?
  - 조치 방안과 결과
    - (1) Flask 서버에서 CORS(Cross-Origin Resource Sharing) 허용 코드를 추가한다. `CORS(app, supports_credentials=True)`
    - (2) js파일의 Fetch 메서드에 쿠키 값 공유 허용 코드를 추가한다. `credentials: "include"`
    - 위 두가지 설정 이후 session 정보 공유 문제는 모두 해결되었다.
</details>


## 4. 그 외 트러블 슈팅

<details>
<summary> AWS EC2 서버 설정 </summary>

  - 일부 녹음이 Python 파일 자체로 진행되었는데, 그대로 AWS EC2 서버에 업로드하니 녹음 장치를 찾을 수 없다는 오류가 발생했다.
  - 녹음 과정을 전부 프론트엔드에서 받고 mp3 파일만 서버로 전송해 받아 사용하는 방식으로 변경해 해결되었다.
</details>
