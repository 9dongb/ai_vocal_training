<<<<<<< HEAD
import Footer from "./common/Footer";
import "./common/root.css";
const Training = () => {
  return (
    <div className="body">
      <div className="container">
        트레이닝
        <Footer activeTab="training" />
      </div>
    </div>
  );
};

export default Training;
=======
import React from 'react';
import Footer from'./common/Footer';
import './training.css';
import './common/root.css';

function Training(){
    return(
        <div className='body'>
            <div className='container'>
                <div className='main'>
                
                </div>
                <Footer />
            </div>

        </div>
        
    );
}
export default Training;
>>>>>>> c8957ca (메인페이지 구현)
