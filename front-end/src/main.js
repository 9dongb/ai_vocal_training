import Header from './common/Header';
import Footer from './common/Footer';
import './common/root.css';
import './main.css';
import SongList from './components/Top100SongList';
import Top100SongList from './components/Top100SongList';
import RecommendSongList from './components/RecommendSongList';
import initialSongs from './data/songs';
import PopularSongList from './components/PopularSongList';
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

function Main() {
    const [songs, setSongs] = useState(initialSongs);

    const handleSongClick = (id) => {
      const newSongs = [...songs];
      const index = newSongs.findIndex(song => song.id === id);
      if (index !== -1) {
        const [movedSong] = newSongs.splice(index, 1);
        newSongs.unshift(movedSong);
        setSongs(newSongs);
      }
    };
  
  return (
    <div className="body">
        <div className='container'>
            <Header />
            <div className='main'>
                <div id='audition'>
                    <div className='best_singer_apply'>
                        <img src='./img/best_singer_audition.png'/>
                        <span>지원하기</span>
                    </div>
                </div>
                <div id='top100_list'>
                    <div className='title'>
                        <Link to={"/record"}>
                            <div className='title_main'>
                                TOP 100
                            </div>
                        </Link>    
                    </div>
                    <div id='top100'>
                        <Link to={"/immediate_feedback_analyze"}>
                            <div className='top100_more_btn'>더보기&gt;</div>
                            <Top100SongList />
                        </Link>
                    </div>
                </div>
                <div id='popular_song_list'>
                    <div className='title'>
                        <div className='title_main'>
                            현재 누적 인기곡
                        </div>
                        <div className='title_sub'>
                            (15:00 기준)
                        </div>
                    </div>
                    <div className='popular_song'>
                        <PopularSongList songs={songs} onSongClick={handleSongClick} />
                    </div>
                </div>
                <div id='recommend_song_list'>
                    <div className='title'>
                        <div className='title_main'>
                            추천곡
                        </div>
                    </div>
                    <div id='recommend_song'>
                        <RecommendSongList />
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    </div>
  );
}

export default Main;