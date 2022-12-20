/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from '@/components/product';
import PropType from 'prop-types';
import React from 'react';
import {Row, Col} from 'react-bootstrap';
import _ from 'lodash';

const ProductShowcase = ({ products, maxColumns }) => {
  return _.chunk(products, maxColumns)
      .map((row, rowIndex) => 
          <Row className='product-display-grid' key={`sc${rowIndex}`}>
            {
                row.map(p => <Col key={p.productId}><FeaturedProduct product={p}/></Col>)
            }
          </Row>);
}

ProductShowcase.defaultProps = {
  products: [],
  maxColumns: 4
};

export default ProductShowcase;
