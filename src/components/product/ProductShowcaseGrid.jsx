/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from '@/components/product';
import PropType from 'prop-types';
import React from 'react';
import {Row, Col} from 'react-bootstrap';

const ProductShowcase = ({ products, maxColumns }) => {
  return (<Row className='product-display-grid'> 
  {
    products.map((p, index) => (index + 1) % maxColumns === 0
      ?  <><Col className='w-100'/><Col className='col'><FeaturedProduct key={p.productId} product={p}/></Col></>
      :  <Col className='col'><FeaturedProduct key={p.productId} product={p}/></Col>)
  }
  </Row>);
}

ProductShowcase.defaultProps = {
  products: [],
  maxColumns: 4
};

export default ProductShowcase;
