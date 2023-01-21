import React, { FC } from "react";
import { Card } from "antd";
import ApplicationModificationComponent from "components/ApplicationModification";
import Breadcrumb from "components/Breadcrumb";

const ApplicationModification: FC = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Application"}>
        <ApplicationModificationComponent />
      </Card>
    </>
  );
};

export default ApplicationModification;
