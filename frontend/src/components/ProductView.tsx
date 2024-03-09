import Promocode from "./Promocode";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/Product.css";
import { useEffect, useState } from "react";

function ProductView() {
  const [product, setProducts] = useState({
    productName: "",
    productDescription: "",
    productPrice: 0,
    productWeight: 0,
  });

  const [quantity, setQuantity] = useState(1);
  let pricePerKg = ((product.productPrice / (product.productWeight * 100)) * 100).toFixed(2);
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

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
      {/* Może jednak nie wymaga zmiany response, zobaczymy jak z czasem*/}
      <div className="productContainer">
        <div className="productLeftSection">
          <img alt="Picture" src="https://picsum.photos/200/150" />
          <img alt="Picture" src="https://picsum.photos/200/150" />
          <img alt="Picture" src="https://picsum.photos/200/150" />
        </div>
        <div className="productCenterSection">
          <img className='mainPicture' alt="Picture" src="https://picsum.photos/200/480" />
        </div>
        <div className="producRightSection">
          <span className="productNameSpan">{product.productName}</span>
          <div className="productPriceContainer">
            <span className="productPriceSpan">{product.productPrice} PLN</span>
            <span className="productPricePerKgSpan">({pricePerKg} PLN/kg)</span>
          </div>

          <span>Quantity:</span>
            <div className="productQuantityContainer">
              <button className="minus" onClick={decreaseQuantity}>-</button>
              <input type="number" step="0" min="1" name="quantity" value={quantity} className="qualityInput" />
              <button className="plus" onClick={increaseQuantity}>+</button>
            </div>

          <button className="addToCartButton">Add to cart</button>
        </div>
      </div>
      <hr className="roundedDivider"/>
      <div className="descriptionContainer">
        <span className="descriptionHeader">Description:</span>
        <span className="descriptionText">{product.productDescription}</span>
      </div> 
      {/* TODO: Other recommended products */}
      {/* To podobnie nie do zrobienia bez zmiany response'a */}

      <Footer />
    </>
  );
}

export default ProductView;
