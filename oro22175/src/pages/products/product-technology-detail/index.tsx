import { Card } from "antd";
import Breadcrumb from "components/Breadcrumb";
import ProductTechnoComponent from "components/Products/product-technology/ProductTechnoComponent";

const ProductSelectorPage = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Products Technology Function"}>
        <ProductTechnoComponent />
      </Card>
    </>
  );
};

export default ProductSelectorPage;
