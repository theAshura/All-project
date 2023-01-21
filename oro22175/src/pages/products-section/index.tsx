import React, { FC } from "react";
import Card from "components/Card";
import ProductsComponent from "components/ProductsSection";
import Breadcrumb from "components/Breadcrumb";

const ProductsSection: FC = () => {
  return (
    <>
      <Breadcrumb />
      <Card
        title={"Products Section in Homepage and Product Page Modification"}
      >
        <ProductsComponent />
      </Card>
    </>
  );
};

export default ProductsSection;
