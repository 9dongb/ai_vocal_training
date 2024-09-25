import React, { useState } from "react";

import Footer from "./common/Footer";
import "./common/root.css";
import "./training.css";
import "./toneDiagnostics.css";
import { Link } from "react-router-dom";

const ToneDiagnosticsResult = () => {
  //협의: 함수 만들어서 if문으로 발라드, 락, 트로트, 댄스 더미 데이터 넣어주기
  //장점: 이미지도 텍스트도 고정값이니 조건문으로 넣는게 구조상 용이함
  return (
    <div className="body">
      <div className="container">
        <div className="main">
          <div className="tone_diagnostics">
            <div className="header_title">AI 음색 진단 결과</div>
            <div className="tone_diagnostics_component tone_diagnostics_result_component tone_margin tone_border">
              <img className="tone_diagnostics_result_img " src=".\img\singers\cover_jung_seung_hwan_big.png" alt="ai cover 이미지" />
              <p className="ai_text_2 tone_diagnostics_text">따뜻하고 감성적인 발라드형 음색입니다.</p>
            </div>
            <div className="header_title">AI 음색 추천 곡</div>
            <div className="tone_diagnostics_component tone_diagnostics_result_component tone_border">
              <div>
                <div className="ai_text_1 tone_text_1">안아줘</div>
                <div className="ai_text_2 ">정준일</div>
                <img className="tone_diagnostics_result_img" src=".\img\songs\cover_hug_circle_big.png" alt="ai cover 이미지" />
              </div>
            </div>

            <div className="drag_menu_component drag_menu_component_ai">
              <Link to="/immediate_feedback_analyze">
                <div className="drag_menu_component_1 drag_menu_component_1_short tone_border">
                  <img className="ai_precise_img" src=".\img\ai_precise_img_1.png" alt="정밀 이미지1" />
                  <div className=" ai_text">
                    <p className="ai_text_1">추천 곡 트레이닝</p>
                  </div>
                </div>
              </Link>
              <Link to="/toneDiagnostics">
                <div className="drag_menu_component_1 drag_menu_component_1_short tone_border">
                  <img className="ai_precise_img" src=".\img\ai_precise_img_3.png" alt="정밀 이미지3" />
                  <div className=" ai_text">
                    <p className="ai_text_1">재진단</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
};

export default ToneDiagnosticsResult;
