import {useState, useEffect} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '@/constants/constants';
import firebase from '@/services/firebase';

const useStripe = (activeOnly) => {
  const [stripe, setStripe] = useState(null);
  const [checkoutSession, setCheckoutSession] = useState(null);
  
  const createCheckout = async (args) => {
    const sesh = await firebase.createStripeCheckout(args);
    setCheckoutSession(sesh);
    return sesh;
  }

  const clearSession = () => setCheckoutSession(null);

  const getSessionDetails = async () => {
    return await stripe.checkout.sessions.retrieve(checkoutSession);
  }
  
  useEffect(async () => {
    if (!stripe) {
      setStripe(await loadStripe(STRIPE_PUBLIC_KEY));
    }
  }, [stripe]);

  return {
    stripe, createCheckout, getSessionDetails, clearSession
  };
};

export default useStripe;
