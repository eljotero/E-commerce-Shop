import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/Sorting.css';

function Sorting() {
  const [categories, setSort] = useState([
    {
      categoryId: 0,
      categoryName: ''
    }
  ]);

  useEffect(() => {
    axios.get(`http://localhost:3000/categories`)
      .then(response => {
        setSort(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


  return (
      <div className='categorySortingContainer'>
        <div className='categoriesRollDown'>
          {categories.map((category) => {
            return <div className = 'categoriesCheckboxes'>
              <label>{category.categoryName}</label>
              <input type='checkbox' key={category.categoryId}></input>
            </div>
          })}
        </div>
        <div className='priceRollDown'>
          <div className='priceInput'>
            <label>Sort by price:</label>
            <button>Price</button>
          </div>
        </div>
      </div>
  );
}

export default Sorting;