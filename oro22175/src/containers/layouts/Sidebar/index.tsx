import { Layout } from "antd";
import MenuComponent from "../MenuComponent";
import "./sidebar.scss";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <>
      <Sider className="customSidebar">
        <MenuComponent />
      </Sider>
      <div className="sidebarFixtop" />
    </>
  );
};

export default Sidebar;
