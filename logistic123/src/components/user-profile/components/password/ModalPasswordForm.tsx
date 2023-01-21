import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import { Row, Col } from 'reactstrap';
import Modal from 'components/ui/modal/Modal';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
// import { RoleScope } from 'constants/roleAndPermission.const';
// import { useSelector } from 'react-redux';
import StepItem, { StepItemType } from 'components/ui/step-item/StepItem';
import Button, { ButtonType } from 'components/ui/button/Button';
import { toastSuccess } from 'helpers/notification.helper';
import styles from './password.module.scss';

const regxNumber = /[0-9]/;
const regxSpecial = /[!@#$%^&*]/;
const regxLowerUpper = /(?=.*[a-z])(?=.*[A-Z])/;

export interface InfoPasswordFormProps {
  text: string;
  isShow: boolean;
}

interface ModalPasswordFormProps {
  isShow: boolean;
  messageError: {
    new?: string;
    confirm?: string;
  };
  setOpenResetPassword: (isShow: boolean) => void;
  setMessageError: any;
  onSave: (data: {
    new: InfoPasswordFormProps;
    confirm: InfoPasswordFormProps;
  }) => void;
  dynamicLabels?: IDynamicLabel;
}

const initInfoPassword = {
  oldPassword: { text: '', isShow: true },
  new: { text: '', isShow: true },
  confirm: { text: '', isShow: true },
};

const ModalPasswordForm: FC<ModalPasswordFormProps> = ({
  isShow,
  messageError,
  setOpenResetPassword,
  onSave,
  setMessageError,
  dynamicLabels,
}) => {
  // const { userInfo } = useSelector((state) => state.authenticate);
  // console.log('userInfo', userInfo);
  const [infoPasswordForm, setInfoPasswordForm] = useState<{
    oldPassword?: InfoPasswordFormProps;
    new: InfoPasswordFormProps;
    confirm: InfoPasswordFormProps;
  }>(initInfoPassword);
  const [isTouched, setIsTouched] = useState(false);

  const validateOldPassword = useMemo(() => {
    const disableButtons = [false, false, false, false];

    if (
      infoPasswordForm?.oldPassword?.text?.length > 7 &&
      infoPasswordForm?.oldPassword?.text?.length < 21
    ) {
      disableButtons[0] = true;
    }
    if (regxNumber.test(infoPasswordForm?.oldPassword?.text)) {
      disableButtons[1] = true;
    }

    if (regxSpecial.test(infoPasswordForm?.oldPassword?.text)) {
      disableButtons[2] = true;
    }
    if (regxLowerUpper.test(infoPasswordForm?.oldPassword?.text)) {
      disableButtons[3] = true;
    }

    return disableButtons;
  }, [infoPasswordForm?.oldPassword?.text]);

  useEffect(() => {
    setInfoPasswordForm(initInfoPassword);
  }, [isShow]);

  const disableButton = useCallback(() => {
    const disableButtons = [false, false, false, false];

    if (
      infoPasswordForm.new.text.length > 7 &&
      infoPasswordForm.new.text.length < 21
    ) {
      disableButtons[0] = true;
    }
    if (regxNumber.test(infoPasswordForm.new.text)) {
      disableButtons[1] = true;
    }

    if (regxSpecial.test(infoPasswordForm.new.text)) {
      disableButtons[2] = true;
    }
    if (regxLowerUpper.test(infoPasswordForm.new.text)) {
      disableButtons[3] = true;
    }
    return disableButtons;
  }, [infoPasswordForm.new.text]);

  const renderCheckingStatus = useCallback(
    (step) => {
      if (disableButton()[step] && validateOldPassword[step]) {
        return StepItemType.ACTIVE;
      }
      if (isTouched) {
        return StepItemType.ERROR;
      }
      return StepItemType.ACTIVE_DISABLED;
    },
    [disableButton, isTouched, validateOldPassword],
  );

  const handleAutoGenerate = () => {
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

    setInfoPasswordForm((prev) => ({
      ...prev,
      new: {
        text: `${randPassword2}${randPassword1}${randPassword3}${randPassword4}`,
        isShow: infoPasswordForm.new.isShow,
      },
      confirm: {
        text: `${randPassword2}${randPassword1}${randPassword3}${randPassword4}`,
        isShow: infoPasswordForm.confirm.isShow,
      },
    }));
  };

  const handleValidation = useCallback(() => {
    if (infoPasswordForm?.oldPassword?.text === infoPasswordForm?.new?.text) {
      setMessageError((prev) => ({
        ...prev,
        new: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
            'Your password you entered is the same with your current password. Please re-enter the different password'
          ],
        ),
      }));
      return;
    }
    onSave(infoPasswordForm);
  }, [dynamicLabels, infoPasswordForm, onSave, setMessageError]);

  const renderCopyPassword = () => (
    <>
      <div>
        <span>
          {renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['New password'],
          )}
        </span>
      </div>
      <button
        className={styles.btnCopy}
        onClick={() => {
          if (infoPasswordForm?.new?.text?.length > 0) {
            navigator.clipboard.writeText(infoPasswordForm?.new?.text);
            toastSuccess(
              renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Copy password success'],
              ),
            );
          }
        }}
      >
        <img src={images.icons.icCopy} alt="hidePassword" />
      </button>
    </>
  );

  const renderResetPasswordForm = () => (
    <>
      <div className={styles.inputPassword}>
        <Input
          label={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Current password'],
          )}
          title={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.pass,
          )}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter current password'],
          )}
          onChange={(e) => {
            e.preventDefault();
            setInfoPasswordForm((pre) => ({
              ...pre,
              oldPassword: { ...pre.oldPassword, text: e.target.value },
            }));
            setMessageError((prev) => ({ ...prev, new: '' }));
          }}
          maxLength={128}
          value={infoPasswordForm?.oldPassword?.text}
          type={infoPasswordForm?.oldPassword?.isShow ? 'password' : 'text'}
          renderSuffix={
            <button
              onClick={(e) => {
                e.preventDefault();
                setInfoPasswordForm((pre) => ({
                  ...pre,
                  oldPassword: {
                    ...pre.oldPassword,
                    isShow: !pre.oldPassword.isShow,
                  },
                }));
              }}
              className={styles.btnPassword}
            >
              <img
                src={
                  infoPasswordForm?.oldPassword?.isShow
                    ? images.icons.hidePassword
                    : images.icons.unHidePassword
                }
                alt="hidePassword"
                className={styles.icPassword}
              />
            </button>
          }
        />
      </div>
      <div className={styles.inputPassword}>
        <div className="d-flex justify-content-between align-items-center pb-2">
          {renderCopyPassword()}
        </div>
        <Input
          title={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.pass,
          )}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter your password'],
          )}
          messageRequired={messageError?.new || ''}
          onChange={(e) => {
            e.preventDefault();
            setInfoPasswordForm((pre) => ({
              ...pre,
              new: { ...pre.new, text: e.target.value },
            }));
            setMessageError((prev) => ({ ...prev, new: '', confirm: '' }));
            setIsTouched(true);
          }}
          maxLength={128}
          value={infoPasswordForm.new.text}
          type={infoPasswordForm.new.isShow ? 'password' : 'text'}
          autoComplete="new-password"
          renderSuffix={
            <button
              onClick={(e) => {
                e.preventDefault();
                setInfoPasswordForm((pre) => ({
                  ...pre,
                  new: {
                    ...pre.new,
                    isShow: !pre.new.isShow,
                  },
                }));
              }}
              className={styles.btnPassword}
            >
              <img
                src={
                  infoPasswordForm.new.isShow
                    ? images.icons.hidePassword
                    : images.icons.unHidePassword
                }
                alt="hidePassword"
                className={styles.icPassword}
              />
            </button>
          }
        />
      </div>
      <div className={styles.inputPassword}>
        <Input
          label={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Confirm password'],
          )}
          title={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.pass,
          )}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter confirm password'],
          )}
          messageRequired={messageError?.confirm || ''}
          onChange={(e) => {
            e.preventDefault();
            setInfoPasswordForm((pre) => ({
              ...pre,
              confirm: { ...pre.confirm, text: e.target.value },
            }));
            setMessageError((prev) => ({ ...prev, confirm: '' }));
            setIsTouched(true);
          }}
          maxLength={128}
          value={infoPasswordForm.confirm.text}
          type={infoPasswordForm.confirm.isShow ? 'password' : 'text'}
          renderSuffix={
            <button
              onClick={(e) => {
                e.preventDefault();
                setInfoPasswordForm((pre) => ({
                  ...pre,
                  confirm: {
                    ...pre.confirm,
                    isShow: !pre.confirm.isShow,
                  },
                }));
              }}
              className={styles.btnPassword}
            >
              <img
                src={
                  infoPasswordForm.confirm.isShow
                    ? images.icons.hidePassword
                    : images.icons.unHidePassword
                }
                alt="hidePassword"
                className={styles.icPassword}
              />
            </button>
          }
        />
      </div>
      <Row>
        <Col />
        <Col>
          <Button
            className={styles.buttonResetPasswordForm}
            onClick={handleAutoGenerate}
          >
            {renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Auto generate'],
            )}
          </Button>
        </Col>{' '}
      </Row>

      <div className={styles.conditionPassword}>
        <div className={styles.subTitle}>
          <span>
            {renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Password must contain'],
            )}
          </span>
        </div>
        <StepItem
          className={styles.step__item__reset__password}
          status={renderCheckingStatus(0)}
          label={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Minimum 8-20 characters'],
          )}
        />
        <StepItem
          className={styles.step__item__reset__password}
          status={renderCheckingStatus(1)}
          label={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['At least 1 number'],
          )}
        />
        <StepItem
          className={styles.step__item__reset__password}
          status={renderCheckingStatus(2)}
          label={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
              'At least 1 special character'
            ],
          )}
        />
        <StepItem
          className={styles.step__item__reset__password}
          status={renderCheckingStatus(3)}
          label={renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
              'At least 1 lower case and upper case letter'
            ],
          )}
        />
      </div>
    </>
  );

  const renderFooterForm = () => (
    <div className="d-flex justify-content-between">
      <Button
        className={styles.buttonResetPasswordForm}
        buttonType={ButtonType.PrimaryLight}
        onClick={() => {
          setOpenResetPassword(false);
        }}
      >
        {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
      </Button>

      <Button
        disabledCss={
          !(
            disableButton()[0] &&
            disableButton()[1] &&
            disableButton()[2] &&
            disableButton()[3] &&
            infoPasswordForm.confirm.text
          ) ||
          !(
            validateOldPassword[0] &&
            validateOldPassword[1] &&
            validateOldPassword[2] &&
            validateOldPassword[3]
          )
        }
        disabled={
          !(
            disableButton()[0] &&
            disableButton()[1] &&
            disableButton()[2] &&
            disableButton()[3] &&
            infoPasswordForm.confirm.text
          ) ||
          !(
            validateOldPassword[0] &&
            validateOldPassword[1] &&
            validateOldPassword[2] &&
            validateOldPassword[3]
          )
        }
        className={styles.buttonResetPasswordForm}
        onClick={handleValidation}
      >
        {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
      </Button>
    </div>
  );

  return (
    <Modal
      w="400px"
      isOpen={isShow}
      title={renderDynamicLabel(
        dynamicLabels,
        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Reset password'],
      )}
      content={renderResetPasswordForm()}
      footer={renderFooterForm()}
      toggle={() => {
        setInfoPasswordForm(initInfoPassword);
        setOpenResetPassword(!isShow);
        setIsTouched(false);
      }}
    />
  );
};

export default ModalPasswordForm;
