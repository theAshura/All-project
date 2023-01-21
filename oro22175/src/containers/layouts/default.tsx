import { useCallback, useState } from "react";
import Header from "./navbar/navbar";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Drawers from "./Drawers";
import "./default.scss";

const Default = () => {
  const [collapsed, setcollapsed] = useState(false);

  const handleChangeCollapsed = useCallback(() => {
    setcollapsed(!collapsed);
  }, [collapsed]);

  return (
    <>
      <Layout className="customAntdLayout">
        <Header handleChangeCollapsed={handleChangeCollapsed} />
        <Layout>
          <Sidebar />
          <Drawers
            collapsed={collapsed}
            handleChangeCollapsed={handleChangeCollapsed}
          />
          <div className="layoutcontentContainer">
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </>
  );
};

export default Default;
