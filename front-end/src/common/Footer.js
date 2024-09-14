import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer">
      <Link to={"/main"}>
        <div className='home'>
          <img className='icon_img' src='./img/footer_icon/home.png'/>
          <p className='icon_name'>홈</p>
        </div>
      </Link>
        <hr/>
      <Link to={"/training"}>
        <div className='training'>
          <img className='icon_img' src='.\img\footer_icon/training.png'/>
          <p className='icon_name'>트레이닝</p>
        </div>
      </Link>
        <hr/>
        <div className='feedback'>
          <img className='icon_img' src='./img/footer_icon/matching.png'/>
          <p className='icon_name'>매칭</p>
        </div>
        <hr/>
        <div className='mypage'>
          <img className='icon_img' src='./img/footer_icon/mypage.png'/>
          <p className='icon_name'>마이 페이지</p>
        </div>
    </div>
  ); 
}

export default Footer;