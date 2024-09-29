import React, { useState } from "react";
import "./feedback.css";
import "./common/root.css";
import Footer from "./common/Footer";
import Chart from "react-apexcharts";

function FeedbackChart() {
  const [tuneChartData, setTuneChartData] = useState({
    series: [
      {
        name: "Tune Data",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        //height: 350,
        //type: "line",
        zoom: {
          enabled: true,
        },
      },
      //colors: ["#FF5733", "#33FF57"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "",
        align: "left",
      },
      xaxis: {
        //categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      },
      tooltip: {
        enabled: true,
      },
    },
  });
  const [beatChartData, setBeatChartData] = useState({
    series: [
      {
        name: "Beat Data",
        data: [10, 21, 35, 51, 59, 62, 69, 91, 90],
      },
    ],
    options: {
      chart: {
        //height: 350,
        //type: "line",
        zoom: {
          enabled: true,
        },
      },

      colors: ["#FF5733"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "",
        align: "left",
      },
      xaxis: {
        //categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      },
      tooltip: {
        enabled: true,
      },
    },
  });
  const [pronunciationChartData, setPronunciationChartData] = useState({
    series: [
      {
        name: "Pronunciation Data",
        data: [10, 41, 35, 51, 59, 62, 69, 32, 54],
      },
    ],
    options: {
      chart: {
        //height: 350,
        //type: "line",
        zoom: {
          enabled: true,
        },
      },
      colors: ["#33FF57"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "",
        align: "left",
      },
      xaxis: {
        //categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      },
      tooltip: {
        enabled: true,
      },
    },
  });

  return (
    <div className="body">
      <div className="container">
        <div className="feedback">
          <div className="header_title">음정 그래프</div>

          <div className="feedback_component feedback_chart_component">
            <div className="feedback_chart">
              <Chart options={tuneChartData.options} series={tuneChartData.series} type="line" width={500} height={350} />
            </div>
            <div>
              <div className=" feedback_header">좋습니다!</div>
              <div className=" feedback_text">음정이 완벽합니다</div>
            </div>
          </div>

          <div className="header_title">박자 그래프</div>

          <div className="feedback_component feedback_chart_component">
            <div className="feedback_chart">
              <Chart options={beatChartData.options} series={beatChartData.series} type="line" width={500} height={350} />
            </div>
            <div>
              <div className="feedback_song_info_songname feedback_header">보통입니다!</div>
              <div className="feedback_song_info_singer feedback_text">반복 학습을 진행해 보세요</div>
            </div>
          </div>

          <div className="header_title">발음 그래프</div>

          <div className="feedback_component feedback_chart_component">
            <div className="feedback_chart">
              <Chart options={pronunciationChartData.options} series={pronunciationChartData.series} type="line" width={500} height={350} />
            </div>
            <div>
              <div className="feedback_song_info_songname feedback_header">많이 부족합니다!</div>
              <div className="feedback_song_info_singer feedback_text">부족한 부분을 다시 연습해 보세요</div>
            </div>
          </div>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
}
export default FeedbackChart;
