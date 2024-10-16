import React from "react";
import "./feedback.css";
import "./common/root.css";
import Footer from "./common/Footer";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Feedback() {
  const location = useLocation();

  // location.state로 전달된 값을 받습니다.
  const { songTitle, artist, imagePath } = location.state || {
    songTitle: "기본 제목",
    artist: "기본 가수",
    imagePath: "./img/songs/default.png", // 기본 이미지 경로
  };

  return (
    <div className="body">
      <div className="container">
        <div className="feedback">
          <div className="header_title">평가노래</div>
          <div className="feedback_song_info feedback_component">
            <div>
              <div className="feedback_song_info_songname feedback_header">{songTitle}</div>
              <div className="feedback_song_info_singer feedback_text">{artist}</div>
            </div>

            <div className="feedback_song_info_container">
              <img className="feedback_song_info_img" src={imagePath} alt={songTitle} />
            </div>
          </div>

          <div className="header_title">종합 점수</div>
          <div className="feedback_final_score feedback_component">
            <div>
              <div className="feedback_header">97.28</div>
              <div className="feedback_text">좋은 점수네요! 축하드립니다</div>
            </div>
          </div>

          <div className="header_section">
            <div className="header_title part_score">파트 점수</div>
            <div className="detail_label">
              <Link to={{ pathname: "/feedbackChart", state: { songTitle: songTitle, artist: artist, imagePath: imagePath } }} className="detail_link">
                자세히 보기
              </Link>
            </div>
          </div>
          <div className="grow_component">
            <div className="grow_component_1">
              <img src=".\img\key.png" alt="음정 아이콘"></img>
              <br />
              음정
              <br />
              <div className="key_score">71점</div>
            </div>
            <div className="grow_component_1">
              <img src=".\img\beat.png" alt="박자 아이콘"></img>
              <br />
              박자
              <br />
              <div className="beat_score">83점</div>
            </div>
            <div className="grow_component_1">
              <img src=".\img\pronun.png" alt="발음 아이콘"></img>
              <br />
              발음
              <br />
              <div className="pronun_score">78점</div>
            </div>
          </div>

          <Link to="/wrongPart">
            <div className="header_title">틀린구간</div>
            <div className="wrong_part feedback_component">
              <div>
                <div className="feedback_header">확인 및 연습</div>
                <div className="feedback_text">부족한 부분을 다시 연습해보세요</div>
              </div>
            </div>
          </Link>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
}
export default Feedback;
