import React, { FC } from "react";
import Card from "components/Card";
import UserManagementComponent from "components/UserManagement";
import Breadcrumb from "components/Breadcrumb";

const AreaManagesModification: FC = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"User Management"}>
        <UserManagementComponent />
      </Card>
    </>
  );
};

export default AreaManagesModification;
