import { useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {removeFromCart, getAllProducts} from '../redux/cart';
import type { RootState } from '../redux/store';

function Cart () {

    interface Product { 
        productId: number;
        productName: string;
        productPrice: number;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProducts());
        
    }, []);

    return (
        <div>
            <h1>Cart</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: Product) => {
                            return (
                                <tr key={product.productId}>
                                    <td>{product.productName}</td>
                                    <td>{product.productPrice}</td>
                                    <td><button onClick={() => dispatch(removeFromCart(product.productId))}>Remove</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default Cart;
