import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./feedback.css";
import "./common/root.css";
import Footer from "./common/Footer";
import Chart from "react-apexcharts";

function FeedbackChart() {
  const location = useLocation();
  const { artist, songTitle } = location.state || {
    artist: "기본 가수",
    songTitle: "기본 제목",
  };

  const tuneGraphSrc = `/assets/graph/${artist}-${songTitle}.png`;
  const beatGraphSrc = `/assets/graph/${artist}-${songTitle}-beat.png`;

  const [showTuneChart, setShowTuneChart] = useState(true);
  const [showBeatChart, setShowBeatChart] = useState(true);

  // 각 차트에 대한 평가 결과 상태
  const [tuneFeedbackLevel, setTuneFeedbackLevel] = useState(1); // 1: 좋습니다, 2: 보통입니다, 3: 부족합니다
  const [beatFeedbackLevel, setBeatFeedbackLevel] = useState(3); // 1: 좋습니다, 2: 보통입니다, 3: 부족합니다

  const [tuneChartData, setTuneChartData] = useState({
    series: [
      {
        name: "원본 음성 데이터",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 10, 41, 35, 51, 49, 62],
      },
      {
        name: "사용자 음성 데이터",
        data: [10, 21, 35, 51, 59, 62, 69, 91, 90, 10, 21, 35, 51, 59, 62],
      },
    ],
    options: {
      chart: {
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        opacity: [0.4, 1],
      },
      xaxis: {},
      tooltip: {
        enabled: true,
      },
    },
  });

  const [beatChartData, setBeatChartData] = useState({
    series: [
      {
        name: "원본 박자 데이터",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
      {
        name: "사용자 박자 데이터",
        data: [10, 21, 35, 51, 59, 62, 69, 91, 90, 10, 21, 35, 51, 59, 62, 69, 91, 90],
      },
    ],
    options: {
      chart: {
        zoom: {
          enabled: true,
        },
      },
      colors: ["#1E90FF", "#FFD700"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        opacity: [0.4, 1],
      },
      xaxis: {},
      tooltip: {
        enabled: true,
      },
    },
  });

  // 피드백 메시지 결정 함수
  const getFeedbackMessage = (level) => {
    switch (level) {
      case 1:
        return {
          header: "좋습니다!",
          text: "음정이 완벽합니다",
        };
      case 2:
        return {
          header: "보통입니다!",
          text: "반복 학습을 진행해 보세요",
        };
      case 3:
        return {
          header: "부족합니다!",
          text: "부족한 부분을 다시 연습해 보세요",
        };
      default:
        return {
          header: "",
          text: "",
        };
    }
  };

  return (
    <div className="body">
      <div className="container">
        <div className="feedback">
          {/* 음정 그래프 */}
          <div className="feedback_chart_title">
            <div className="header_title">음정 그래프</div>
            <button className="feedback_chart_toggle" onClick={() => setShowTuneChart(!showTuneChart)}>
              {showTuneChart ? "그래프 숨기기" : "그래프 보기"}
            </button>
          </div>
          <div className="feedback_component feedback_chart_component">
            <div className="feedback_chart">
              {showTuneChart ? (
                <Chart options={tuneChartData.options} series={tuneChartData.series} type="line" width={500} height={350} />
              ) : (
                <img className="chart_img" src={tuneGraphSrc} alt="음정 그래프" width={530} height={210} />
              )}
            </div>
            <div>
              {/* 음정 피드백 */}
              <div className="feedback_song_info_songname feedback_header">{getFeedbackMessage(tuneFeedbackLevel).header}</div>
              <div className="feedback_song_info_singer feedback_text">{getFeedbackMessage(tuneFeedbackLevel).text}</div>
            </div>
          </div>

          {/* 박자 그래프 */}
          <div className="feedback_chart_title">
            <div className="header_title">박자 그래프</div>
            <button className="feedback_chart_toggle" onClick={() => setShowBeatChart(!showBeatChart)}>
              {showBeatChart ? "그래프 숨기기" : "그래프 보기"}
            </button>
          </div>

          <div className="feedback_component feedback_chart_component">
            <div className="feedback_chart">
              {showBeatChart ? (
                <Chart options={beatChartData.options} series={beatChartData.series} type="line" width={500} height={350} />
              ) : (
                <img className="chart_img" src={beatGraphSrc} alt="박자 그래프" width={530} height={210} />
              )}
            </div>
            <div>
              {/* 박자 피드백 */}
              <div className="feedback_song_info_songname feedback_header">{getFeedbackMessage(beatFeedbackLevel).header}</div>
              <div className="feedback_song_info_singer feedback_text">{getFeedbackMessage(beatFeedbackLevel).text}</div>
            </div>
          </div>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
}

export default FeedbackChart;
