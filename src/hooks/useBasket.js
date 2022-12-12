import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket as dispatchAddToBasket, removeFromBasket } from '@/redux/actions/basketActions';

const useBasket = () => {
  const { basket } = useSelector((state) => ({ basket: state.basket }));
  const dispatch = useDispatch();

  const addToBasket = (cartItem) => {
      dispatch(dispatchAddToBasket(cartItem));
      displayActionMessage('Item added to basket', 'success');
  };

  return { basket, addToBasket };
};

export default useBasket;
