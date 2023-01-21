import { yupResolver } from '@hookform/resolvers/yup';
import logo from 'assets/images/logo.svg';
import { useLocation } from 'react-router-dom';
import cx from 'classnames';
import moment from 'moment';
import queryString from 'query-string';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import InputSign from 'components/ui/inputSign/input';
import StepItem, { StepItemType } from 'components/ui/step-item/StepItem';
import { redirectByRolePermissions } from 'helpers/permissionCheck.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { logOutActions } from 'store/authenticate/authenticate.action';
import * as yup from 'yup';
import styles from '../authentication.module.scss';
import { resetPasswordRoutineApi } from '../../../api/authentication.api';

interface FormValue {
  newPassword: string;
  password: string;
}

const ChangePasswordRoutine = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { t } = useTranslation(I18nNamespace.COMMON);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [dayLeft, setDayLeft] = useState(0);
  const { userInfo } = useSelector((state) => state.authenticate);

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .trim()
      .matches(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'),
      ),
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
    const params = queryString.parse(search);
    if (
      params?.changePassDate &&
      moment(params?.changePassDate)?.diff(moment(), 'seconds') > 0
    ) {
      setDayLeft(moment(params?.changePassDate)?.diff(moment(), 'days') || 1);
    }
  }, [search]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const disableButton = useMemo(() => {
    const disableButtons = [false, false, false, false];
    if (
      newPassword?.length > 7 &&
      newPassword?.length < 21 &&
      currentPassword?.length > 7 &&
      currentPassword?.length < 21
    ) {
      disableButtons[0] = true;
    }
    if (/[0-9]/.test(newPassword) && /[0-9]/.test(currentPassword)) {
      disableButtons[1] = true;
    }

    if (/[!@#$%^&*]/.test(newPassword) && /[!@#$%^&*]/.test(currentPassword)) {
      disableButtons[2] = true;
    }
    if (
      /(?=.*[a-z])(?=.*[A-Z])/.test(newPassword) &&
      /(?=.*[a-z])(?=.*[A-Z])/.test(currentPassword)
    ) {
      disableButtons[3] = true;
    }
    return disableButtons;
  }, [currentPassword, newPassword]);

  const logout = useCallback(() => {
    dispatch(logOutActions.request());
  }, [dispatch]);

  const submitForm = useCallback(
    (data) => {
      if (currentPassword === newPassword) {
        return;
      }
      const params = queryString.parse(search);

      const bodyParams = {
        oldPassword: currentPassword,
        newPassword,
        confirmPassword: data?.password,
        email: userInfo?.email || String(params?.email),
      };
      resetPasswordRoutineApi(bodyParams)
        .then((res) => {
          toastSuccess('Change password successfully.');
          logout();
        })
        .catch((err) => toastError(err));
    },
    [currentPassword, logout, newPassword, search, userInfo?.email],
  );

  return (
    <div className={styles.resetPassword}>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <div className={cx('d-flex', styles.form_input)}>
          <img src={logo} alt="logo" />
          <p className={styles.title}>Change password</p>
          <div className={styles.warning}>
            {dayLeft > 0
              ? `Password will expire in ${dayLeft} days. Please change your password`
              : 'Password expired. Please change your password'}
          </div>
          <InputSign
            title={t('resetPassword.currentPassword')}
            placeholder={t('signIn.enter_your_current_password')}
            name="currentPassword"
            type="password"
            required
            regis={register}
            onChange={(e) => setCurrentPassword(e.target.value)}
            isPassword
            maxLength={128}
            wrapClass={styles.wrapInput}
          />

          <InputSign
            title={t('resetPassword.newPassword')}
            placeholder={t('signIn.enter_your_password')}
            name="newPassword"
            type="password"
            required
            regis={register}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('password', null);
            }}
            isPassword
            maxLength={128}
            error={
              currentPassword && newPassword && currentPassword === newPassword
                ? t('resetPassword.match')
                : null
            }
            wrapClass={styles.wrapInput}
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
            wrapClass={styles.wrapInput}
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
              disableButton[3] === false
            }
          >
            {t('resetPassword.title')}
          </Button>
          {dayLeft > 0 && userInfo?.rolePermissions?.length && (
            <div
              onClick={() =>
                redirectByRolePermissions(userInfo?.rolePermissions)
              }
              className={styles.skipChangePass}
            >
              Skip this and change later
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
export default ChangePasswordRoutine;
