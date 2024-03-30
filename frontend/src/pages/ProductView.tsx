import Promocode from "../components/Promocode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Product.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";;
import axios from "axios";

function ProductView() {

  const [product, setProducts] = useState({
    productId: 0,
    productName: "",
    productDescription: "",
    productPrice: 0,
    productWeight: 0,
    category: {
      categoryName: ""
    }
  });

  const [similarProducts, setSimilarProducts] = useState<similarProductsInterface[]>([]);

  interface similarProductsInterface {
    productId: number;
    productName: string;
    productDescription: string;
    productPrice: number;
    productWeight: number;
    category: {
      categoryName: string;
    }
  }

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

  function goToShop() {
    window.location.href = `/shop`;
  }


  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(response => {
        setProducts({
          ...response.data,
          categoryName: response.data.category.categoryName
        });
      })
      .catch(error => {
        console.log(error);
      });
    axios.get(`http://localhost:3000/products/category/${product.category.categoryName}`, {
      params: {
        category: product.category.categoryName
      }
    })
      .then(response => {
        setSimilarProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


  return (
    <>
      <Promocode />
      <Navbar />
      <ul className="breadcrumb">
        <li><a href="#" onClick={goToShop}>Shop</a></li>
        <li><a href="#">{product.category.categoryName}</a></li>
        <li>{product.productName}</li>
      </ul>
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
      <div className="similarProductsContainer">
        <span className="similarProductsHeader">Similar products:</span>
          <div className="similarProducts">
            {similarProducts.map((similarProduct: similarProductsInterface) => {
              return (
                <div key={similarProduct.productId} className="similarProductCard">
                  <img alt="Picture" src={`https://picsum.photos/200/150`} />
                  <span>{similarProduct.productName}</span>
                  <span>{similarProduct.productPrice} PLN</span>
                  <button className="addToCartButton">Add to cart</button>
                </div>
              );
            })}
        </div>
      </div>  
      <Footer />
    </>
  );
}

export default ProductView;
