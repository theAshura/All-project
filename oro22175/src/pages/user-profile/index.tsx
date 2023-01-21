import { Breadcrumb, Card } from "antd";
import UserProfle from "components/User/UserProfle";

const index = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"My Profile"}>
        <UserProfle />
      </Card>
    </>
  );
};

export default index;
