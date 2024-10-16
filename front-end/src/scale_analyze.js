import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./scale_analyze.css";
import "./common/root.css";
import Footer from "./common/Footer";

function ScaleAnalyze() {
  const notes = [
    { name: "C4", frequency: 261.63, info: "도" },
    { name: "C_4", frequency: 277.18, info: "도#" },
    { name: "D4", frequency: 293.66, info: "레" },
    { name: "D_4", frequency: 311.13, info: "레#" },
    { name: "E4", frequency: 329.63, info: "미" },
    { name: "F4", frequency: 349.23, info: "파" },
    { name: "F_4", frequency: 369.99, info: "파#" },
    { name: "G4", frequency: 392.0, info: "솔" },
    { name: "G_4", frequency: 415.3, info: "솔#" },
    { name: "A4", frequency: 440.0, info: "라" },
    { name: "A_4", frequency: 466.16, info: "라#" },
    { name: "B4", frequency: 493.88, info: "시" },
  ];

  const [activeNote, setActiveNote] = useState(notes[0]); // 현재 활성화된 음 (처음에는 C4)
  const [noteIndex, setNoteIndex] = useState(0); // 현재 음의 인덱스

  const [noteMessage, setNoteMessage] = useState("");
  const [userFrequency, setUserFrequency] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  console.log("초기 noteIndex : ", noteIndex);

  // 녹음 관련
  // const [isPlaying, setIsPlaying] = useState(false); // 재생 상태
  // const [isPaused, setIsPaused] = useState(false); // 녹음 일시 중지 상태
  // const audioRef = useRef(null); // 오디오 요소 참조
  // const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorder 참조
  // const [recordedChunks, setRecordedChunks] = useState([]); // 녹음된 데이터 저장
  // const navigate = useNavigate(); // useNavigate 훅 사용
  //녹음 끝


  // 주어진 주파수의 음을 재생하는 함수
  function playTone(frequency, duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine"; // 피아노 소리에 가까운 sine 파형 사용
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // 주파수 설정
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // 볼륨 설정 (0에서 1 사이)

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration); // 지정한 시간(duration) 동안 재생
  }

  // 음 이름으로 재생하는 함수 (C4, D4, 등)
  function playNoteByName(noteName, duration) {
    const note = notes.find(note => note.name === noteName); // 눌린 음의 정보를 찾음
    const frequency = note?.frequency; // 해당 음의 주파수를 가져옴
    if (frequency) {
      setActiveNote(noteName); // 눌린 음 시각화
      playTone(frequency, duration); // 주어진 음계의 주파수를 사용해 재생

      const index = notes.indexOf(note); // 눌린 음의 인덱스를 찾음
      setNoteIndex(index); // noteIndex 상태를 업데이트함

      console.log("cureent noteName : ", noteName, "frequency : ", frequency);

      setNoteMessage(`현재 건반 음역대: ${note.info}`);
      // 사용자 주파수 가져오기
      fetchUserFrequency(noteName);
    
      // setTimeout(() => setActiveNote(null), duration * 1000); // 음이 끝나면 시각화 해제
    } else {
      console.log("해당 음을 찾을 수 없습니다.");
    }
  }

  // 음을 올리는 함수
  function increaseNote() {
    if (noteIndex < notes.length - 1) {
      console.log("음 올리는 noteIndex : ", noteIndex);
      const nextIndex = noteIndex + 1;
      setNoteIndex(nextIndex);
      playNoteByName(notes[nextIndex].name, 1);
      console.log("음 올리는 noteIndex : ", noteIndex);
    }
  }

  // 음을 내리는 함수
  function decreaseNote() {
    if (noteIndex > 0) {
      console.log("음 내리는 noteIndex : ", noteIndex);
      const prevIndex = noteIndex - 1;
      setNoteIndex(prevIndex);
      playNoteByName(notes[prevIndex].name, 1);
      console.log("음 내리는 noteIndex : ", noteIndex);
    }
  }

  // 음 시작
  function playNote() {
    console.log("시작하는 noteIndex : ", noteIndex);
    playNoteByName(notes[noteIndex].name, 1);
  }


  // 녹음 관련
  // // 오디오 재생 및 녹음 시작
  // const handleStart = async () => {
  //   if (audioRef.current) {
  //     audioRef.current.play();
  //   }

  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const recorder = new MediaRecorder(stream);
  //     setMediaRecorder(recorder);

  //     const chunks = [];
  //     recorder.ondataavailable = (event) => {
  //       if (event.data.size > 0) {
  //         chunks.push(event.data);
  //       }
  //     };

  //     recorder.onstop = () => {
  //       const blob = new Blob(chunks, { type: "audio/wav" });
  //       setRecordedChunks(chunks);
  //       console.log("녹음된 데이터 Blob:", blob);
  //       uploadToServer(blob); // 녹음이 멈추면 서버로 업로드
  //     };

  //     recorder.start();
  //     setIsPlaying(true);
  //     setIsPaused(false);
  //     console.log("녹음 및 재생 시작");
  //   } catch (error) {
  //     console.error("녹음 시작 오류:", error);
  //   }
  // };

  // // 녹음 일시 중지 함수
  // const handlePause = () => {
  //   if (mediaRecorder && mediaRecorder.state === "recording") {
  //     mediaRecorder.pause();
  //     audioRef.current.pause();
  //     setIsPaused(true);
  //     setIsPlaying(false);
  //     console.log("녹음 및 재생 일시 중지");
  //   }
  // };

  // // 녹음 재개 함수
  // const handleResume = () => {
  //   if (mediaRecorder && mediaRecorder.state === "paused") {
  //     mediaRecorder.resume();
  //     audioRef.current.play();
  //     setIsPaused(false);
  //     setIsPlaying(true);
  //     console.log("녹음 및 재생 재개");
  //   }
  // };

  // // 녹음 완전히 멈추는 함수 (업로드는 recorder.onstop에서 처리됨)
  // const handleStop = () => {
  //   if (mediaRecorder && mediaRecorder.state !== "inactive") {
  //     mediaRecorder.stop();
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //     setIsPlaying(false);
  //     setIsPaused(false);
  //     console.log("녹음 중지");
  //     navigate("/feedback"); // 녹음이 중지되면 feedback 페이지로 이동
  //   }
  // };

  // // 서버로 녹음된 파일 전송 함수
  // const uploadToServer = async (blob) => {
  //   const formData = new FormData();
  //   formData.append("audio", blob, "recording.wav"); // 서버에 파일로 전송

  //   try {
  //     const response = await fetch("http://localhost:5000/uploads", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const result = await response.json();
  //     console.log("서버 응답:", result);
  //   } catch (error) {
  //     console.error("서버로 파일 업로드 실패:", error);
  //   }
  // };
