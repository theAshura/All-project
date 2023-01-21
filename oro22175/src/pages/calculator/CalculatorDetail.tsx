import { Card } from "antd";
import Breadcrumb from "components/Breadcrumb";
import CalculatorDetailComponent from "components/Calculator/CalculatorDetail";
import React from "react";

const CalculatorDetail = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Email Content"}>
        <CalculatorDetailComponent />
      </Card>
    </>
  );
};

export default CalculatorDetail;
