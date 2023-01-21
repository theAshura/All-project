import { Button, Col, Form, Input, Row } from "antd";
import classes from "./login.module.scss";
import imgLayoutORO from "assets/img/layoutORO.webp";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, TStore } from "store";
import useSessionStorage from "hooks/useSessionStorage";
import { validatePassword } from "helpers/utilities.helper";
import { FormLoginProps } from "api/auth/auth.interface";
import { useNavigate } from "react-router-dom";
import ROUTES from "routes/constant";

const initialValues: FormLoginProps = {
  userName: "",
  password: "",
};

const LoginComponent = () => {
  const navigate = useNavigate();
  const [, setRefreshToken] = useSessionStorage<string | null>("__token", null);
  const loading = useSelector((state: TStore) => state.auth.loading);
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values: FormLoginProps) => {
      dispatch(
        actions.auth.loginAction({
          loginInfo: values,
          setRefreshToken,
        })
      );
    },
    [dispatch, setRefreshToken]
  );

  useEffect(() => {
    if (window.location.href.slice(-1) === "/") {
      navigate(ROUTES.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

  return (
    <div className={classes.wrapLoginPage}>
      <Row className={classes.customRow}>
        <Col lg={12}>
          <div className={classes.wrapLogo}>
            <img src={imgLayoutORO} alt="logo" />{" "}
            <h3>
              Rovensa <strong>Next</strong>
            </h3>
          </div>
          <div className={classes.wrapForm}>
            <div className={classes.title}>Welcome Back</div>
            <Form
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={initialValues}
              onFinish={onSubmit}
              autoComplete="off"
            >
              <Form.Item label="User Name" name="userName">
                <Input
                  placeholder="Username..."
                  maxLength={40}
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  className={classes.wrapInput}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value === "") {
                        return Promise.reject("Please input your password!");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password
                  placeholder="Password..."
                  maxLength={40}
                  className={classes.wrapInput}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={classes.customButton}
                loading={loading}
              >
                Sign in
              </Button>
            </Form>
          </div>
        </Col>
        <Col lg={12} className={classes.hideInSmallScreen}>
          <img src={imgLayoutORO} className={classes.bigLogo} alt="logo" />
        </Col>
      </Row>
    </div>
  );
};

export default LoginComponent;
