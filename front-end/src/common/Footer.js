import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer">
      <Link to={"/main"}>
        <div className='home'>
          <img className='icon_img' src='./img/footer_icon/home.png'/>
          <p className='icon_name'>HOME</p>
        </div>
      </Link>
        <hr/>
        <div className='feedback'>
          <img className='icon_img' src='./img/footer_icon/feedback.png'/>
          <p className='icon_name'>FEEDBACK</p>
        </div>
        <hr/>
        <div className='mypage'>
          <img className='icon_img' src='./img/footer_icon/mypage.png'/>
          <p className='icon_name'>MYPAGE</p>
        </div>
    </div>
  );
}

export default Footer;