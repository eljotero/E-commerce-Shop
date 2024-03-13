import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface FiltersState {
    categories: Array<{categoryId: number, categoryName: string}>,
    minPrice: number,
    maxPrice: number,
    minWeight: number,
    maxWeight: number,
  }
  
  const initialState: FiltersState = {
    categories: [],
    minPrice: 0,
    maxPrice: 0,
    minWeight: 0,
    maxWeight: 0,
  }

export const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
      setCategories: (state, action: PayloadAction<Array<{categoryId: number, categoryName: string}>>) => {
        state.categories = action.payload;
      },
      setMinPrice: (state, action: PayloadAction<number>) => {
        state.minPrice = action.payload;
      },
      setMaxPrice: (state, action: PayloadAction<number>) => {
        state.maxPrice = action.payload;
      },
      setMinWeight: (state, action: PayloadAction<number>) => {
        state.minWeight = action.payload;
      },
      setMaxWeight: (state, action: PayloadAction<number>) => {
        state.maxWeight = action.payload;
      },
    },
  })

  export const { setCategories, setMinPrice, setMaxPrice, setMinWeight, setMaxWeight } = filterSlice.actions
  export default filterSlice.reducer