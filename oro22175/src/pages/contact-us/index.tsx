import React, { FC } from "react";
import Card from "components/Card";
import ContactUsComponent from "components/ContactUs";
import Breadcrumb from "components/Breadcrumb";

const ContactUs: FC = () => {
  return (
    <>
      <Breadcrumb />
      <Card title={"Contact Us"}>
        <ContactUsComponent />
      </Card>
    </>
  );
};

export default ContactUs;
