import { useSelector, useDispatch } from 'react-redux';
import {removeFromCart} from '../redux/slicers/cartSlicer';
import type { RootState } from '../redux/store';

function Cart () {

    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.root);

    return (
        <div>
            <ul>
                {cart.map((product) => (
                    <li key={product.productId}>
                        <span> {product.productName} </span>
                        <span> {product.productPrice} </span>
                        <span> {product.quantity} </span>
                        <button onClick={() => dispatch(removeFromCart(product.productId))}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default Cart;
