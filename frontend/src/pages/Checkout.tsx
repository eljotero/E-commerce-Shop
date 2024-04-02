import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import Navbar from '../components/Navbar';
import Promocode from '../components/Promocode';
import '../css/Checkout.css';
import { removeFromCart } from '../redux/slicers/cartSlicer';

function Checkout() {

  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.root);

  return (
    <>
      <Promocode />
      <Navbar />
      <div className="checkoutContainer">
        <h1 className="checkoutTitle">Checkout</h1>

        <div className="checkoutItems">
          <h2>Items</h2>
          {cart.map((product) => (
            <div className="checkoutItem" key={product.productId}>
              <img alt="Picture" src={`https://picsum.photos/150/100`} />
              <span className='span-1'> {product.productName} </span>
              <span className='span-2'> {product.productPrice} PLN</span>
              <span className='span-3'> {product.quantity} </span>
              <button onClick={() =>dispatch(removeFromCart(product.productId))}>Remove</button>
            </div>
          ))}
        </div>

        <div className='checkoutInfoForm'>
          <h2>Shipping Information</h2>
          <form>
            <div>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="surname">Surname:</label>
              <input type="text" id="surname" name="surname" required />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" name="address" required />
            </div>
            <div>
              <label htmlFor="city">City:</label>
              <input type="text" id="city" name="city" required />
            </div>
            <div>
              <label htmlFor="zip">Zip code:</label>
              <input type="text" id="zip" name="zip" required />
            </div>
            <div>
              <label htmlFor="phone">Phone:</label>
              <input type="text" id="phone" name="phone" required />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
          </form>
        </div>

      </div>
    </>
  );
}

export default Checkout;