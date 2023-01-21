import { Card } from "antd";
import Breadcrumb from "components/Breadcrumb";
import Products from "components/Products/ProductComponent";

const ProductsComponent = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Products Function"}>
        <Products />
      </Card>
    </>
  );
};

export default ProductsComponent;
