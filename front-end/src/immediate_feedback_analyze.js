import React, { useState, useRef } from 'react';
import './immediate_feedback_analyze.css';
import "./common/root.css";
import Footer from "./common/Footer";

function Immediate_feedback_analyze() {
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태
  const [isPaused, setIsPaused] = useState(false); // 녹음 일시 중지 상태
  const audioRef = useRef(null); // 오디오 요소 참조
  const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorder 참조
  const [recordedChunks, setRecordedChunks] = useState([]); // 녹음된 데이터 저장

  // 오디오 재생 및 녹음 시작
  const handleStart = async () => {
    if (audioRef.current) {
      audioRef.current.play();
    }

    // 녹음 시작
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
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedChunks(chunks);
        console.log('녹음된 데이터 Blob:', blob);
        uploadToServer(blob); // 녹음이 멈추면 서버로 업로드
      };

      recorder.start();
      setIsPlaying(true);
      setIsPaused(false); // 처음 시작할 때는 중지 상태 아님
      console.log('녹음 및 재생 시작');
    } catch (error) {
      console.error('녹음 시작 오류:', error);
    }
  };

  // 녹음 일시 중지 함수
  const handlePause = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause(); // 녹음 일시 중지
      audioRef.current.pause(); // 오디오 재생 멈춤
      setIsPaused(true);
      setIsPlaying(false);
      console.log('녹음 및 재생 일시 중지');
    }
  };

  // 녹음 재개 함수
  const handleResume = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume(); // 녹음 재개
      audioRef.current.play(); // 오디오 재생 재개
      setIsPaused(false);
      setIsPlaying(true);
      console.log('녹음 및 재생 재개');
    }
  };

  // 녹음 완전히 멈추는 함수 (업로드는 recorder.onstop에서 처리됨)
  const handleStop = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop(); // 녹음 완전 중지
      audioRef.current.pause(); // 오디오 재생 멈춤
      audioRef.current.currentTime = 0; // 재생 위치 초기화
      setIsPlaying(false);
      setIsPaused(false);
      console.log('녹음 중지');
    }
  };

  // 서버로 녹음된 파일 전송 함수
  const uploadToServer = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav'); // 서버에 파일로 전송

    try {
      const response = await fetch('http://localhost:5000/uploads', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('서버 응답:', result);
    } catch (error) {
      console.error('서버로 파일 업로드 실패:', error);
    }
  };

  return (
    <div className="body">
      <div className='container'>
        <div className='immediate_feedback_analyze'>
          <div className='song_container'>
            <div className='recording_status'>
              녹음 중
            </div>

            <div className='song_info_container'>
              <div className='song_img'>
                <img src='img\songs\cover_hug.png' alt="안아줘" />
              </div>
              <div className='song_name'>안아줘</div>
              <div className='song_artist'>정준일</div>
            </div>

            <div className='song_lyrics_container'>
              <div className='lyrics_text'>
                서러운 맘을 못 이겨<br/>
                잠 못 들던 어둔 밤을 또 견디고<br/>
                내 절망관 상관없이<br/>
                무심하게도 아침은 날 깨우네<br/><br/>
                상처는 생각보다 쓰리고<br/>
                아픔은 생각보다 깊어가<br/>
                널 원망하던 수많은 밤이 내겐 지옥 같아
              </div>
              
            </div>

            <div className='btn_container'>
              {/* Play 버튼: 녹음 시작 또는 재개 */}
              <div className='playbtn_container'>
                <img
                  src={isPlaying ? '/img/stopbtn.png' : '/img/playbtn.png'}
                  alt="Play or Pause Button"
                  onClick={isPlaying ? handlePause : handleStart} // 상태에 따라 재생/일시정지
                />
                <p className='btn_text'>
                  {isPlaying ? '일시정지' : (isPaused ? '재개' : '재생')}
                </p> {/* 상태에 따라 텍스트 변경 */}
              </div>


              {/* Stop 버튼: 녹음 중지 및 서버 업로드 */}
              <div className='stopbtn_container'>
                <img
                  src='/img/pausebtn.png'
                  alt="Stop Button"
                  onClick={handleStop} // 녹음 중지
                  disabled={!isPlaying && !isPaused} // 녹음 중이 아니면 비활성화
                />
                <p className='btn_text'>정지</p>
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
