import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch  } from 'react-redux';
import { setCategories, setMinPrice, setMaxPrice, setMinWeight, setMaxWeight } from '../redux/filter';
import '../css/Sorting.css';

function Sorting() {
  const [categories, getCategories] = useState([
    {
      categoryId: 0,
      categoryName: ''
    }
  ]);
  const [selectedCategories, setSelectedCategories] = useState(new Set<number>());

  useEffect(() => {
    axios.get(`http://localhost:3000/categories`)
      .then(response => {
        getCategories(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function handleCategoryChange(categoryId: number, isChecked: boolean) {
    setSelectedCategories(prev => {
      const newSelected = new Set(prev);
      if (isChecked) {
        newSelected.add(categoryId);
      } else {
        newSelected.delete(categoryId);
      }
      return newSelected;
    });
  }

  const dispatch = useDispatch()

  function setFilters() {
    let minPrice = document.querySelector('.minPrice') as HTMLInputElement;
    let maxPrice = document.querySelector('.maxPrice') as HTMLInputElement;
    let minWeight = document.querySelector('.minWeight') as HTMLInputElement;
    let maxWeight = document.querySelector('.maxWeight') as HTMLInputElement;
    const categoriesToSend = categories.filter(category => selectedCategories.has(category.categoryId));

    dispatch(setCategories(categoriesToSend));
    dispatch(setMinPrice(parseInt(minPrice.value)));
    dispatch(setMaxPrice(parseInt(maxPrice.value)));
    dispatch(setMinWeight(parseInt(minWeight.value)));
    dispatch(setMaxWeight(parseInt(maxWeight.value)));  
  }

  return (
      <div className='categorySortingContainer'>
        <div className='categoriesRollDown'>
        {categories.map((category) => (
          <div className='categoriesList' key={category.categoryId}>
            <ul className='categoriesCheckboxes'>
              <li>
                <input 
                  type='checkbox' 
                  onChange={(e) => handleCategoryChange(category.categoryId, e.target.checked)}/>
                  <label>{category.categoryName}</label>
              </li>
            </ul>
          </div>
          ))}
        </div>
        <div className='priceRollDown'>
          <label>Price:</label>
          <div className='priceInput'>
            <input className='minPrice' type='text' placeholder='Min'></input>
            <input className='maxPrice' type='text' placeholder='Max'></input>
          </div>
        </div>
        <div className='weightRollDown'>
          <label>Weight:</label>
          <div className='weightInput'>
            <input className='minWeight' type='text' placeholder='Min'></input>
            <input className='maxWeight' type='text' placeholder='Max'></input>
          </div>
        </div>

        <button className='searchButton' onClick={() => setFilters()}>Search</button>
      </div>
  );
}

export default Sorting;