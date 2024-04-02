import Promocode from "../components/Promocode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/LandingPage.css";

function LandingPage() {

  function navigateTo(path: string) { 
    window.location.href = path;
  }

  const [products, setProducts] = useState<productInterface[]>([]);

  interface productInterface {
    productId: number;
    productName: string;
    productDescription: string;
    productPrice: number;
    category: {
      categoryId: number;
      categoryName: string;
    }
  }

  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(response => {
        setProducts(response.data.sort(() => Math.random() - 0.5));
      });
  }, []);

  return (
    <>
      <Promocode />
      <Navbar />
      <div className="HeroSectionContainer">
        <h1>Explore a world of sweet delights</h1>
        <button className="custom-btn btn-7" onClick={() => navigateTo("/shop")}>
          <span>SHOP <br/> NOW</span>
        </button>
        <div className="newProductsContainer">
          {products.map((product, index) => {
            return (
              <>
                <div key={index} className={`newProductCard ${index % 2 === 0 ? 'right' : 'left'}`}>
                  <img alt="Picture" src="https://picsum.photos/200/150" />
                  <h3 onClick={() => navigateTo(`/product/${product.productId}`)}>{product.productName}
                  </h3>
                  <h4>${product.productPrice}</h4>
                </div>
                <div className={`newProductDescription ${index % 2 === 0 ? 'right' : 'left'}` }>
                  <p>{product.productDescription}</p>
                </div>
              </>
            );
          })}
          </div>
      </div>

      <Footer />
    </>
  );
}

export default LandingPage;
