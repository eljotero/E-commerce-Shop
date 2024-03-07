import '../css/Footer.css';


function Footer() {

    return (
        <footer className="FooterContainer">
            <div className="FooterSectionTitle">
                <span>Sweet<br />Treats</span>
            </div>
            <div className="FooterSectionLeft">
                <button>Instagram</button>
                <button>Facebook</button>
                <button>TikTok</button>
            </div>
            <div className="FooterSectionCenter">
                <button>Contact us</button>
                <button>About us</button>
                <button>Careers</button>
            </div>
            <div className="FooterSectionRight">
                <button>Terms & Conditions</button>
                <button>Privacy Policy</button>
                <button>FAQs</button>
            </div>
        </footer>
    );
}

export default Footer;