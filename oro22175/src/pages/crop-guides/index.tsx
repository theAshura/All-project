import React, { FC } from "react";
import Card from "components/Card";
import CropGuidesComponent from "components/CropGuides";
import Breadcrumb from "components/Breadcrumb";

const CropGuides: FC = () => {
  return (
    <>
      <Breadcrumb />
      <Card
        title={"Crop Guides Section in Homepage and Product Page Modification"}
      >
        <CropGuidesComponent />
      </Card>
    </>
  );
};

export default CropGuides;
