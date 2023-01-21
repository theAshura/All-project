import {
  AuditOutlined,
  ContactsOutlined,
  FileTextOutlined,
  FolderOutlined,
  QrcodeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMenuComponents } from "utils/constants";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Product", "products", <QrcodeOutlined />, [
    getItem("Application", "application", <FolderOutlined />),
    getItem("Product", "", <FolderOutlined />),
    getItem("Product Portfolio", "product-portfolio", <FolderOutlined />),
    getItem("Product Technologies", "product-technology", <FolderOutlined />),
  ]),
  // getItem("Crop Guide", "cropGuide", <AuditOutlined />, [
  // ]),
  getItem("Crop Guide", "crop-guide", <FileTextOutlined />),
  getItem("Area Manager", "area-manages", <ContactsOutlined />),
  getItem("Cost Calculator", "calculator", <UserOutlined />),
];

const MenuComponent: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string>("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    if (window.location.pathname) {
      //selectedKeys
      let pn = window.location.pathname;
      if (pn.slice(-1) === "/") {
        pn = pn.slice(0, pn.length - 1);
      }
      const defaultSelectedkey = pn.length ? pn.slice(1, pn.length) : "";

      //openKeys
      const arr = defaultSelectedkey.split("/");
      const defaultSelectedKeys = listMenuComponents(arr[0]);

      setOpenKeys([defaultSelectedKeys]);
      setSelectedKeys(defaultSelectedkey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <div style={{ width: 200 }}>
      <Menu
        selectedKeys={[selectedKeys]}
        openKeys={openKeys}
        mode="inline"
        theme="light"
        inlineCollapsed={false}
        items={items}
        onClick={(value) => {
          setOpenKeys(value?.keyPath);
          setSelectedKeys(value?.key);
          navigate(value?.key);
        }}
        onOpenChange={(e) => {
          const latestOpenKey = e.find((key) => openKeys.indexOf(key) === -1);
          if (!latestOpenKey) {
            const cloneOpenKeys = [...openKeys];
            setOpenKeys(cloneOpenKeys.filter((it) => it === e[0]));
          } else {
            setOpenKeys([...openKeys, ...e]);
          }
        }}
      />
    </div>
  );
};

export default MenuComponent;
