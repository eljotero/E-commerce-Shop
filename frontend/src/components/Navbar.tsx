import { useState } from 'react';
import Cart from './Cart';
import '../css/Navbar.css'

function Navbar() {

    const [isCartVisible, setCartVisible] = useState(false);

    function navigateTo(path: string) { 
        window.location.href = path;
    }

    const handleCartClick = () => {
        setCartVisible(!isCartVisible);
    };

    return (
        <div className='NavbarContainer'>
            <div className='NavbarSectionLeft'>
                <button onClick={() => navigateTo('/shop')}>SHOP</button>
                <button onClick={() => navigateTo('/about')}>ABOUT US</button>
                <button onClick={() => navigateTo('/contact')}>CONTACT</button>
            </div>
            <div onClick={() => navigateTo('/')}className='NavbarSectionCenter'>
                <div className="waviy">
                    <span style={{ '--i': 1 } as React.CSSProperties}>S</span>
                    <span style={{ '--i': 2 } as React.CSSProperties}>W</span>
                    <span style={{ '--i': 3 } as React.CSSProperties}>E</span>
                    <span style={{ '--i': 4 } as React.CSSProperties}>E</span>
                    <span style={{ '--i': 5 } as React.CSSProperties}>T</span>
                    <br />
                    <span style={{ '--i': 6 } as React.CSSProperties}>T</span>
                    <span style={{ '--i': 5 } as React.CSSProperties}>R</span>
                    <span style={{ '--i': 4 } as React.CSSProperties}>E</span>
                    <span style={{ '--i': 3 } as React.CSSProperties}>A</span>
                    <span style={{ '--i': 2 } as React.CSSProperties}>T</span>
                    <span style={{ '--i': 1 } as React.CSSProperties}>S</span>

                </div>
            </div>
            <div className='NavbarSectionRight'>
                <button className='SearchButton'></button>
                <button className='AccountButton'></button>
                <button className='CartButton' onClick={handleCartClick}></button>
                {isCartVisible && <Cart isOpen={isCartVisible} onClose={() => setCartVisible(false)} />}
            </div>
        </div>
    );
}

export default Navbar;