import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize } from 'components/ui/button/Button';
import InputSign from 'components/ui/inputSign/input';
import { INAUTIX_BASE, LINK_CONTACT } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Label, Row } from 'reactstrap';
import { login, logOutActions } from 'store/authenticate/authenticate.action';
import * as yup from 'yup';
// import { CONFIG } from 'config';
import styles from '../authentication.module.scss';

interface FormValue {
  email: string;
  password: string;
}
const setCookie = (cname, cvalue) => {
  document.cookie = `${cname} = ${cvalue}; Path=/; `;
};
const getCookie = (cname) => {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }

  return '';
};

function delete_cookie(name) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

const SignIn = () => {
  const dispatch = useDispatch();
  const username = getCookie('username');
  const pass = getCookie('password');
  const { loading, messageObject } = useSelector((state) => state.authenticate);
  const [rememberMe, setRememberMe] = useState(Boolean);
  const { t } = useTranslation(I18nNamespace.COMMON);

  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .default(username)
      .max(128)
      .email(t('signIn.email_must_have'))
      .required(t('signIn.please_fill_your_email')),
    password: yup
      .string()
      .default(pass)
      .max(128)
      .required(t('signIn.please_fill_your_password')),
  });
  const defaultValue = schema.pick(['email', 'password']).getDefault();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(schema, { abortEarly: false }),
  });

  const submitForm = (data) => {
    dispatch(
      login.request({
        email: data.email,
        password: data.password,
      }),
    );
    if (rememberMe) {
      setCookie('username', data.email);
      setCookie('password', data.password);
    } else {
      delete_cookie('username');
      delete_cookie('password');
    }
  };

  useEffect(() => {
    if (defaultValue?.email) {
      setRememberMe(true);
    }
  }, [defaultValue?.email]);

  useEffect(() => {
    dispatch(logOutActions.request());
  }, [dispatch]);

  // const linkRequestTrial = () => {
  // switch (CONFIG.BASE_URL) {
  //   case 'https://api.dev.i-nautix.com':
  //     return 'https://dev.i-nautix.com/request-trial.html';
  //   case 'https://api.staging.i-nautix.com':
  //     return 'https://staging.i-nautix.com/request-trial.html';
  //   case 'https://api.uat.i-nautix.com':
  //     return 'https://uat.i-nautix.com/request-trial.html';
  //   default:
  //     return 'https://staging.i-nautix.com/request-trial.html';
  // }
  // };

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <div className={cx('d-flex', styles.form_input)}>
          <a href={INAUTIX_BASE} target="_blank" rel="noreferrer">
            <img src={images.logo.logo} alt="logo" className="styles" />
          </a>
          <p className={styles.title}>{t('signIn.title_sign_in')}</p>
          <p className={styles.subTitle}>{t('signIn.title_welcome')}</p>

          <InputSign
            title={t('signIn.title_input_mail')}
            placeholder={t('signIn.enter_your_email')}
            defaultValue={defaultValue.email}
            name="email"
            type="email"
            required
            error={
              messageObject && messageObject[0]?.field === 'email'
                ? messageObject[0].message[0]
                : errors.email?.message
            }
            regis={register}
            maxLength={128}
          />
          <InputSign
            title={t('signIn.title_password')}
            placeholder={t('signIn.enter_your_password')}
            name="password"
            error={
              messageObject && messageObject[0]?.field === 'password'
                ? messageObject[0]?.message[0]
                : errors.password?.message
            }
            defaultValue={defaultValue.password}
            type="password"
            required
            regis={register}
            isPassword
            maxLength={128}
          />

          <Row md="12" className={styles.rowSubOption}>
            <Col className={styles.colSubOption}>
              <div className={styles.textCheckbox}>
                <Label check className={styles.labelCheckbox}>
                  <Input
                    type="checkbox"
                    name="checkbox"
                    // {...register}
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className={styles.checkBox}
                  />
                  &nbsp; {` ${t('signIn.remember_me')}`}
                </Label>
              </div>
            </Col>
            <Col className={styles.colSubOption}>
              <a href="/recover-password" className={styles.optionPassword}>
                {t('signIn.forgot_password')}
              </a>
            </Col>
          </Row>

          <Button
            className={styles.button}
            size={ButtonSize.Large}
            type="submit"
            disabled={loading}
          >
            {t('signIn.sign_in')}
          </Button>
          <div className={styles.subButton}>
            <span> {t('signIn.create_account')}</span>
            <a
              href={LINK_CONTACT}
              className={styles.optionRequestTrial}
              target="_blank"
              rel="noreferrer"
            >{` ${t('signIn.click_here')}`}</a>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SignIn;
