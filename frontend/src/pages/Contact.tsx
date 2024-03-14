import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Contact() {
  return (
    <>
        <Navbar/>
        <div>
        <h1>Contact</h1>
        <p>
            You can contact us at: 
            <br/>
            Email: email@email.com
            <br/>
            Phone: 123456789
            <br/>
            Address: Somewhere OverThere ST. 1337, 12-345 Somewhere
        </p>
        </div>
        <Footer />
    </>
  );
}

export default Contact;