import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <Link to={"/main"}>
        <div className="home icon_area">
          <img className="icon_img" src="./img/footer_icon/home.png" />
          <p className="icon_name">홈</p>
        </div>
      </Link>
      <span className="icon_line"></span>
      <div className="training icon_area">
        <img className="icon_img" src="./img/footer_icon/training.png" />
        <p className="icon_name">트레이닝</p>
      </div>
      <span className="icon_line"></span>
      <div className="matching icon_area">
        <img className="icon_img" src="./img/footer_icon/matching.png" />
        <p className="icon_name">매칭</p>
      </div>
      <span className="icon_line"></span>
      <div className="mypage icon_area">
        <img className="icon_img" src="./img/footer_icon/mypage.png" />
        <p className="icon_name">마이페이지</p>
      </div>
    </div>
  );
}

export default Footer;
