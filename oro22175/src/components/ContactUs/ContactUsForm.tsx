import { Form, FormInstance, Input, Select, UploadFile } from "antd";
import { useCallback } from "react";
import { TYPE_ACTION } from "utils/constants";
import { ValueFormContactUs } from ".";
import classes from "./contact-us.module.scss";
export interface Props {
  form: FormInstance<ValueFormContactUs>;
  onFinish: (value: ValueFormContactUs) => void;
  type: string;
}
const ContactUsForm = ({ form, onFinish, type = TYPE_ACTION.ADD }: Props) => {
  const initialValues = useCallback(() => {
    if (type === TYPE_ACTION.ADD) {
      return {
        title: "",
        shortDescription: [],
        hyperLink: [],
      };
    }
    return {
      title: "",
      shortDescription: [],
      hyperLink: [],
    };
  }, [type]);

  const renderHyperLink = useCallback(() => {
    const listHyperLink = [
      "Linkedin",
      "Youtube",
      "Facebook",
      "Instagram",
      "Twitter",
      "Website",
      "Email Us",
    ];
    return listHyperLink.map((item, key) => (
      <Input
        key={key}
        addonBefore="http://"
        maxLength={60}
        placeholder={item}
        className={classes.mb10}
      />
    ));
  }, []);

  return (
    <Form
      form={form}
      initialValues={initialValues}
      labelAlign={"left"}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Contact Us Title"
        name="title"
        rules={[
          { required: true, message: "Input Contact Us Title is required" },
        ]}
      >
        <Input maxLength={60} placeholder="Input Contact Us Title" />
      </Form.Item>
      <Form.Item
        label="Contact Us Short Description"
        name="shortDescription"
        rules={[
          {
            required: true,
            message: "Input Type in Short Description of Contact is required",
          },
        ]}
      >
        <Input
          maxLength={60}
          placeholder="Input Type in Short Description of Contact"
        />
      </Form.Item>
      <Form.Item label="Input Hyperlink for Social Media" name="hyperLink">
        {renderHyperLink()}
      </Form.Item>
    </Form>
  );
};

export default ContactUsForm;
