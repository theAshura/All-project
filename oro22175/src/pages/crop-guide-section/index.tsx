import { Card } from "antd";
import CropGuidesDetail from "components/CropGuidesDetail/CropGuidesDetailComponent";
import React from "react";
import Breadcrumb from "components/Breadcrumb";
const CropGuide = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Crop Guide Function"}>
        <CropGuidesDetail />
      </Card>
    </>
  );
};

export default CropGuide;