// 녹음 관련 끝

// gpt 실시간으로 3초간 녹음 후 음역대 진단
// const recordAudio = async () => {
//   setIsRecording(true);
//   const mediaRecorder = new MediaRecorder(await navigator.mediaDevices.getUserMedia({ audio: true }));
//   const audioChunks = [];

//   mediaRecorder.ondataavailable = event => {
//     audioChunks.push(event.data);
//   };

//   mediaRecorder.start();
//   setTimeout(() => {
//     mediaRecorder.stop();
//   }, 3000);

//   mediaRecorder.onstop = async () => {
//     const audioBlob = new Blob(audioChunks);
//     const formData = new FormData();
//     formData.append("audio", audioBlob);

//     // Python 서버에 음성을 전송하여 주파수 분석
//     const response = await fetch("http://localhost:5000/range_check", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     setUserFrequency(data.frequency);
//     compareFrequencies(data.frequency);
//   };
// };

// const compareFrequencies = (frequency) => {
//   const closestNote = notes.reduce((prev, curr) =>
//     Math.abs(curr.frequency - frequency) < Math.abs(prev.frequency - frequency) ? curr : prev
//   );

//   setNoteMessage(`사용자의 주파수: ${frequency.toFixed(2)} Hz, 가장 가까운 음: ${closestNote.name}`);
// };

// 사용자 주파수를 가져오는 함수
const fetchUserFrequency = async (noteName) => {
  const response = await fetch("http://localhost:5000/range_check");
  const data = await response.json();

  setUserFrequency(data.frequency);
  compareFrequencies(data.frequency, noteName);
};

// 주파수를 비교하는 함수
const compareFrequencies = (userFreq, noteName) => {
  const note = notes.find(note => note.name === noteName);
  if (note) {
    const frequencyDifference = Math.abs(userFreq - note.frequency);
    if (frequencyDifference < 5) {
      setNoteMessage(`현재 건반 음역대는 ${note.info}인데, 현재 사용자의 주파수는 ${userFreq}, 사용자의 주파수는 ${note.info}에 가깝습니다!`);
    } else {
      setNoteMessage(`현재 건반 음역대는 ${note.info}인데, 현재 사용자의 주파수는 ${userFreq}, 사용자의 주파수는 ${note.info}와 거리가 있습니다.`);
    }
  }
};




  return (
    <div className="body">
      <div className="container">
        <h1>음역대 진단 페이지</h1>

        <div className="piano">
          {/* 흰 건반 */}
          {notes
            .filter(note => !note.name.includes("_")) // '_'이 없는 흰 건반 필터링
            .map(note => (
              <div
                key={note.name}
                className={`white-key ${activeNote === note.name ? "key_active" : ""}`}
                onClick={() => playNoteByName(note.name, 1)}
              >
                {/* {note.name} */}
              </div>
            ))}

          {/* 검은 건반 */}
          {notes
            .filter(note => note.name.includes("_")) // '_'이 있는 검은 건반 필터링
            .map(note => (
              <div
                key={note.name}
                className={`black-key key-${note.name}-sharp ${activeNote === note.name ? "key_active" : ""}`}
                onClick={() => playNoteByName(note.name, 1)}
              ></div>
            ))}
        </div>

        <div className="scale_analyze_btn">
          <div className="sa_btn" onClick={decreaseNote}>왼쪽</div>
          <div className="sa_btn" onClick={increaseNote}>오른쪽</div>
        </div>
        
        <div className="scale_analyze_btn">
          <div className="sa_btn" onClick={playNote}>다시 듣기</div>
          <div className="sa_btn">녹음</div>
        </div>
        {/* gpt 실시간으로 3초간 녹음 후 음역대 진단 */}
        <div className="scale_analyze_btn">
          {/* <button onClick={recordAudio}>{isRecording ? "녹음 중..." : "녹음"}</button> */}
        </div>

        <div className="scale_analyze_textarea">
          <textarea readOnly value={noteMessage} />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ScaleAnalyze;
