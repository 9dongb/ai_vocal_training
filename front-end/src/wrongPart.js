import React, { useState, useEffect } from "react";
import "./immediate_feedback_analyze.css";
import "./wrongPart.css";
import "./common/root.css";
import Footer from "./common/Footer";

const WrongPart = () => {
  const [wrongParts, setWrongParts] = useState([]); // 틀린 구간 데이터를 저장할 상태
  const [currentAudio, setCurrentAudio] = useState(null); // 현재 재생 중인 오디오
  const [currentTime, setCurrentTime] = useState(0); // 멈춘 시간 저장
  const [isPlaying, setIsPlaying] = useState([]); // 재생 상태 관리

  // 서버에서 틀린 구간 데이터를 가져오는 함수
  const fetchWrongSegments = async () => {
    try {
      const response = await fetch("http://localhost:5000/wrong_segments", {
        method: "GET",
      });
      const data = await response.json();

      // 틀린 구간 정보를 상태에 저장
      const newWrongParts = data.wrong_file.map((file, index) => ({
        imgSrc: `img/songs/cover_${index + 1}.png`, // 이미지를 인덱스에 맞춰 설정 (임시로 1, 2, 3 등)
        songName: "노래 제목", // 서버에서 받아온 값을 넣을 수도 있음
        partName: `파트 ${index + 1}`,
        audioSrc: `/assets/audio/artist/vocal/${file}`, // 서버에서 받은 오디오 파일 경로 사용
      }));
      setWrongParts(newWrongParts);
      setIsPlaying(new Array(newWrongParts.length).fill(false)); // 재생 상태 초기화
    } catch (error) {
      console.error("Error fetching wrong segments:", error);
    }
  };

  useEffect(() => {
    fetchWrongSegments();
  }, []);

  const togglePlayPause = (index) => {
    if (isPlaying[index]) {
      // 재생 중이면 일시정지
      currentAudio.pause();
      setCurrentTime(currentAudio.currentTime); // 현재 재생 시간을 저장
      setCurrentAudio(null);
      updateIsPlaying(index, false);
    } else {
      // 재생하지 않는 상태에서 새로 재생
      if (currentAudio) {
        currentAudio.pause(); // 다른 오디오 정지
      }

      const newAudio = new Audio(wrongParts[index].audioSrc);
      newAudio.currentTime = currentTime; // 멈춘 부분부터 재생
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

  // 정지 버튼 눌렀을 때 (맨 처음으로 돌아가기)
  const handlePauseClick = (index) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentTime(0); // 항상 재생 위치를 처음으로 초기화
      setCurrentAudio(null); // 현재 오디오를 null로 설정
      updateIsPlaying(index, false);
    }
  };

  // 컴포넌트가 언마운트될 때 오디오 정지
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
                  src="/img/pausebtn.png"
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
