import { Form, FormInstance, Input, Select } from "antd";
import { useCallback } from "react";
import { OPTION_ROLE, TYPE_ACTION } from "utils/constants";
import { ValueFormUserManagment } from ".";

export interface Props {
  form: FormInstance<ValueFormUserManagment>;
  onFinish: (value: ValueFormUserManagment) => void;
  type: string;
}
const UserManagementForm = ({
  form,
  onFinish,
  type = TYPE_ACTION.ADD,
}: Props) => {
  const initialValues = useCallback(() => {
    if (type === TYPE_ACTION.ADD) {
      return {
        password: "",
        employeeName: "",
        role: OPTION_ROLE[0].value,
        reTypePassword: "",
      };
    }
    return {
      password: "",
      employeeName: "",
      role: OPTION_ROLE[0].value,
      reTypePassword: "",
    };
  }, [type]);

  const renderCreateUser = useCallback(() => {
    return (
      <>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Input Password is required",
            },
          ]}
        >
          <Input maxLength={20} placeholder="Input Password" />
        </Form.Item>
        <Form.Item
          label="Employee Name"
          name="employeeName"
          rules={[
            {
              required: true,
              message: "Input Employee Name is required",
            },
          ]}
        >
          <Input maxLength={40} placeholder="Input Employee Name" />
        </Form.Item>
        <Form.Item
          label="Roles"
          name="role"
          rules={[{ required: true, message: "Select role is required" }]}
        >
          <Select
            showSearch
            defaultValue="ADMIN"
            placeholder="Select a role"
            options={OPTION_ROLE}
          />
        </Form.Item>
      </>
    );
  }, []);

  const renderEditUser = useCallback(() => {
    return (
      <>
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Input Password is required",
            },
          ]}
        >
          <Input maxLength={20} placeholder="Input Password" />
        </Form.Item>
        <Form.Item
          label="Re-type new Password"
          name="reTypePassword"
          rules={[
            {
              required: true,
              message: "Input Re-type New Password is required",
            },
          ]}
        >
          <Input maxLength={20} placeholder="Input Re-type New Password" />
        </Form.Item>
      </>
    );
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
        label="Username"
        name="name"
        rules={[{ required: true, message: "Input Username is required" }]}
      >
        <Input maxLength={40} placeholder="Input Username" />
      </Form.Item>
      {type === TYPE_ACTION.ADD ? renderCreateUser() : renderEditUser()}
    </Form>
  );
};

export default UserManagementForm;
