import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CartState {
    productId: number,
    productName: string,
    productPrice: number,
    quantity: number
}

const initialState: CartState[] = []

export const cartSlice =  createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartState>) => {
            const product = action.payload;
            if (!Array.isArray(state)) {
                console.error('State is not an array', state);
                return;
            }
            const existingProduct = state.find((item) => item.productId === product.productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.push(product);
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            return state.filter((product) => product.productId !== action.payload);
        },
    },
})

export const { addToCart, removeFromCart } = cartSlice.actions
export default cartSlice.reducer