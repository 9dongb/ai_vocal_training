import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
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

  // 오디오 재생 및 녹음 시작
  const handleStart = async () => {
    if (audioRef.current) {
      audioRef.current.play();
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
                <img src="img\songs\cover_hug.png" alt="안아줘" />
              </div>
              <div>
                <div className="song_name ">안아줘</div>
                <div className="song_artist">정준일</div>
              </div>
            </div>

            <div className="song_lyrics_container">
              <div className="lyrics_header">
                <img src="img\lyrics.png" alt="안아줘" />
                <span>Lyrics</span>
              </div>
              <div className="lyrics_text">
                서러운 맘을 못 이겨
                <br /> 잠 못 들던 어둔 밤을 또 견디고
                <br /> 내 절망관 상관없이
                <br /> 무심하게도 아침은 날 깨우네
                <br />
                <br /> 상처는 생각보다 쓰리고
                <br /> 아픔은 생각보다 깊어가
                <br /> 널 원망하던 수많은 밤이 내겐 지옥 같아
                <br />
                <br /> 내 곁에 있어줘, 내게 머물러줘
                <br /> 네 손을 잡은 날 놓치지 말아줘
                <br /> 이렇게 네가 한걸음 멀어지면
                <br /> 내가 한 걸음 더 가면 되잖아
                <br />
                <br /> 하루에도 수천 번씩
                <br /> 네 모습을 되뇌이고 생각했어
                <br /> 내게 했던 모진 말들
                <br /> 그 싸늘한 눈빛 차가운 표정들
                <br />
                <br /> 넌 참 예쁜 사람이었잖아
                <br /> 넌 참 예쁜 사람이었잖아
                <br /> 제발 내게 이러지 말아줘, 넌 날 잘 알잖아
                <br />
                <br /> 내 곁에 있어줘, 내게 머물러줘
                <br /> 네 손을 잡은 날 놓치지 말아줘
                <br /> 이렇게 네가 한걸음 멀어지면
                <br /> 내가 한 걸음 더 가면 되잖아
                <br />
                <br /> 내겐 내가 없어, 난 자신이 없어
                <br /> 네가 없는 하루 견딜 수가 없어
                <br /> 이젠 뭘 어떻게 해야 할지 모르겠어,
                <br /> 네가 없는 난
                <br />
                <br /> 그냥 날 안아줘, 나를 좀 안아줘
                <br /> 아무 말 말고서 내게 달려와줘
                <br /> 외롭고 불안하기만 한 맘으로
                <br /> 이렇게 널 기다리고 있잖아
                <br /> 난 너를 사랑해, 난 너를 사랑해
                <br /> 긴 침묵 속에서 소리 내 외칠게
                <br /> 어리석고 나약하기만 한 내 마음을
              </div>
            </div>

            <div className="btn_container">
              {/* Play 버튼: 녹음 시작 또는 재개 */}
              <div className="playbtn_container">
                <img src={isPlaying ? "/img/stopbtn.png" : "/img/playbtn.png"} alt="Play or Pause Button" onClick={isPlaying ? handlePause : handleStart} />
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

            <audio ref={audioRef} src="./mr/hug_me.wav" />
          </div>
        </div>
        <Footer activeTab="training" />
      </div>
    </div>
  );
}

export default Immediate_feedback_analyze;