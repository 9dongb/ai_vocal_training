import Footer from "./common/Footer";
import "./common/root.css";
import "./training.css";

const PrecisionTraining = () => {
  return (
    <div className="body">
      <div className="container">
        <div className="main">
          <div className="ai_training">
            <div className="header_title">최근 연습한 노래</div>

            <div className="drag_menu_component">
              <div className="drag_menu_component_1">
                <img className="ai_diagnosis_img" src=".\img\songs\cover_hug.png" alt="안아줘" />
                <div className=" ai_text">
                  <p className="ai_text_1">안아줘</p>
                  <p className="ai_text_2">정준일</p>
                </div>
              </div>
              <div className="drag_menu_component_1">
                <img className="ai_diagnosis_img" src=".\img\songs\cover_if_it_is_you.png" alt="너였다면" />
                <div className=" ai_text">
                  <p className="ai_text_1">너였다면</p>
                  <p className="ai_text_2">정승환</p>
                </div>
              </div>
              <div className="drag_menu_component_1">
                <img className="ai_diagnosis_img" src=".\img\songs\cover_wobbly_flowers.png" alt="흔들리는 꽃들 속 에서 네 샴푸 향이 느껴진 거야" />
                <div className=" ai_text">
                  <p className="ai_text_1">흔들리는 꽃들 속 에서 네 샴푸 향이 느껴진 거야</p>
                  <p className="ai_text_2">장범준</p>
                </div>
              </div>
            </div>

            <div className="header_title">추천 곡</div>

            <div className="drag_menu_component">
              <div className="drag_menu_component_1">
                <img className="ai_diagnosis_img" src=".\img\songs\cover_letter_at_night.png" alt="밤편지" />
                <div className=" ai_text">
                  <p className="ai_text_1">밤편지</p>
                  <p className="ai_text_2">아이유</p>
                </div>
              </div>
              <div className="drag_menu_component_1">
                <img className="ai_diagnosis_img" src=".\img\songs\cover_wild_flower.png" alt="야생화" />
                <div className=" ai_text">
                  <p className="ai_text_1">야생화</p>
                  <p className="ai_text_2">박효신</p>
                </div>
              </div>
              <div className="drag_menu_component_1">
                <img className="ai_diagnosis_img" src=".\img\songs\cover_a_blue_whale.png" alt="흰수염고래" />
                <div className=" ai_text">
                  <p className="ai_text_1">흰수염고래</p>
                  <p className="ai_text_2">YB</p>
                </div>
              </div>
            </div>

            <div className="header_title">인기있는 가수</div>

            <div className="drag_menu_component drag_menu_component_ai">
              <div className="drag_menu_component_1 drag_menu_component_1_short">
                <img className="ai_precise_img" src=".\img\singers\cover_iu.png" alt="아이유" />
                <div className=" ai_text">
                  <p className="ai_text_1">아이유</p>
                </div>
              </div>
              <div className="drag_menu_component_1 drag_menu_component_1_short">
                <img className="ai_precise_img" src=".\img\singers\cover_jung_seung_hwan.png" alt="정승환" />
                <div className=" ai_text">
                  <p className="ai_text_1">정승환</p>
                </div>
              </div>
              <div className="drag_menu_component_1 drag_menu_component_1_short">
                <img className="ai_precise_img" src=".\img\singers\cover_Jung_Joon_il.png" alt="정준일" />
                <div className=" ai_text">
                  <p className="ai_text_1">정준일</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
};

export default PrecisionTraining;
