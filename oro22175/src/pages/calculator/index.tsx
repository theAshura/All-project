import { Card } from "antd";
import Breadcrumb from "components/Breadcrumb";
import CalculatorShareEmail from "components/Calculator";
import React from "react";

const index = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Share Comparision List  Function"}>
        <CalculatorShareEmail />
      </Card>
    </>
  );
};

export default index;
