import React from "react";
import ProductList from "./ProductList";

const BestSellers = () => {
  return (
    <ProductList
      pageTitle="Best Sellers"
      forcedSortBy="bestSold"
      forcedSortDir="desc"
    />
  );
};

export default BestSellers;
