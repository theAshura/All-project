import { yupResolver } from '@hookform/resolvers/yup';
import logo from 'assets/images/logo.svg';
import cx from 'classnames';
import Button, { ButtonSize } from 'components/ui/button/Button';
import InputSign, { MessageType } from 'components/ui/inputSign/input';
import { I18nNamespace } from 'constants/i18n.const';
import { AuthRouteConst } from 'constants/route.const';
import i18n from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { recoverPassword } from 'store/authenticate/authenticate.action';
import * as yup from 'yup';
import styles from '../authentication.module.scss';

interface FormValue {
  email: string;
  password: string;
}

const RecoverPassword = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.COMMON);

  const message = useSelector((state) => state.authenticate.message);

  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email(`${i18n.t('signIn.email_must_have')}`)
      .required(`${i18n.t('signIn.please_fill_your_email')}`),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const submitForm = (data) => {
    dispatch(
      recoverPassword.request({
        email: data.email,
      }),
    );
  };
  return (
    <div className={styles.wrapperExpired}>
      <div className={cx('d-block', styles.expired_form)}>
        <Row className={styles.rowWrapper}>
          <div>
            <form onSubmit={handleSubmit(submitForm)} noValidate>
              <div className={cx('d-flex', styles.form_input)}>
                <img src={logo} alt="logo" />
                <p className={styles.title}>{t('expiredLink.title')}</p>
                <p className={styles.subTitle}>{t('expiredLink.subTitle')} </p>

                <InputSign
                  title={t('signIn.emailAddrest')}
                  placeholder={t('signIn.enter_your_email')}
                  name="email"
                  type="email"
                  required
                  error={message || errors.email?.message}
                  messageType={message ? MessageType.INFO : MessageType.ERROR}
                  regis={register}
                  maxLength={128}
                />
                <Button
                  className={styles.button}
                  size={ButtonSize.Large}
                  type="submit"
                >
                  {t('expiredLink.buttonResend')}
                </Button>
                <p className={styles.textClick}>
                  <a href={AuthRouteConst.SIGN_IN} className={styles.subText}>
                    {` ${t('expiredLink.buttonCancel')}`}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </Row>
      </div>
    </div>
  );
};
export default RecoverPassword;
