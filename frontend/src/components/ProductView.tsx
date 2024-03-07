import Promocode from "./Promocode";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/Product.css";
import { useEffect, useState } from "react";

function ProductView() {
  const [product, setProducts] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productWeight: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/products/${1}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      });
  }, []);

  return (
    <>
      <Promocode />
      <Navbar />
      {/* TODO: Category navigation for product */}
      <div className="productContainer">
        <div className="productLeftSection">
          <img alt="Picture" src="https://picsum.photos/200/150" />
          <img alt="Picture" src="https://picsum.photos/200/150" />
          <img alt="Picture" src="https://picsum.photos/200/150" />
        </div>
        <div className="productCenterSection">
          <img alt="Picture" src="https://picsum.photos/400/470" />
        </div>
        <div className="producRightSection">
          <span className="productNameSpan">{product.productName}</span>
          <span className="productPriceSpan">{product.productPrice} PLN</span>
          <div className="productQuantityContainer">
            <label htmlFor="productQuantity" className="productQuantityLabel">
              Quantity: 
            </label>
            <input type="number" className="productQuantityInput" min='1'/>
          </div>
          <button className="addToCartButton">Add to cart</button>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <Footer />
    </>
  );
}

export default ProductView;
