import Promocode from "./Promocode";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/LandingPage.css";

function LandingPage() {
  return (
    <>
      <Promocode />
      <Navbar />
      <div className="HeroSectionContainer">
        <span>Explore a world of sweet delights</span>
      </div>
      <div></div>
      <Footer />
    </>
  );
}

export default LandingPage;
