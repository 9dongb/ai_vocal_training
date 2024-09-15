import Footer from "./common/Footer";
import "./common/root.css";
const MyPage = () => {
  return (
    <div className="body">
      <div className="container">
        마이페이지
        <Footer activeTab="myPage" />
      </div>
    </div>
  );
};

export default MyPage;
