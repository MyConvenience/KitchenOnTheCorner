import { ProductShowcaseGrid } from '@/components/product';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCategories } from '@/hooks';

const ViewCategory = () => {
  const { id } = useParams();
  const {products, fetchCategoryProducts} = useCategories();

  useEffect(() => {
    if (products.length === 0) {
      fetchCategoryProducts(id);
    }
  });

  return (<ProductShowcaseGrid maxColumns={4} products={products || []}/>);
}


export default ViewCategory;

