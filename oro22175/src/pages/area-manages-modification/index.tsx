import React, { FC } from "react";
import AreaManagesModificationComponent from "components/AreaManagesModification";
import Breadcrumb from "components/Breadcrumb";
import { Card } from "antd";

const AreaManagesModification: FC = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Area Manager"}>
        <AreaManagesModificationComponent />
      </Card>
    </>
  );
};

export default AreaManagesModification;
