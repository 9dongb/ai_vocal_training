import React, { useState } from "react";
import "./scale_analyze.css";
import "./common/root.css";
import Footer from "./common/Footer";

function ScaleAnalyze() {
  const notes = {
    C4: 261.63,
    "C#4": 277.18,
    D4: 293.66,
    "D#4": 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    G4: 392.0,
    "G#4": 415.3,
    A4: 440.0,
    "A#4": 466.16,
    B4: 493.88,
  };

  const [activeNote, setActiveNote] = useState(null); // 현재 활성화된 노트

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
    const frequency = notes[noteName];
    if (frequency) {
      setActiveNote(noteName); // 눌린 음 시각화
      playTone(frequency, duration); // 주어진 음계의 주파수를 사용해 재생

      setTimeout(() => setActiveNote(null), duration * 1000); // 음이 끝나면 시각화 해제
    } else {
      console.log("해당 음을 찾을 수 없습니다.");
    }
  }

  return (
    <div className="body">
      <div className="container">
        <h1>음역대 진단 페이지</h1>

        <div className="piano">
          {/* 흰 건반 */}
          <div className={`white-key ${activeNote === "C4" ? "key_active" : ""}`} onClick={() => playNoteByName("C4", 1)}>
            C4
          </div>
          <div className={`white-key ${activeNote === "D4" ? "key_active" : ""}`} onClick={() => playNoteByName("D4", 1)}>
            D4
          </div>
          <div className={`white-key ${activeNote === "E4" ? "key_active" : ""}`} onClick={() => playNoteByName("E4", 1)}>
            E4
          </div>
          <div className={`white-key ${activeNote === "F4" ? "key_active" : ""}`} onClick={() => playNoteByName("F4", 1)}>
            F4
          </div>
          <div className={`white-key ${activeNote === "G4" ? "key_active" : ""}`} onClick={() => playNoteByName("G4", 1)}>
            G4
          </div>
          <div className={`white-key ${activeNote === "A4" ? "key_active" : ""}`} onClick={() => playNoteByName("A4", 1)}>
            A4
          </div>
          <div className={`white-key ${activeNote === "B4" ? "key_active" : ""}`} onClick={() => playNoteByName("B4", 1)}>
            B4
          </div>

          {/* 검은 건반 */}
          <div className={`black-key key-C-sharp ${activeNote === "C#4" ? "key_active" : ""}`} onClick={() => playNoteByName("C#4", 1)}></div>
          <div className={`black-key key-D-sharp ${activeNote === "D#4" ? "key_active" : ""}`} onClick={() => playNoteByName("D#4", 1)}></div>
          <div className={`black-key key-F-sharp ${activeNote === "F#4" ? "key_active" : ""}`} onClick={() => playNoteByName("F#4", 1)}></div>
          <div className={`black-key key-G-sharp ${activeNote === "G#4" ? "key_active" : ""}`} onClick={() => playNoteByName("G#4", 1)}></div>
          <div className={`black-key key-A-sharp ${activeNote === "A#4" ? "key_active" : ""}`} onClick={() => playNoteByName("A#4", 1)}></div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ScaleAnalyze;
