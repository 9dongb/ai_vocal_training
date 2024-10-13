import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import "./immediate_feedback_analyze.css";
import "./common/root.css";
import Footer from "./common/Footer";

function Immediate_feedback_analyze() {
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태
  const [isPaused, setIsPaused] = useState(false); // 녹음 일시 중지 상태
  const audioRef = useRef(null); // 오디오 요소 참조
  const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorder 참조
  const [recordedChunks, setRecordedChunks] = useState([]); // 녹음된 데이터 저장
  const navigate = useNavigate(); // useNavigate 훅 사용

  // useLocation으로 전달된 state에서 songTitle, artist, imagePath 받아오기
  const location = useLocation();
  const { songTitle, artist, imagePath } = location.state || {
    songTitle: "기본 제목",
    artist: "기본 가수",
    imagePath: "./img/songs/default.png", // 기본 이미지 경로
  };

  const [lyrics, setLyrics] = useState([]); // 가사 데이터 상태
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0); // 현재 하이라이팅할 가사 인덱스
  const currentLyricRefs=useRef([]); //각 가사에 대한 참조 배열

  // 백엔드에서 가사 파일을 불러오는 함수
  const fetchLyrics = async () => {
    try {
      const response = await fetch("http://localhost:5000/training", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songTitle: songTitle,  // 선택된 노래 제목
          artist: artist,        // 선택된 가수명
        }),
      });
      const data = await response.json();
      setLyrics(data.lyrics); // 받아온 배열을 바로 상태에 저장
    } catch (error) {
      console.error("Failed to fetch lyrics:", error);
    }
  };


  // 컴포넌트가 마운트될 때 가사 불러오기
  useEffect(() => {
    fetchLyrics(); // 가사를 불러오는 API 호출
  }, []);

  // 오디오 시간 업데이트 이벤트 핸들러
  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;

    // 현재 재생 시간에 맞는 가사를 찾기
    const currentIndex = lyrics.findIndex(
      (lyric, index) =>
        currentTime >= lyric[0] &&
        (index === lyrics.length - 1 || currentTime < lyrics[index + 1][0])
    );

    if (currentIndex !== -1 && currentIndex !== currentLyricIndex) {
      setCurrentLyricIndex(currentIndex);
    }
  };

  //currentLyricIndex가 변경될 때마다 하이라이팅된 가사로 스크롤 이동
  useEffect(()=>{
    if(currentLyricRefs.current[currentLyricIndex]){
      currentLyricRefs.current[currentLyricIndex].scrollIntoView({
        behavior:"smooth",
        block:"center",
      });
    }
  },[currentLyricIndex]);

  // 오디오 재생 및 녹음 시작
  const handleStart = async () => {
    if (audioRef.current) {
      // 오디오가 로드될 때까지 기다린 후 재생
      audioRef.current.addEventListener("canplay", () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      });
      audioRef.current.load(); // 오디오 로드
    } else {
      console.error("오디오 요소가 존재하지 않습니다.");
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
  
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
  
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setRecordedChunks(chunks);
        console.log("녹음된 데이터 Blob:", blob);
        uploadToServer(blob); // 녹음이 멈추면 서버로 업로드
      };
  
      recorder.start();
      setIsPlaying(true);
      setIsPaused(false);
      console.log("녹음 및 재생 시작");
    } catch (error) {
      console.error("녹음 시작 오류:", error);
    }
  };
  

  // 녹음 일시 중지 함수
  const handlePause = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
      console.log("녹음 및 재생 일시 중지");
    }
  };

  // 녹음 재개 함수
  const handleResume = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      audioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
      console.log("녹음 및 재생 재개");
    }
  };

  // 녹음 완전히 멈추는 함수 (업로드는 recorder.onstop에서 처리됨)
  const handleStop = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
      console.log("녹음 중지");
      navigate("/feedback"); // 녹음이 중지되면 feedback 페이지로 이동
    }
  };

  // 서버로 녹음된 파일 전송 함수
  const uploadToServer = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav"); // 서버에 파일로 전송

    try {
      const response = await fetch("http://localhost:5000/uploads", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("서버 응답:", result);
    } catch (error) {
      console.error("서버로 파일 업로드 실패:", error);
    }
  };

  return (
    <div className="body">
      <div className="container">
        <div className="immediate_feedback_analyze">
          <div className="song_container">
            <div className="recording_status">녹음 중</div>

            <div className="song_info_container">
              <div className="song_img">
              <img src={imagePath} alt={songTitle} />
              </div>
              <div>
                <div className="song_name ">{songTitle}</div> {/* 제목 표시 */}
                <div className="song_artist">{artist}</div> {/* 가수 표시 */}
              </div>
            </div>

            <div className="song_lyrics_container">
              <div className="lyrics_header">
                <img src="img/lyrics.png" alt={songTitle} />
                <span>Lyrics</span>
              </div>
              <div className="lyrics_text">
                {lyrics.map((lyric, index) => (
                  <p
                  key={index}
                  ref={(el) => (currentLyricRefs.current[index] = el)}
                  className={index === currentLyricIndex ? "highlighted-lyric" : ""}
                >
                    {lyric[1]} {/* 가사 텍스트 */}
                  </p>
                ))}
              </div>
            </div>

            <div className="btn_container">
              {/* Play 버튼: 녹음 시작 또는 재개 */}
              <div className="playbtn_container">
                <img
                  src={isPlaying ? "/img/stopbtn.png" : "/img/playbtn.png"}
                  alt="Play or Pause Button"
                  onClick={isPlaying ? handlePause : handleStart}
                />
                <p className="btn_text">{isPlaying ? "일시정지" : isPaused ? "재개" : "재생"}</p>
              </div>

              {/* Stop 버튼: 녹음 중지 및 서버 업로드 */}
              <div className="stopbtn_container">
                <img
                  src="/img/pausebtn.png"
                  alt="Stop Button"
                  onClick={handleStop} // 녹음 중지 후 feedback 페이지로 이동
                  disabled={!isPlaying && !isPaused}
                />
                <p className="btn_text">정지</p>
              </div>
            </div>

            <audio
              ref={audioRef}
              src="./mr/hug_me.wav"
              preload="auto"
              onTimeUpdate={handleTimeUpdate} // 오디오 재생 시간 업데이트 핸들러 등록
            />
          </div>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
}

export default Immediate_feedback_analyze;
