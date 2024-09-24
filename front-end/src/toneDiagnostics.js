import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./common/Footer";
import "./common/root.css";
import "./training.css";
import "./toneDiagnostics.css";

const ToneDiagnostics = () => {
  const [isPlaying, setIsPlaying] = useState(false); // 녹음 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 녹음 시작 함수
  const handleStart = async () => {
    console.log("녹음이 시작되었습니다.");
    // 여기에 실제 녹음 시작 로직을 추가하세요
  };

  // 녹음 종료 함수
  const handleStop = async () => {
    console.log("녹음이 종료되었습니다.");
    // 여기에 실제 녹음 종료 로직을 추가하세요
    navigate("/toneDiagnosticsResult"); // 페이지 이동
  };

  // 재생 상태에 따른 토글 함수
  const handleToggle = async () => {
    if (isPlaying) {
      // 녹음이 진행 중일 때 클릭하면 종료
      await handleStop();
    } else {
      // 녹음이 멈춘 상태에서 클릭하면 시작
      await handleStart();
    }
    setIsPlaying((prevState) => !prevState); // 토글 상태 전환
  };

  return (
    <div className="body">
      <div className="container">
        <div className="main">
          <div className="tone_diagnostics">
            <div className="header_title">AI 음색 진단</div>
            <div className="tone_diagnostics_component tone_diagnostics_mid_component">
              <div className="tone_diagnostics_lp_area">
                <img
                  className={`tone_diagnostics_lp ${isPlaying ? "tone_diagnostics_lp_animation" : ""}`}
                  src=".\img\tone_diagnostics_lp.png"
                  alt="ai cover 이미지"
                />
                <img className="tone_diagnostics_player" src=".\img\tone_diagnostics_player.png" alt="ai cover 이미지" />
                <p className="ai_text_2 tone_diagnostics_text">음색은 발라드, 락, 트로트, 댄스 4가지로 구분합니다</p>
              </div>
            </div>
            <p className="ai_text_2 tone_diagnostics_text">{isPlaying ? "AI 분석용 녹음이 진행 중입니다" : "버튼을 누르고 아무 노래 한 소절을 불러주세요"}</p>
            <div
              className="tone_diagnostics_component tone_recording_button"
              onClick={handleToggle} // 클릭하면 토글 함수 호출
            >
              <img className="tone_cover_img" src={isPlaying ? "/img/ai_precise_img_1_stop.png" : "/img/ai_precise_img_1.png"} alt="ai cover 이미지" />
            </div>
          </div>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
};

export default ToneDiagnostics;
