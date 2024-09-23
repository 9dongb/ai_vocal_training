import React from "react";
import "./feedback.css";
import Footer from "./common/Footer";

function Feedback(){
    return(
        <div className="body">
            <div className="container">
                <div className="feedback">

                    <div className="header_title">평가노래</div>
                    <div className="feedback_song_info">
                        <div className="feedback_song_info_songname">안아줘</div>
                        <div className="feedback_song_info_singer">정준일</div>
                        <div className="feedback_song_info_container">
                        <img className="feedback_song_info_img" src=".\img\songs\cover_hug.png" alt="안아줘" />
                        </div>
                    </div>

                    <div className="header_title">틀린구간</div>
                    <div className="wrong_part">

                    </div>

                    <div className="header_title">종합 점수</div>
                    <div className="feedback_final_score">

                    </div>

                    <div className="header_title">종합 점수</div>
                    <div className="grow_component">
                        <div className="grow_component_1">
                            <img src=".\img\key.png" alt="음정 아이콘"></img>
                            <br />
                            음정
                            <br />
                            <div className="key_score">71점</div>
                        </div>
                        <div className="grow_component_1">
                            <img src=".\img\beat.png" alt="박자 아이콘"></img>
                            <br />
                            박자
                            <br />
                            <div className="beat_score">83점</div>
                        </div>
                        <div className="grow_component_1">
                            <img src=".\img\pronun.png" alt="발음 아이콘"></img>
                            <br />
                            발음
                            <br />
                            <div className="pronun_score">78점</div>
                        </div>
                    </div>

                    


                </div>
                <Footer activeTab="training" />
            </div>
        </div>
    );
}
export default Feedback;
