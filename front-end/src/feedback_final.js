import { Link } from 'react-router-dom';
import Header2 from './common/Header2';
import './common/root.css';
import './feedback_final.css';

function Feedback_final(){
    return(
        <div className='body'>
        <div className='container'>
            <Header2/>
            <div className='feedback_final'>
                <div id='feedback_final_score'>
                    <div className='score_title'>
                        SCORE
                    </div>
                    <div className='score'>
                        <div className='score_num'>
                            88
                        </div>
                        <div className='score_txt'>
                            점
                        </div>
                    </div>
                    <div className='score_rank'>
                        <img src='./img/bookmark.png'/>
                        <div className='rank_num'>
                            <div className='r_main'>TOP</div>
                            <div className='r_sub'>2</div>
                        </div>
                    </div>
                </div>
                
                <div className='feedback_final_rank'>
                    <div className='rank_title'>
                        RANK
                    </div>
                    <div className='rank_first'>

                        <div className='rank_first_num'>
                            <img src='./img/bookmark.png'/>
                            <div className='text_overlay'>
                                <div className='r_f_main'>TOP</div>
                                <div className='r_f_sub'>1</div>
                            </div>
                        </div>

                        <div className='rank_name'>민지원</div>
                        <div className='rank_score'>90.98</div>
                    </div> 

                    <div className='rank_other'>
                        <div className='rank_other_list'>
                            <div className='rank_other_num'>2</div>
                            <div className='other_rank_name'>오소정</div>
                            <div className='other_rank_score'>88</div>
                        </div>

                        <div className='rank_other_list'>
                            <div className='rank_other_num'>3</div>
                            <div className='other_rank_name'>조호연</div>
                            <div className='other_rank_score'>81.98</div>
                        </div>

                        <div className='rank_other_list'>
                            <div className='rank_other_num'>4</div>
                            <div className='other_rank_name'>김동윤</div>
                            <div className='other_rank_score'>80.98</div>
                        </div>

                        <div className='rank_other_list'>
                            <div className='rank_other_num'>5</div>
                            <div className='other_rank_name'>양희님</div>
                            <div className='other_rank_score'>79.98</div>
                        </div>

                        <div className='rank_other_list'>
                            <div className='rank_other_num'>6</div>
                            <div className='other_rank_name'>윤혜빈</div>
                            <div className='other_rank_score'>78.98</div>
                        </div>

                        <div className='rank_other_list'>
                            <div className='rank_other_num'>7</div>
                            <div className='other_rank_name'>김윤진</div>
                            <div className='other_rank_score'>39.98</div>
                        </div>
                    </div>

                    <div className='feedback_final_btn'>
                        <Link to={'/immediate_feedback_analyze'}>
                        <div className='retry'>
                        다시 도전하기
                        </div>
                        </Link>
                        <Link to={'/main'}>
                         <div className='gohome'>
                        홈으로
                         </div>
                         </Link>
                    </div>

                </div>

                
                
             </div>
        </div>

       

        </div>

      
    );
}export default Feedback_final;