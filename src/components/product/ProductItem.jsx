import { CheckOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import { displayMoney, generateUUID, productSizes } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import imageNotFound from '@/images/imageNotFound.jpg';
  
const ProductItem = ({ product, addToBasket }) => {
  const history = useHistory();

  const onClickItem = () => {
    if (!product) return;

    if (product.id) {
      history.push(`/product/${product.id}`);
    }
  };

  const handleAddToBasket = () => {
    const image = product?.image || (product?.images.length > 0 ? product.images[0] : imageNotFound);

    const basketItem =  { 
      id: generateUUID(),
      productId: product.id, 
      productName: product.name,
      image: image,
      size: product.sizes[0],
      quantity: 1,
      ext_price: product.sizes[0].price,
      isRestricted: product.isRestricted,
      options: {}
    };

    addToBasket(basketItem);
  };

  const image = product?.image || (product?.images.length > 0 ? product.images[0] : imageNotFound);
  return (
    <div className='product-card'>
      <h2>{product.name}</h2>
    <div className="product-display" onClick={onClickItem} role="presentation">
    <div className="product-display-img">
        <img alt={product.name} className="product-card-img" src={image}/>        
    </div>
    <div className="product-display-details">
      <div className="text-subtle text-italic">
        {(product.sizes || []).map(s => <div key={s.size}>{`${productSizes[s.size]}: ${displayMoney(s.price)}`}</div>)}
      </div>     
    </div>
        </div>
        {product.id && (
          <button
            className='product-card-button button-small button button-block'
            onClick={handleAddToBasket}
            type="button"
          >
            Add to Cart
          </button>
        )}
  </div>);
};

ProductItem.defaultProps = {
  addToBasket: undefined
};

ProductItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  product: PropType.object.isRequired,
  addToBasket: PropType.func
};

export default ProductItem;
