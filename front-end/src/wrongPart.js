import React, { useState, useEffect } from "react";
import "./immediate_feedback_analyze.css";
import "./wrongPart.css";
import "./common/root.css";
import Footer from "./common/Footer";

const WrongPart = () => {
  const wrongParts = [ //틀린부분 음원소스: audioSrc
    { imgSrc: "img/songs/cover_hug.png", songName: "안아줘", partName: "파트1", audioSrc: "./mr/hug_me.wav" },
    { imgSrc: "img/songs/cover_hug.png", songName: "안아줘", partName: "파트2", audioSrc: "./mr/hug_me.wav" },
    { imgSrc: "img/songs/cover_hug.png", songName: "안아줘", partName: "파트3", audioSrc: "./mr/hug_me.wav" },
    { imgSrc: "img/songs/cover_hug.png", songName: "안아줘", partName: "파트4", audioSrc: "./mr/hug_me.wav" },
    { imgSrc: "img/songs/cover_hug.png", songName: "안아줘", partName: "파트5", audioSrc: "./mr/hug_me.wav" },
    { imgSrc: "img/songs/cover_hug.png", songName: "안아줘", partName: "파트6", audioSrc: "./mr/hug_me.wav" },
    { imgSrc: "img/songs/cover_hug.png", songName: "안아줘", partName: "파트7", audioSrc: "./mr/hug_me.wav" }
  ];

  const [currentAudio, setCurrentAudio] = useState(null); // 현재 재생 중인 오디오
  const [currentTime, setCurrentTime] = useState(0); // 멈춘 시간 저장
  const [isPlaying, setIsPlaying] = useState(
    new Array(wrongParts.length).fill(false)
  );

  const togglePlayPause = (index) => {
    if (isPlaying[index]) {
      // 재생중>일시정지
      currentAudio.pause();
      setCurrentTime(currentAudio.currentTime); // 현재 재생 시간을 저장
      setCurrentAudio(null);
      updateIsPlaying(index, false);
    } else {
      // 다시 재생
      if (currentAudio) {
        currentAudio.pause(); // 오디오 정지
      }

      const newAudio = new Audio(wrongParts[index].audioSrc);

      // 멈춘 부분부터 재생
      newAudio.currentTime = currentTime;

      setCurrentAudio(newAudio);
      newAudio.play();
      updateIsPlaying(index, true);

      // 오디오가 종료되면 상태 초기화
      newAudio.onended = () => {
        updateIsPlaying(index, false);
        setCurrentTime(0);
        setCurrentAudio(null);
      };
    }
  };

  // 상태 초기화 함수
  const updateIsPlaying = (index, playing) => {
    const newIsPlaying = new Array(wrongParts.length).fill(false);
    if (playing) {
      newIsPlaying[index] = true;
    }
    setIsPlaying(newIsPlaying);
  };

   //정지 버튼 눌렀을때(맨 처음으로 돌아가기)
   const handlePauseClick = (index) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentTime(0); // 항상 재생 위치를 처음으로 초기화
      setCurrentAudio(null); // 현재 오디오를 null로 설정
      updateIsPlaying(index, false);
    }
  };

  // 컴포넌트가 언마운트 될 때 오디오 정지
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  return (
    <div className="body">
      <div className="container">
        <div className="song_container">
          <div className="header_title">틀린 구간</div>
          {wrongParts.map((part, index) => (
            <div key={index} className="wrong_part_container">
              <div className="song_img">
                <img src={part.imgSrc} alt={part.songName} />
              </div>
              <div>
                <div className="wrong_name">{part.songName}</div>
                <div className="wrong_artist">{part.partName}</div>
              </div>

              <div className="wrong_play_Btn">
                {/* 재생 버튼 */}
                <img
                  className="wrong_play_img"
                  src={isPlaying[index] ? "/img/stopbtn.png" : "/img/playbtn.png"}
                  alt={isPlaying[index] ? "stop" : "play"}
                  onClick={() => togglePlayPause(index)}
                />
                {/* pause 버튼 */}
                <img
                  className="wrong_pause_img"
                  src={"/img/pausebtn.png"}
                  alt="pause"
                  onClick={() => handlePauseClick(index)}
                />
              </div>

            </div>
          ))}
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
};

export default WrongPart;
