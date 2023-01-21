import React, { FC } from "react";
import Card from "components/Card";
import HomeComponent from "components/Home";
import Breadcrumb from "components/Breadcrumb";
import { useTranslation } from "react-i18next";

const Home: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Breadcrumb />
      <Card title={t("navbar.homepage")}>
        <HomeComponent />
      </Card>
    </>
  );
};

export default Home;
