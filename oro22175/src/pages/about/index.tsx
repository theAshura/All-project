/* PAGE: ABOUT
   ========================================================================== */

import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <>
      <p>{t("navbar.about_us")}</p>
      <p>Authenticated page</p>
    </>
  );
};

export default About;
