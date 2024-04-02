import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/slicers/cartSlicer';
import type { RootState } from '../redux/store';
import Modal from 'react-modal';
import React from 'react';
import '../css/Cart.css';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

function Cart({ isOpen, onClose }: CartProps) {
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.root);

    function goToChekout() {
        window.location.href = '/checkout';
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Cart Modal"
            className="modal"
        >
            <button className='closeButton' onClick={onClose}>Close</button>
            <ul>
                {cart.map((product) => (
                    <li className="cart-item" key={product.productId}>
                        <img alt="Picture" src={`https://picsum.photos/125/75`} />
                        <span className='span-1'> {product.productName} </span>
                        <span className='span-2'> {product.productPrice} PLN</span>
                        <span className='span-3'> {product.quantity} </span>
                        <button onClick={() => dispatch(removeFromCart(product.productId))}>Remove</button>
                    </li>
                ))}
            </ul>

            {cart.length === 0 &&
                <div>
                    <h3 className='emptyCartNoti'>Your cart is empty</h3>
                </div>
            }
            
            {cart.length > 0 && 
                <div>
                    <h3>Total: {cart.reduce((acc, product) => acc + product.productPrice * product.quantity, 0)} PLN</h3>
                </div>
            }
            {cart.length > 0 &&

                <div className='checkoutButtonContainer'>
                    <button className='checkoutButton' onClick={goToChekout}>Checkout</button>
                </div>
            }
        </Modal>
    );
}

export default Cart;