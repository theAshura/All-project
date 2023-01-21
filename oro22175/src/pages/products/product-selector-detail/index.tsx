import { Breadcrumb, Card } from "antd";
import ProductSelectorComponent from "components/Products/product-selector/ProductSelectorComponent";
import React from "react";

const ProductSelectorPage = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Products Selector Function"}>
        <ProductSelectorComponent />
      </Card>
    </>
  );
};

export default ProductSelectorPage;
