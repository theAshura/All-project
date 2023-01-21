import { Form, Input } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { ApplicationParams } from "api/product-selector/application-selector.interface";
import { ApplicationData } from "store/application-selector.slice";
export interface Props {
  form: FormInstance<ApplicationParams>;
  user?: ApplicationData;
  onFinish: (value: ApplicationParams) => void;
}
const ApplicationForm = ({ form, onFinish, user }: Props) => {
  return (
    <div>
      <Form
        form={form}
        name="basic"
        initialValues={{}}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          initialValue={user ? user.name : ""}
          label="Application Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Application Name is required",
            },
          ]}
        >
          <Input maxLength={200} placeholder="Input Application Name" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ApplicationForm;
