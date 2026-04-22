import React from "react";
import ProductList from "./ProductList";

const NewArrivals = () => {
  return (
    <ProductList
      pageTitle="New Arrivals"
      forcedSortBy="createdAt"
      forcedSortDir="desc"
    />
  );
};

export default NewArrivals;
