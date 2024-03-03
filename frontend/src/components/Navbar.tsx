import '../css/Navbar.css'

function Navbar() {
    return (
        <div className = 'NavbarContainer'>
            <div className = 'NavbarSectionLeft'>
                <button>SHOP</button>
                <button>ABOUT US</button>
                <button>CONTACT</button>
            </div>
            <div className = 'NavbarSectionCenter'>
                <span>Sweet<br/>Treats</span>
            </div>
            <div className = 'NavbarSectionRight'>
                <button className='SearchButton'></button>
                <button className='AccountButton'></button>
                <button className='CartButton'></button>
            </div>
        </div>
    );
}

export default Navbar;