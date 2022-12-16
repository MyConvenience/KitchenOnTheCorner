import { ArrowRightOutlined } from "@ant-design/icons";
import { MessageDisplay, Rotator } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP } from "@/constants/routes";
import { useDocumentTitle, useFeaturedProducts, useRecommendedProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/banner-girl.png";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  useDocumentTitle("KOTC | Home");
  useScrollTop();

  return (
    <main className="content">
      
    </main>
  );
};

export default Home;
