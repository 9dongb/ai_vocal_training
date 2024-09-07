import React, { useEffect, useState } from 'react';
import './immediate_feedback_analyze.css';
import "./common/root.css";
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom';
import Header2 from './common/Header2.js';

function Immediate_feedback_analyze() {
  const videoId = "nENMWU6BtAo"; // 유튜브 동영상 ID

  const [message, setMessage] = useState("분석중입니다."); // 초기 메시지 상태
  const [score, setScore] = useState(0); // 초기 점수 상태
  const [tuneValue, setTuneValue] = useState(0); // 음정 초기 값
  const [beatValue, setBeatValue] = useState(0); // 박자 초기 값

  const opts = {
    height: '350',
    width: '550',
    playerVars: {
      autoplay: 1,
    },
  };

  const onReady = (event) => {
    // 동영상이 준비되었을 때의 처리
    event.target.pauseVideo(); // 자동 재생 후 일시 정지
  };

  useEffect(() => {
    // 10초 후 그래프 애니메이션 시작
    const timer1 = setTimeout(() => {
      setTuneValue(85); // 목표 값 설정
      setBeatValue(90); // 목표 값 설정

      // 점수 애니메이션 시작
      let startScore = 0;
      const endScore = 88;
      const scoreDuration = 25000; // 25초 동안 증가
      const scoreIncrement = endScore / (scoreDuration / 100);
      const animateScore = () => {
        startScore += scoreIncrement;
        if (startScore <= endScore) {
          setScore(Math.round(startScore));
          setTimeout(animateScore, 100); // 100ms 간격으로 증가
        }
      };
      animateScore();
    }, 18000);

    // 15초 후 메시지 변경
    const timer2 = setTimeout(() => {
      setMessage("음정이 낮습니다. 한 키 올려주세요!");
    }, 15000);

    // 25초 후 메시지 변경
    const timer3 = setTimeout(() => {
      setMessage("음정이 좋아졌습니다!");
    }, 35000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="body">
      <div className='container'>
      <Header2/>
      <div className='immediate_feedback_analyze'>
        <div className='song_container'>
          <div className='song_info_container'>
            <div className='song_img'>
              <img src='./img/songs/supernova.png' alt="Supernova" />
            </div>
              <div className='song_name'>Supernova</div>
              <div className='song_artist'>aespa</div>
          </div>

          <div className='song_lyrics_container'>
            <YouTube videoId={videoId} opts={opts} onReady={onReady} /> {/* 유튜브 동영상 컴포넌트 */}
          </div>
        
          <div className='btn_container'>
            <div className = 'playbtn_container'>
              <img src = '/img/playbtn.png'  />
            </div>
            <div className = 'stopbtn_container'>
              <img src = '/img/stopbtn.png' />
            </div>
            <div className = 'pausetn_container'>
              <img src = '/img/pausebtn.png'  />
            </div>
          </div>

          <div className='feedback_container'>

            <div className='feedback_title'>실시간 피드백</div>
            <div className='feedback_inner'>
              <div className='feedback_message'>
                {message}
              </div>
            </div>

            <div className='feedback_analyze_score'>
              <div className='feedback_score_title'>
                <div className='feedback_score'>SCORE</div>
                <div className='feedback_score_number'>{score}</div>
              </div>

              <div className='feedback_bar_container'>
                <div className='feedback_label'>음정</div>
                <div className='feedback_tune_bar' style={{ '--value': tuneValue }}></div>
              </div>

              <div className='feedback_bar_container'>
                <div className='feedback_label'>박자</div>
                <div className='feedback_beat_bar' style={{ '--value': beatValue }}></div>
              </div>

              <div className='feedback_button'>
                <div className='feedback_restartBtn'>재시작</div>
                <Link to={"/immediate_feedback_final"}>
                  <div className='feedback_endBtn'>종료</div>
                </Link>
              </div>
            </div>

            
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Immediate_feedback_analyze;
