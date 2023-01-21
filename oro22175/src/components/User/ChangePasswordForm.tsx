import { Col, Form, Input, message, Row } from "antd";
import { FC, useCallback } from "react";
import { mapErrorMessage, validatePassword } from "helpers/utilities.helper";
import { ChangePasswordParams } from "api/user/user.interface";
import { changePassword } from "api/user/user.api";
import { FormInstance } from "antd/lib/form/Form";

interface Props {
  onChangeForm: (check: boolean) => void;
  form: FormInstance<ChangePasswordParams>;
  loadingButton: boolean;
  setLoadingButton: (loadingButton: boolean) => void;
  handleCancelAndResetForm: () => void;
}

const ChangePasswordForm: FC<Props> = ({
  form,
  loadingButton,
  setLoadingButton,
  handleCancelAndResetForm,
  onChangeForm,
}) => {
  const onSubmit = useCallback(
    async (values: ChangePasswordParams) => {
      try {
        setLoadingButton(true);
        await changePassword(values);
        setLoadingButton(false);
        message.success("Update Successfully!");
        form.resetFields();
        handleCancelAndResetForm();
        onChangeForm(false);
      } catch (error) {
        setLoadingButton(false);
        mapErrorMessage(error);
      }
    },
    [form, handleCancelAndResetForm, onChangeForm, setLoadingButton]
  );

  return (
    <Form
      form={form}
      name="basic"
      autoComplete="off"
      layout="vertical"
      onFinish={onSubmit}
      onChange={() => onChangeForm(true)}
    >
      <Row gutter={16}>
        <Col className="gutter-row" md={{ span: 24 }} xs={{ span: 24 }}>
          <Form.Item
            label="Current Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Current Password is required",
              },
            ]}
          >
            <Input.Password
              maxLength={40}
              disabled={loadingButton}
              placeholder="Input Current Password"
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" md={{ span: 24 }} xs={{ span: 24 }}>
          <Form.Item
            className="customRequiredField"
            label="New Password"
            name="newPassword"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value === "") {
                    return Promise.reject("Password is required");
                  }
                  if (
                    value.length < 8 ||
                    value.length > 20 ||
                    !validatePassword(value)
                  ) {
                    return Promise.reject(
                      "Password must have minimum 8-20 characters and at least one special character, one lower case and upper case letter"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              maxLength={40}
              disabled={loadingButton}
              placeholder="Input New Password"
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" md={{ span: 24 }} xs={{ span: 24 }}>
          <Form.Item
            label="Retype New Password"
            name="confirmNewPassword"
            rules={[
              {
                required: true,
                message: "Retype New Password is required",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              maxLength={40}
              disabled={loadingButton}
              placeholder="Input Confirm New Password"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default ChangePasswordForm;
