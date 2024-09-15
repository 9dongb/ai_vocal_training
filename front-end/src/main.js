import React, { useState,useEffect } from 'react';
import './main.css';
import './common/root.css';
import Footer from './common/Footer';
import WeeklyRanking from './WeeklyRanking.js'; //주간 랭킹 컴포넌트

// ProgressComparison 컴포넌트 정의
function ProgressComparison({ title, lastWeekValue, latestValue }) {
    return (
        <div className={`progress-comparison ${title.toLowerCase()}`}>
            {/* 7일 전 기록 */}
            <div className='progress-container last-week'>
                <div className='progress-track'>
                    <div className={`progress-last-week ${title.toLowerCase()}`} style={{ width: `${lastWeekValue}%` }}></div>
                </div>
                <span>{lastWeekValue}%</span>
            </div>

            {/* 가운데 항목 이름 */}
            <div className='progress-title'>{title}</div>

            {/* 최신 기록 */}
            <div className='progress-container latest'>
                <div className='progress-track'>
                    <div className={`progress-latest ${title.toLowerCase()}`} style={{ width: `${latestValue}%` }}></div>
                </div>
                <span>{latestValue}%</span>
            </div>
        </div>
    );
}

// Main 컴포넌트 정의
function Main() {
    const [rankingData, setRankingData] = useState([]);

    // Flask 서버로부터 주간 랭킹 데이터를 가져오는 함수
    const fetchWeeklyRanking = async () => {
        try {
            const response = await fetch('http://localhost:5000/weekly_ranking');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRankingData(data.data);
        } catch (error) {
            console.error('Error fetching weekly ranking data:', error);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 주간 랭킹 데이터를 불러옴
    useEffect(() => {
        fetchWeeklyRanking();
    }, []);

    
    
    return (
        <div className='body'>
            <div className='container'>
                <div className='main'>
                    <div className='singing_battle'>
                        <div className='singking_battle_title'>
                            SINGKING 배틀
                        </div>

                        <div className='battle_component'>
                            <div className='battle_text'>
                                <p className='battle_text_1'>배틀 참여하기</p>
                                <p className='battle_text_2'>유저들과 경쟁해보세요</p>
                            </div>
                            <img src='.\img\battle_img.png' className='battle_image' alt='배틀 이미지' />
                        </div>

                        <div className='singking_grow'>         
                            <div className='singking_grow_title'>
                                SINGKING과 함께 성장했어요!
                            </div>
                            <div className='grow_component'>
                                <div className='grow_component_1'>
                                    <img src='.\img\key.png' alt='음정 아이콘'></img><br/>
                                    음정<br/>
                                    <div className='key_score'>71점</div>
                                </div>
                                <div className='grow_component_1'>
                                    <img src='.\img\beat.png' alt='박자 아이콘'></img><br/>
                                    박자<br/>
                                    <div className='beat_score'>83점</div>
                                </div>
                                <div className='grow_component_1'>
                                    <img src='.\img\pronun.png' alt='발음 아이콘'></img><br/>
                                    발음<br/>
                                    <div className='pronun_score'>78점</div>
                                </div>
                            </div>
                        </div>

                        <div className='singking_ability'>
                            <div className='singking_ability_title'>
                                나의 실력은?
                            </div>
                            <div className='ability_component'>
                                <div className='ability_title'>
                                    7일 전 VS 최신 기록
                                </div>

                                <ProgressComparison title="음정" lastWeekValue={62} latestValue={72} />
                                <ProgressComparison title="박자" lastWeekValue={54} latestValue={80} />
                                <ProgressComparison title="발음" lastWeekValue={67} latestValue={99} />
                                <ProgressComparison title="템포" lastWeekValue={72} latestValue={91} />
                                <ProgressComparison title="볼륨" lastWeekValue={25} latestValue={89} />
                            </div>
                        </div>

                        <div className='weekly_ranking'>
                            <div className='weekly_ranking_title'>주간 랭킹</div>
                            <div className='weekly_ranking_component'>
                                <WeeklyRanking rankingData={rankingData}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Main;
