import React, { FC } from "react";
import Card from "components/Card";
import BannerComponent from "components/Banner";
import Breadcrumb from "components/Breadcrumb";
import { useTranslation } from "react-i18next";

const Banner: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Breadcrumb />
      <Card title={"Banner Modification"}>
        <BannerComponent />
      </Card>
    </>
  );
};

export default Banner;
