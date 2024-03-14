import Promocode from "../components/Promocode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/LandingPage.css";

function LandingPage() {

  function navigateTo(path: string) { 
    window.location.href = path;
  }


  return (
    <>
      <Promocode />
      <Navbar />
      <div className="HeroSectionContainer">
        <span>Explore a world of sweet delights</span>
      </div>
      <div>
        <button className="ShopNowButton" onClick={() =>navigateTo('/shop')}>Shop Now</button>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
