import React, { useState, useEffect } from "react";
import axios from "axios";
import Promocode from "./Promocode";
import Navbar from "./Navbar";
import Sorting from "./Sorting";
import Footer from "./Footer";
import "../css/Shop.css";

function ShopView() {

  const [products, setProducts] = useState([
    {
    productName: "",
    productDescription: "",
    productPrice: 0,
    productWeight: 0,
    category: {
        categoryName: ""
      }
    }
  ]);

  useEffect(() => {
    axios.get(`http://localhost:3000/products`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const [visibleProducts, setVisibleProducts] = useState(products);

  useEffect(() => {
    setVisibleProducts(products);
  }, [products]);

  function goToProductPage(id: number) {
    window.location.href = `/product/${id}`;
  }

  function sortProductsByCategory(category: string) {
      console.log(category);
      console.log(products);
      const filteredProducts = products.filter((product: any) => product.category.categoryName === category);
      setVisibleProducts(filteredProducts);
  }

  function sortProductsByPrice() {
      const sortedProducts = products.sort((a: any, b: any) => a.productPrice - b.productPrice);
      setVisibleProducts(sortedProducts);
  }

  function sortProductsByWeight() {
      const sortedProducts = products.sort((a: any, b: any) => a.productWeight - b.productWeight);
      setVisibleProducts(sortedProducts);
  }

  return (
    <>
        <Promocode />
        <Navbar />
        <div className="shopContainer">
          <Sorting/>
          <div className="productsContainer">
              {visibleProducts.map((product: any) => {
                  return (
                      <div key={product.productId} className="productCard" onClick={() => goToProductPage(product.productId)}>
                          <img alt="Picture" src="https://picsum.photos/200/150" />
                          <h3>{product.productName}</h3>
                          <p>{product.productPrice} PLN</p>
                      </div>
                  );
              })}
          </div>
        </div>
        <Footer />
    </>
  );
}

export default ShopView;

