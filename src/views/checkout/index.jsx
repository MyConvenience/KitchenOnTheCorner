import { ArrowRightOutlined, ShopOutlined } from '@ant-design/icons';
import { BasketItem } from '@/components/basket';
import { displayMoney } from '@/helpers/utils';
import { useDocumentTitle, useScrollTop, useStripe } from '@/hooks';
import PropType from 'prop-types';
import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StepTracker } from './components';
// import withCheckout from '../hoc/withCheckout';
import firebase from '@/services/firebase';

// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';


const OrderSummary = () => {
  const state = useSelector((store) => ({
    basket: store.basket,
    profile: store.profile
  }));

  useDocumentTitle('Checkout | KOTC');
  useScrollTop();
  const [emailAddress, setEmailAddress] = useState(state?.profile?.email)
  const dispatch = useDispatch();
  const history = useHistory();
  const {stripe, createCheckout } = useStripe();
  
  //const stripe = useStripe();
  //const elements = useElements();
  const subtotal = 9;

  const onPayLater = async (event) => {
    event.preventDefault();
    const order = {
    };
  }

  const isRestricted = () => basket.filter(x => x.isRestricted > 0).length;

  const renderPayButton = () => {
    return isRestricted && false
    ? <h2>Your purchase requires age verification. Please provide a valid ID at order pickup</h2> 
    : <button className="button" onClick={onPay} type="submit">Pay Now</button>
  }

  const onPay = async (event) => {
    event.preventDefault();

    const session = await createCheckout({
      email: 'steve.gaetjens@roadrunner.com',
      items: state.basket
    });
    stripe.redirectToCheckout(session);
  }

  if (state.basket?.length === 0) {
    return <h1>Your basket is empty</h1>;
  }
  
  return (
    <div className="checkout">
      <div className="checkout-step-1">
          <h3 className="text-center">Order Summary</h3>
          <span className="d-block text-center">Review items in your basket.</span>
          <br />
          <ul>
            <li>You may select a time or ASAP</li>
            <li>If your cart has age-restricted items, you may order but cannot pay</li>
            <li>If you are logged in, your email will be sent to Stripe as your user name</li>
            <li>If you are not logged in, you must provide an email address (you may register after providing an email via Stripe checkout)</li>
            <li>Hide 'Pay Now' if restricted items are in the cart</li>
            <li>Add 'Pay Later' which just creates the order</li>
          </ul>
          <div className="checkout-items">
            {state.basket.map((product) => (
              <BasketItem
                basket={state.basket}
                dispatch={dispatch}
                key={product.id}
                product={product}
              />
            ))}
          </div>
          <br />
          <div className="basket-total text-right">
            <p className="basket-total-title">Subtotal:</p>
            <h2 className="basket-total-amount">{displayMoney(subtotal)}</h2>
          </div>
          <br />
          <div className="checkout-shipping-action">
              {renderPayButton()}
              <button className="button" disabled={!!emailAddress} onClick={onPayLater} type="submit">Place My Order</button>
          </div>
      </div>
    </div>
  );
};


export default OrderSummary;
