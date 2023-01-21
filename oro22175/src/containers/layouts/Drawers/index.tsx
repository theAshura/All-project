import { Drawer } from "antd";
import { FC } from "react";
import MenuComponent from "../MenuComponent";
import "./drawers.scss";

interface Props {
  collapsed: boolean;
  handleChangeCollapsed: () => void;
}

const Drawers: FC<Props> = ({ collapsed, handleChangeCollapsed }) => {
  return (
    <Drawer
      className="customDrawers"
      width="200"
      placement="left"
      bodyStyle={{ padding: 0, height: "100%" }}
      closable={false}
      onClose={handleChangeCollapsed}
      open={collapsed}
    >
      <MenuComponent />
    </Drawer>
  );
};

export default Drawers;
