import { ImageLoader } from '@/components/common';
import PropType from 'prop-types';
import { displayMoney, productSizes } from '@/helpers/utils';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import imageNotFound from '@/images/imageNotFound.jpg';

const ProductFeatured = ({ product }) => {
  const history = useHistory();
  const onClickItem = () => {
    history.push(`/product/${product.id}`);
  };
  
  const image = product?.image || (product?.images.length > 0 ? product.images[0] : imageNotFound);

  return (
    <div className="product-display" onClick={onClickItem} role="presentation">
      <div className="product-display-img">
          <img alt={product.name} className="product-card-img" src={image}/>        
      </div>
      <div className="product-display-details">
        <h2>{product.name}</h2>
        <div className="text-subtle text-italic">
          {(product.sizes || []).map(s => <div key={s.size}>{`${productSizes[s.size]}: ${displayMoney(s.price)}`}</div>)}
        </div>
      </div>
    </div>
  );
};

ProductFeatured.propTypes = {
  product: PropType.shape({
    images: PropType.array,
    name: PropType.string,
    description: PropType.string,
    id: PropType.string
  }).isRequired
};

export default ProductFeatured;
