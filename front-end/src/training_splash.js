import React, { useState, useEffect } from "react";
import "./common/root.css";
import "./training_splash.css";
import Footer from "./common/Footer";

function Training_Splash({ onFinish }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 1) {
          return prevCount - 1;
        } else {
          clearInterval(timer);
          onFinish(); // 즉시 onFinish 호출
          return 0; // 카운트를 0으로 설정
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="splash_div">
      <div className="countdown">{count === 0 ? "시작!" : count}</div>
      <div className="splash_Footer">
        <Footer activeTab="training"/>
      </div>
    </div>
  );
}

export default Training_Splash;