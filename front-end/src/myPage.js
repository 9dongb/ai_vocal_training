import Footer from "./common/Footer";
import "./common/root.css";
import "./main.css";
const MyPage = () => {
  return (
    <div className="body">
      <div className="container">
        <div className="main">
          <div className="singing_battle">
            <div className="singking_battle_title">MYPAGE</div>

            <div className="mypage_component">
              <div className="battle_text">
                <span className="battle_text_1">나는윤혜빈</span>
                <span className="battle_text_2">yhb1129</span>
              </div>
              <img src=".\img\mypage_user_icon.png" className="mypage_user_icon" alt="배틀 이미지" />
            </div>

            <div className="singking_grow">
              <div className="singking_grow_title">보컬 데이터 확인</div>
              <div className="grow_component">
                <div className="grow_component_1">
                  <br />
                  <span className="battle_text_1">레벨</span>
                  <br />
                  <div className="key_score">12</div>
                </div>
                <div className="grow_component_1">
                  <br />
                  <span className="battle_text_1">음역</span>
                  <br />
                  <div className="beat_score">83점</div>
                </div>
                <div className="grow_component_1">
                  <br />
                  <span className="battle_text_1">음색</span>
                  <br />
                  <div className="pronun_score">96점</div>
                </div>
              </div>
            </div>

            <div className="battle_component">
              <div className="battle_text">
                <span className="battle_text_1">트레이닝 기록</span>
                <span className="battle_text_2">음정 점수 기록, 박자 점수 기록, 발음 점수 기록</span>
              </div>
            </div>

            <div className="battle_component">
              <div className="battle_text">
                <span className="battle_text_1">설정</span>
                <span className="battle_text_2">회원정보, 멤버십, 공지사항, 고객센터</span>
              </div>
            </div>

            <div className="battle_component">
              <div className="battle_text">
                <span className="battle_text_1">로그아웃</span>
                <span className="battle_text_2">서비스 사용 종료</span>
              </div>
            </div>
          </div>
        </div>
        <Footer activeTab="myPage" />
      </div>
    </div>
  );
};

export default MyPage;
