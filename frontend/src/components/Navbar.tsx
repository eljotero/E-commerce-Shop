import '../css/Navbar.css'

function Navbar() {
    return (
        <div className = 'NavbarContainer'>
            <div className = 'NavbarSectionLeft'>
                <button>SHOP</button>
                <button>ABOUT US</button>
                <button>CONTACT</button>
            </div>
            <div className='NavbarSectionCenter'>
                <div className="waviy">
                    <span style={{ '--i': 1 } as React.CSSProperties}>S</span>
                    <span style={{ '--i': 2 } as React.CSSProperties}>W</span>
                    <span style={{ '--i': 3 } as React.CSSProperties}>E</span>
                    <span style={{ '--i': 4 } as React.CSSProperties}>E</span>
                    <span style={{ '--i': 5 } as React.CSSProperties}>T</span>
                    <br/>
                    <span style={{ '--i': 6 } as React.CSSProperties}>T</span>
                    <span style={{ '--i': 7 } as React.CSSProperties}>R</span>
                    <span style={{ '--i': 8 } as React.CSSProperties}>E</span>
                    <span style={{ '--i': 9} as React.CSSProperties}>A</span>
                    <span style={{ '--i': 10 } as React.CSSProperties}>T</span>
                    <span style={{ '--i': 11 } as React.CSSProperties}>S</span>

                </div>
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