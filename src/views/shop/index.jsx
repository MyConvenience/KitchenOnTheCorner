/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from '@/components/product';
import { useDocumentTitle, useScrollTop, useCategories } from '@/hooks';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectFilter } from '@/selectors/selector';
import { Card, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router';

const Shop = () => {
  const history = useHistory();
  useDocumentTitle('Shop | KOTC');
  useScrollTop();
  const {categories} = useCategories();

  const store = useSelector((state) => ({
    filteredProducts: selectFilter(state.products.items, state.filter),
    products: state.products,
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading
  }), shallowEqual);

  const renderCategory = (category) => {
    const url = `/category/${category.name}`;

    return (
    <Card key={category.name} border="primary" onClick={()=> history.push(url)} style={{ width: '25rem' }}>
      <Card.Header>Category</Card.Header>
      <Card.Img src={category.image} alt={`Category: ${category.title}`}/>
      <Card.ImgOverlay>
        <Card.Title>{category.title}</Card.Title>
        <Card.Text>{category.description}</Card.Text>
      </Card.ImgOverlay>
  </Card>);
  }

  return (
    <main className="content">
      <Row>
        {categories.map(renderCategory)}
      </Row>
    </main>
  );
};

export default Shop;
