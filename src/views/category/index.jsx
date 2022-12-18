import { ProductShowcaseGrid } from '@/components/product';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCategories } from '@/hooks';

const ViewCategory = () => {
  const { id } = useParams();
  const {products, fetchCategoryProducts, category} = useCategories();

  useEffect(() => {
    if (!category) {
      fetchCategoryProducts(id);
    }
  });

  return (<><h1>{category?.title}</h1><ProductShowcaseGrid maxColumns={4} products={products || []}/></>);
}


export default ViewCategory;

