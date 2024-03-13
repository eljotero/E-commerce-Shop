import React, { useState, useEffect } from "react";
import axios from "axios";
import Promocode from "./Promocode";
import Navbar from "./Navbar";
import Sorting from "./Sorting";
import Footer from "./Footer";
import "../css/Shop.css";

function ShopView() {

  interface Category {
    categoryId: number;
    categoryName: string;
  }
  
  interface Product {
    category: Category;
    productPrice: number;
    productWeight: number;
    productId: string;
    productName: string;
  }

  const [products, setProducts] = useState<Product[]>([]);

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

  function filterProductsByCategory(category: string) {
    const filteredProducts = products.filter((product: Product) => product.category.categoryName === category);
    setVisibleProducts(filteredProducts);
  }
  
  function filterProductsByPrice() {
    const sortedProducts = [...products].sort((a: Product, b: Product) => a.productPrice - b.productPrice);
    setVisibleProducts(sortedProducts);
  }
  
  function filterProductsByWeight() {
    const sortedProducts = [...products].sort((a: Product, b: Product) => a.productWeight - b.productWeight);
    setVisibleProducts(sortedProducts);
  }

  return (
    <>
      <Promocode />
      <Navbar />
      <div className="shopContainer">
        <Sorting/>
        <div className="productsContainer">
          {visibleProducts.map((product: any) => (
            <div key={product.productId} className="productCard" onClick={() => goToProductPage(product.productId)}>
              <img alt="Picture" src="https://picsum.photos/200/150" />
              <h3>{product.productName}</h3>
              <p>{product.productPrice} PLN</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ShopView;

