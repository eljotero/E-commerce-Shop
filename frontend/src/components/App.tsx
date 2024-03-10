import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import ShopView from './ShopView';
import ProductView from './ProductView';
import AboutUs from './AboutUs';
import Contact from './Contact';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/product/:id" element={<ProductView/>} />
                <Route path="/shop" element={<ShopView/>} />
                <Route path="/about" element={<AboutUs/>} />
                <Route path="/contact" element={<Contact/>} />
            </Routes>
        </Router>
    );
}

export default App;