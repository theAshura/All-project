import images from 'assets/images/images';
import cx from 'classnames';
import Container from 'components/common/container/Container';
import ModalConfirm from 'components/role/modal/ModalConfirm';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import Input from 'components/ui/input/Input';
import StepItem, { StepItemType } from 'components/ui/step-item/StepItem';
import { AppRouteConst } from 'constants/route.const';
import { StatusPage, UserContext } from 'contexts/user-profile/UserContext';
import history from 'helpers/history.helper';
import { toastSuccess } from 'helpers/notification.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useContext, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { resetPasswordAdminActions } from 'store/user/user.action';
import ModalPasswordForm from './ModalPasswordForm';
import styles from './password.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PasswordProps {
  dynamicLabels?: IDynamicLabel;
}

const Password: FC<PasswordProps> = ({ dynamicLabels }) => {
  const { search } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { statusPage } = useContext(UserContext);

  const {
    register,
    watch,
    setValue,
    clearErrors,
    // handleSubmit,
    formState: { errors },
  } = useFormContext();

  const watchPassword = watch('password');
  const { userDetailResponse } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [hidePassword, setHidePassword] = useState(true);
  const [messageError, setMessageError] = useState<{
    new?: string;
    confirm?: string;
  }>(null);
  const [modal, setModal] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const disableButton = useMemo(() => {
    const disableButtons = [false, false, false, false];

    if (watchPassword?.length > 7 && watchPassword?.length < 21) {
      disableButtons[0] = true;
    }
    if (/[0-9]/.test(watchPassword)) {
      disableButtons[1] = true;
    }

    if (/[!@#$%^&*]/.test(watchPassword)) {
      disableButtons[2] = true;
    }
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(watchPassword)) {
      disableButtons[3] = true;
    }
    return disableButtons;
  }, [watchPassword]);

  const renderShowIcon = () =>
    search !== '?edit' && (
      <button
        onClick={() => setHidePassword(!hidePassword)}
        className={styles.btnPassword}
      >
        <img
          src={
            hidePassword
              ? images.icons.hidePassword
              : images.icons.unHidePassword
          }
          alt="hidePassword"
          className={styles.icPassword}
        />
      </button>
    );

  const renderCopyPassword = () =>
    statusPage === StatusPage.CREATE && (
      <>
        <div className={styles.wrapLabelPassword}>
          <span>Password</span>
          {statusPage === StatusPage.CREATE && (
            <img
              src={images.icons.icRequiredAsterisk}
              className="pb-2 ps-1"
              alt="required"
            />
          )}
        </div>

        <button
          className={styles.btnCopy}
          onClick={() => {
            if (watchPassword?.length > 0) {
              navigator.clipboard.writeText(watchPassword);
              toastSuccess(
                renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                    'Copy password success'
                  ],
                ),
              );
            }
          }}
        >
          <img src={images.icons.icCopy} alt="hidePassword" />
        </button>
      </>
    );

  // const handleSubmitFn = (dataForm) => {
  //   onSubmit({
  //     ...dataForm,
  //   });
  // };

  const onSaveChangePassword = (data) => {
    if (data.new.text !== data.confirm.text) {
      setMessageError((prev) => ({
        ...prev,
        confirm: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
            'The password confirmation does not match'
          ],
        ),
      }));
      setOpenResetPassword(true);
      return;
    }

    dispatch(
      resetPasswordAdminActions.request({
        id: id || userDetailResponse?.id,
        oldPassword: data?.oldPassword?.text || null,
        newPassword: data.new.text,
        confirmPassword: data.confirm.text,
        isProfile: true,
        handleSuccess: () => {
          setValue('password', data.confirm.text);
          setOpenResetPassword(false);
          setMessageError(null);
        },
      }),
    );
  };

  const handleResetPassword = (isShow: boolean) => {
    setOpenResetPassword(isShow);
    if (!isShow) {
      setMessageError(null);
    }
  };

  return (
    <div className={styles.wrapResetPassword}>
      <Container className="pb-4">
        <div className={styles.password}>
          <Row
            className={cx({
              [styles.rowPasswordEditScreen]: statusPage !== StatusPage.CREATE,
            })}
          >
            <Col>
              <div className="d-flex justify-content-start">
                {renderCopyPassword()}
              </div>

              {/* <Input
                className={styles.hiddenInput}
                autoComplete="new-password"
                name="username"
                type="text"
              /> */}
              <div className="d-flex">
                {id?.length > 0 || userDetailResponse?.id?.length > 0 ? (
                  <Input
                    className={styles.fieldInputPassword}
                    label={
                      statusPage !== StatusPage.CREATE &&
                      renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Password,
                      )
                    }
                    disabled
                    value={watchPassword}
                    maxLength={128}
                    type={
                      statusPage !== StatusPage.CREATE || hidePassword
                        ? 'password'
                        : 'text'
                    }
                    renderSuffix={
                      statusPage === StatusPage.CREATE && renderShowIcon()
                    }
                  />
                ) : (
                  <Input
                    className={styles.fieldInputPassword}
                    label={
                      statusPage !== StatusPage.CREATE &&
                      renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Password,
                      )
                    }
                    disabled={
                      id?.length > 0 || userDetailResponse?.id?.length > 0
                    }
                    messageRequired={
                      errors?.password?.message !== 'wrong format'
                        ? errors?.password?.message
                        : ''
                    }
                    placeholder={renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'Enter your password'
                      ],
                    )}
                    {...register('password')}
                    maxLength={128}
                    type={
                      statusPage !== StatusPage.CREATE || hidePassword
                        ? 'password'
                        : 'text'
                    }
                    renderSuffix={
                      statusPage === StatusPage.CREATE && renderShowIcon()
                    }
                  />
                )}

                <div
                  className={cx('d-flex justify-content-end', {
                    [styles.btnAutoGenerate]: id?.length > 0,
                  })}
                >
                  {userDetailResponse?.id?.length > 0 && (
                    <ModalPasswordForm
                      isShow={openResetPassword}
                      setOpenResetPassword={handleResetPassword}
                      onSave={onSaveChangePassword}
                      messageError={messageError}
                      setMessageError={setMessageError}
                      dynamicLabels={dynamicLabels}
                    />
                  )}
                  {id?.length > 0 || userDetailResponse?.id?.length > 0 ? (
                    <Button
                      className="ms-auto"
                      disabled={statusPage === StatusPage.VIEW}
                      onClick={() => {
                        setOpenResetPassword(true);
                      }}
                    >
                      {renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Reset password'],
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="ms-auto"
                      onClick={() => {
                        const randPassword1 = Array(3)
                          .fill('0123456789')
                          .map((x) => x[Math.floor(Math.random() * x.length)])
                          .join('');
                        const randPassword2 = Array(3)
                          .fill('!@#$%^&*')
                          .map((x) => x[Math.floor(Math.random() * x.length)])
                          .join('');
                        const randPassword3 = Array(3)
                          .fill('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
                          .map((x) => x[Math.floor(Math.random() * x.length)])
                          .join('');
                        const randPassword4 = Array(3)
                          .fill('abcdefghijklmnopqrstuvwxyz')
                          .map((x) => x[Math.floor(Math.random() * x.length)])
                          .join('');

                        setValue(
                          'password',
                          `${randPassword2}${randPassword1}${randPassword3}${randPassword4}`,
                        );
                        clearErrors('password');
                      }}
                    >
                      {renderDynamicLabel(
                        dynamicLabels,
                        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Auto generate'],
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Col>
            {statusPage === StatusPage.CREATE && (
              <Col className={styles.passwordWrapRequired}>
                <Row md="12" className={styles.rowSubOption}>
                  <p className={styles.labelPasswordRequired}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'Password must contain'
                      ],
                    )}
                  </p>
                  <StepItem
                    className="mb-2 pb-1"
                    status={
                      disableButton[0]
                        ? StepItemType.ACTIVE
                        : StepItemType.ACTIVE_DISABLED
                    }
                    label={renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'Minimum 8-20 characters'
                      ],
                    )}
                  />
                  <StepItem
                    className="mb-2 pb-1"
                    status={
                      disableButton[1]
                        ? StepItemType.ACTIVE
                        : StepItemType.ACTIVE_DISABLED
                    }
                    label={renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'At least 1 number'
                      ],
                    )}
                  />
                  <StepItem
                    className="mb-2 pb-1"
                    status={
                      disableButton[2]
                        ? StepItemType.ACTIVE
                        : StepItemType.ACTIVE_DISABLED
                    }
                    label={renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'At least 1 special character'
                      ],
                    )}
                  />
                  <StepItem
                    className="mb-2 pb-1"
                    status={
                      disableButton[3]
                        ? StepItemType.ACTIVE
                        : StepItemType.ACTIVE_DISABLED
                    }
                    label={renderDynamicLabel(
                      dynamicLabels,
                      USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                        'At least 1 lower case and upper case letter'
                      ],
                    )}
                  />
                </Row>
              </Col>
            )}
          </Row>
        </div>
      </Container>

      {statusPage !== StatusPage.VIEW && (
        <div className={cx('d-flex justify-content-end pt-3', styles.wrapBtn)}>
          <Button
            className="me-3"
            buttonType={ButtonType.Select}
            buttonSize={ButtonSize.Small}
            onClick={() => setModal(true)}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          {/* <Button
            buttonSize={ButtonSize.Small}
            onClick={
              isEmpty(errors?.password?.message)
                ? handleSubmit(handleSubmitFn, (err) => {
                    const watchForm = watch();

                    if (isEmpty(err?.password?.message)) {
                      handleSubmitFn({
                        ...watchForm,
                        password: watchPassword,
                      });
                    }

                    if (!activeTabs?.includes(TabName.ROLE_AND_PERMISSION))
                      clearErrors('roles');
                  })
                : null
            }
          >
            Next
          </Button> */}
        </div>
      )}
      <ModalConfirm
        toggle={() => setModal(!modal)}
        modal={modal}
        handleSubmit={() => history.push(AppRouteConst.USER)}
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        )}
        content={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        )}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default Password;
