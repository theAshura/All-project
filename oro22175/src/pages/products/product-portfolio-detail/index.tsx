import { Card } from "antd";
import Breadcrumb from "components/Breadcrumb";
import ProductPortfolioComponent from "components/Products/product-portfolio/ProductPortfolioComponent";
import React from "react";

const ProductPortfolioPage = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Products Portfolio Function"}>
        <ProductPortfolioComponent />
      </Card>
    </>
  );
};

export default ProductPortfolioPage;
