import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore} from 'redux-persist';
import { combineReducers } from 'redux';
import filterReducer from './slicers/filterSlicer'
import cartReducer from './slicers/cartSlicer'

const persistConfig = {
  key: 'root',
  storage: storage,
}

const reducers = combineReducers({ root: cartReducer });

const cartPersistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    cart: cartPersistedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);