import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addQtyItem, minusQtyItem } from '@/redux/actions/basketActions';

const BasketItemControl = ({ item }) => {
  const dispatch = useDispatch();

  const onAddQty = () => {
    dispatch(addQtyItem(item.id));
  };

  const onMinusQty = () => {
    if (product.quantity !== 0) {
      dispatch(minusQtyItem(item.id));
    }
  };

  if (!item) {
    return null;
  }

  return (
    <div className="basket-item-control">
      <button
        className="button button-border button-border-gray button-small basket-control basket-control-add"
        onClick={onAddQty}
        type="button"
      >
        <PlusOutlined style={{ fontSize: '9px' }} />
      </button>
      <button
        className="button button-border button-border-gray button-small basket-control basket-control-minus"
        disabled={item.quantity === 1}
        onClick={onMinusQty}
        type="button"
      >
        <MinusOutlined style={{ fontSize: '9px' }} />
      </button>
    </div>
  );
};

BasketItemControl.defaultProps = {
  product: {
    quantity: 0,
    id: '',
    productId: '',
    name: '',
    image: ''
  }
};

BasketItemControl.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    productId: PropType.string,
    name: PropType.string,
    quantity: PropType.number,
    image: PropType.string,
  }).isRequired
};

export default BasketItemControl;
