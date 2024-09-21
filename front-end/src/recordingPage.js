import React, { useState, useRef } from 'react';
import './recordingPage.css';
import "./common/root.css";
import Header2 from './common/Header2.js';

function RecordingPage() {
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
        <Header2 />
        <div className='immediate_feedback_analyze'>
          <div className='song_container'>
            <div className='song_info_container'>
              <div className='song_img'>
                <img src='./img/songs/supernova.png' alt="Supernova" />
              </div>
              <div className='song_name'>Supernova</div>
              <div className='song_artist'>aespa</div>
            </div>

            <div className='song_lyrics_container'>가사</div>

            <div className='btn_container'>
              {/* Play 버튼: 녹음 시작 또는 재개 */}
              <div className='playbtn_container'>
                <img
                  src={isPlaying ? '/img/stopbtn.png' : '/img/playbtn.png'}
                  alt="Play or Pause Button"
                  onClick={isPlaying ? handlePause : handleStart} // 상태에 따라 재생/일시정지
                />
              </div>

              {/* Stop 버튼: 녹음 중지 및 서버 업로드 */}
              <div className='stopbtn_container'>
                <img
                  src='/img/pausebtn.png'
                  alt="Stop Button"
                  onClick={handleStop} // 녹음 중지
                  disabled={!isPlaying && !isPaused} // 녹음 중이 아니면 비활성화
                />
              </div>
            </div>
            <audio ref={audioRef} src="./mr/hug_me.wav" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordingPage;
