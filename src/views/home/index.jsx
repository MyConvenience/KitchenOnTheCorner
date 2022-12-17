import { ArrowRightOutlined } from "@ant-design/icons";
import { MessageDisplay, Rotator } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP } from "@/constants/routes";
import { useDocumentTitle, useFeaturedProducts, usePopularProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/banner-girl.png";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import _ from 'lodash';


const Home = () => {
  const [homeProducts, setHomeProducts] = useState([]);
  const { popularProducts, fetchPopularProducts, isLoading: popularIsLoading, error: popularError} = usePopularProducts();
  const { featuredProducts, fetchFeaturedProducts, isLoading: featuredIsLoading, error: featuredError} = useFeaturedProducts();
  useDocumentTitle("KOTC | Home");
  useScrollTop();

  useEffect(() => {
    if (!popularIsLoading && !featuredIsLoading) {
      const uniq = _.uniqBy(_.union(popularProducts, featuredProducts), 'id');
      setHomeProducts(uniq);
    }
  }, [popularIsLoading, featuredIsLoading]);

  return (
    <main className="content">
      <Rotator/>
      <ProductShowcaseGrid maxColumns={4} products={homeProducts}/>
    </main>
  );
};

export default Home;
