import Footer from "./common/Footer";
import "./common/root.css";
import "./main.css";
const Matching = () => {
  return (
    <div className="body">
      <div className="container">
        <div className="main">
          <div className="singing_battle">
            <div className="singking_battle_title">MATCHING</div>

            <div className="mypage_component">
              <div className="battle_text">
                <span className="battle_text_1">나는윤혜빈</span>
                <span className="battle_text_2">yhb1129</span>
              </div>
              <img src=".\img\mypage_user_icon.png" className="mypage_user_icon" alt="배틀 이미지" />
            </div>
            <div className="singking_battle_title">매칭 메뉴</div>
            <div className="battle_component">
              <div className="battle_text">
                <span className="battle_text_1">보컬 코치 매칭</span>
                <span className="battle_text_2">전문 보컬 코치가 내 노래를 코칭 해줍니다</span>
              </div>
            </div>

            <div className="battle_component">
              <div className="battle_text">
                <span className="battle_text_1">보컬 코치 등록</span>
                <span className="battle_text_2">전문 보컬 코치가 되어 노래를 가르칠 수 있습니다</span>
              </div>
            </div>

            <div className="battle_component">
              <div className="battle_text">
                <span className="battle_text_1">매칭 기록</span>
                <span className="battle_text_2">코칭을 진행한 매칭 기록을 확인할 수 있습니다</span>
              </div>
            </div>
          </div>
        </div>
        <Footer activeTab="matching" />
      </div>
    </div>
  );
};

export default Matching;
