import { yupResolver } from '@hookform/resolvers/yup';
import logo from 'assets/images/logo.svg';
import { useLocation } from 'react-router-dom';
import cx from 'classnames';
import Button, { ButtonSize } from 'components/ui/button/Button';
import InputSign from 'components/ui/inputSign/input';
import StepItem, { StepItemType } from 'components/ui/step-item/StepItem';
import { I18nNamespace } from 'constants/i18n.const';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Row } from 'reactstrap';
import { resetPassword } from 'store/authenticate/authenticate.action';
import * as yup from 'yup';
import styles from '../authentication.module.scss';

interface FormValue {
  newPassword: string;
  password: string;
}

function delete_cookie(name) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { t } = useTranslation(I18nNamespace.COMMON);
  const [newPassword, setNewPassword] = useState('');
  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .trim()
      .matches(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'),
      ),
    password: yup
      .string()
      .trim()
      .required(t('resetPassword.confirmPasswordIsRequired'))
      .test(
        'passwords-match',
        t('resetPassword.notMach'),
        (value) => newPassword === value,
      ),
  });

  useEffect(() => {
    delete_cookie('username');
    delete_cookie('password');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const disableButton = useMemo(() => {
    const disableButtons = [false, false, false, false];

    if (newPassword?.length > 7 && newPassword?.length < 21) {
      disableButtons[0] = true;
    }
    if (/[0-9]/.test(newPassword)) {
      disableButtons[1] = true;
    }

    if (/[!@#$%^&*]/.test(newPassword)) {
      disableButtons[2] = true;
    }
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)) {
      disableButtons[3] = true;
    }
    return disableButtons;
  }, [newPassword]);

  const submitForm = (data) => {
    const resetToken: string[] = search.split('=') || [];
    dispatch(
      resetPassword.request({
        newPassword,
        confirmPassword: data.password,
        requestToken: resetToken[1] || '',
      }),
    );
  };

  return (
    <div className={styles.resetPassword}>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <div className={cx('d-flex', styles.form_input)}>
          <img src={logo} alt="logo" />
          <p className={styles.title}>{t('resetPassword.title')}</p>

          <InputSign
            title={t('resetPassword.newPassword')}
            placeholder={t('signIn.enter_your_password')}
            name="newPassword"
            type="password"
            required
            regis={register}
            onChange={(e) => setNewPassword(e.target.value)}
            isPassword
            maxLength={128}
          />
          <InputSign
            title={t('signIn.title_confirm_password')}
            placeholder={t('signIn.enter_your_password')}
            name="password"
            error={errors.password?.message}
            type="password"
            required
            regis={register}
            isPassword
            maxLength={128}
          />
          <Row md="12" className={styles.rowSubOption}>
            <p className={styles.labelPasswordRequired}>
              {t('resetPassword.passwordMustContain')}
            </p>
            <StepItem
              status={
                disableButton[0]
                  ? StepItemType.ACTIVE
                  : StepItemType.ACTIVE_DISABLED
              }
              label={t('resetPassword.passwordRequired1')}
            />
            <StepItem
              status={
                disableButton[1]
                  ? StepItemType.ACTIVE
                  : StepItemType.ACTIVE_DISABLED
              }
              label={t('resetPassword.passwordRequired2')}
            />
            <StepItem
              status={
                disableButton[2]
                  ? StepItemType.ACTIVE
                  : StepItemType.ACTIVE_DISABLED
              }
              label={t('resetPassword.passwordRequired3')}
            />
            <StepItem
              status={
                disableButton[3]
                  ? StepItemType.ACTIVE
                  : StepItemType.ACTIVE_DISABLED
              }
              label={t('resetPassword.passwordRequired4')}
            />
          </Row>

          <Button
            className={cx(styles.button, styles.button__reset_password)}
            size={ButtonSize.Large}
            type="submit"
            disabled={
              disableButton[0] === false ||
              disableButton[1] === false ||
              disableButton[2] === false ||
              disableButton[3] === false ||
              false
            }
          >
            {t('resetPassword.title')}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ResetPassword;
