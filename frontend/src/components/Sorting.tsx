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
          <label>Price:</label>
          <div className='priceInput'>
            <input type='text' placeholder='Min'></input>
            <input type='text' placeholder='Max'></input>
          </div>
        </div>
        <div className='weightRollDown'>
          <label>Weight:</label>
          <div className='weightInput'>
            <input className='minPrice' type='text' placeholder='Min'></input>
            <input className='maxPrice' type='text' placeholder='Max'></input>
          </div>
        </div>

        <button className='searchButton'>Search</button>
      </div>
  );
}

export default Sorting;