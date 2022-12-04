import { ImageLoader } from '@/components/common';
import PropType from 'prop-types';
import { displayMoney, productSizes } from '@/helpers/utils';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';

const ProductFeatured = ({ product }) => {
  const history = useHistory();
  const onClickItem = () => {
    if (!product) return;

    history.push(`/product/${product.id}`);
  };
  
  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div className="product-display" onClick={onClickItem} role="presentation">
        <div className="product-display-img">
          {(product.images || []).length > 0 ? (
            <img alt={product.name} className="product-card-img" src={product.images[0]}/>            
          ) : <Skeleton width="100%" height="100%" />}
        </div>
        <div className="product-display-details">
          <h2>{product.name || <Skeleton width={80} />}</h2>
          <p className="text-subtle text-italic">
            {(product.sizes || []).map(s => `${productSizes[s.size]}: ${displayMoney(s.price)}`)}
          </p>
        </div>
      </div>
    </SkeletonTheme>
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
