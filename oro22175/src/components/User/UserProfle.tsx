import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  ModalFuncProps,
  Row,
} from "antd";
import { Suspense, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import imgLayoutORO from "assets/img/layoutORO.webp";
import { useDispatch, useSelector } from "react-redux";
import { TStore } from "store";
import classes from "./user-profile.module.scss";
import { emailRegex, mapErrorMessage } from "helpers/utilities.helper";
import { UpdateUserProfileParams } from "api/user/user.interface";
import { updateUserProfile } from "api/user/user.api";
import { authActions } from "store/auth.slice";
import ModalContainer from "components/modal/ModalContainer";
import ChangePasswordForm from "./ChangePasswordForm";
import { useCallbackPrompt } from "hooks/useCallbackPrompt";

const UserProfle = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  const userInfo = useSelector((state: TStore) => state?.auth?.userInfo);
  const [editProfile, setEditProfile] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isChangeValues, setIsChangeValues] = useState(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(isChangeValues);
  const [config, setConfig] = useState<ModalFuncProps>();
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);

  const handleCancelAndResetForm = useCallback(() => {
    formChangePassword.resetFields();
    setVisibleModal(false);
  }, [formChangePassword]);

  const setDefaultFormData = useCallback(() => {
    if (userInfo) {
      form.setFieldsValue({
        email: userInfo?.email,
        employeeName: userInfo?.employeeName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const onHandleOkPopupConfirm = useCallback(() => {
    showPrompt && confirmNavigation();
    setVisibleModalConfirm(false);
    setVisibleModal(false);
    setEditProfile(false);
    handleCancelAndResetForm();
    setDefaultFormData();
    formChangePassword.resetFields();
    Modal.destroyAll();
    setIsChangeValues(false);
  }, [
    confirmNavigation,
    formChangePassword,
    handleCancelAndResetForm,
    setDefaultFormData,
    showPrompt,
  ]);

  useEffect(() => {
    setConfig({
      open: visibleModalConfirm,
      title: "Infomation will not be saved",
      content: "Are you sure? Information entered will not be saved",
      centered: true,
      onOk: () => onHandleOkPopupConfirm(),
      onCancel: () => {
        showPrompt && cancelNavigation();
        setVisibleModalConfirm(false);
        setIsChangeValues(false);
        Modal.destroyAll();
      },
    });
  }, [
    cancelNavigation,
    handleCancelAndResetForm,
    onHandleOkPopupConfirm,
    showPrompt,
    visibleModalConfirm,
  ]);

  useEffect(() => {
    if (showPrompt && isChangeValues) {
      config && Modal.confirm(config);
      setVisibleModalConfirm(true);
    } else {
      Modal.destroyAll();
    }
  }, [config, isChangeValues, showPrompt]);

  const onFinish = useCallback(
    async (values: UpdateUserProfileParams) => {
      try {
        setLoadingButton(true);
        const updateUserProfileParams = {
          email: values?.email?.trim(),
          employeeName: values?.employeeName?.trim(),
        };
        await updateUserProfile(updateUserProfileParams);
        const jsonUserInfo = localStorage.getItem("userInfo");
        if (jsonUserInfo) {
          const userInfo = JSON.parse(jsonUserInfo);
          const newUserInfo = {
            ...userInfo,
            ...updateUserProfileParams,
          };
          localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
          dispatch(authActions.setUserProfile(updateUserProfileParams));
        }
        setIsChangeValues(false);
        setVisibleModalConfirm(false);
        Modal.destroyAll();
        message.success("Update Successfully!");
        setEditProfile(false);
        setLoadingButton(false);
      } catch (error) {
        setLoadingButton(false);
        mapErrorMessage(error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    setDefaultFormData();
  }, [setDefaultFormData]);

  const onChangeForm = useCallback((checkChangeForm: boolean) => {
    setIsChangeValues(checkChangeForm);
  }, []);
  return (
    <div style={{ position: "relative" }}>
      {!editProfile && (
        <div className={classes.wrapButtonHeader}>
          <Button
            type="primary"
            onClick={() => {
              setVisibleModal((prev) => !prev);
            }}
          >
            Change Password
          </Button>
          <Button
            type="primary"
            onClick={() => setEditProfile((prev) => !prev)}
          >
            Edit Profile
          </Button>
        </div>
      )}

      <Form
        form={form}
        onChange={() => onChangeForm(true)}
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <HeaderInfo>
          <ImgInfo src={imgLayoutORO} />
          <div className={classes.header}>
            <div className={classes.wrapInfo}>
              <div className={classes.title}>User Name:</div>
              <span>{userInfo?.userName || ""}</span>
            </div>
            <div className={classes.wrapInfo}>
              <div className={classes.title}>Role:</div>
              <span>Admin</span>
            </div>
          </div>
        </HeaderInfo>
        <AccountInfo>
          <Row>
            <Description>Account Info</Description>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" md={{ span: 8 }} xs={{ span: 24 }}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    pattern: emailRegex,
                    message: "Email Address is invalid",
                  },
                ]}
              >
                <Input
                  maxLength={320}
                  disabled={!editProfile || loadingButton ? true : false}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" md={{ span: 8 }} xs={{ span: 24 }}>
              <Form.Item
                label="Employee Name"
                name="employeeName"
                rules={[
                  {
                    required: true,
                    message: "Employee Name is required",
                  },
                ]}
              >
                <Input
                  maxLength={200}
                  disabled={!editProfile || loadingButton ? true : false}
                />
              </Form.Item>
            </Col>
          </Row>
          {editProfile && (
            <GroupButton>
              <Button
                style={{ marginRight: "1rem" }}
                onClick={() =>
                  (isChangeValues && config && Modal.confirm(config)) ||
                  (Modal.destroyAll(),
                  setEditProfile((prev) => !prev),
                  setDefaultFormData())
                }
                disabled={loadingButton}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loadingButton}>
                Save
              </Button>
            </GroupButton>
          )}
        </AccountInfo>
      </Form>

      {visibleModal && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleModal}
            title={"Change Password"}
            onSubmit={formChangePassword.submit}
            onClose={() =>
              (isChangeValues && config && Modal.confirm(config)) ||
              (Modal.destroyAll(), handleCancelAndResetForm())
            }
            okText={"Save"}
            isLoadingButton={loadingButton}
          >
            <ChangePasswordForm
              onChangeForm={onChangeForm}
              form={formChangePassword}
              loadingButton={loadingButton}
              setLoadingButton={setLoadingButton}
              handleCancelAndResetForm={handleCancelAndResetForm}
            />
          </ModalContainer>
        </Suspense>
      )}
    </div>
  );
};

const HeaderInfo = styled.div`
  display: flex;
  @media (max-width: 500px) {
    width: 100%;
    flex-direction: column;
  }
`;
const AccountInfo = styled.div`
  width: 100%;
  list-style-type: none;
  li {
    display: flex;
  }
`;
const Description = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  width: 100%;
  padding: 1rem 0 1rem 0;
`;
const ImgInfo = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 100%;
  object-fit: cover;
  margin-right: 5rem;
`;

const GroupButton = styled.div`
  text-align: right;
`;
export default UserProfle;
