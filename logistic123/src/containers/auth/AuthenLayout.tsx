import images from 'assets/images/images';
import cx from 'classnames';
import { SOLVER_LINK } from 'constants/common.const';
import { FC, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { checkTokenResetPassword } from 'store/authenticate/authenticate.action';
import styles from './authentication.module.scss';

const AuthenLayout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const check_token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    if (check_token) {
      dispatch(
        checkTokenResetPassword.request({
          token: check_token,
        }),
      );
    }
  }, [check_token, dispatch]);

  const loadingToken = useSelector((state) => state.authenticate.loadingToken);
  return (
    <div className={styles.wrapper}>
      {loadingToken && (
        <img
          src={images.common.loading}
          alt="loading"
          className={styles.loading}
        />
      )}
      <div className={cx('d-block', styles.login_form)}>
        <Row className={styles.rowWrapper}>
          <Col md={6} xs={6} sm={6}>
            <Suspense fallback={<div />}>{children}</Suspense>
          </Col>
          <Col md={6} xs={6} sm={6} className={styles.miniBackground} />
        </Row>
      </div>

      <div className={styles.logoContainer}>
        <a href={SOLVER_LINK} target="_blank" rel="noreferrer">
          <img src={images.logo.logoFooterFull} alt="Logo" key="Form Logo" />
        </a>
      </div>
    </div>
  );
};

export default AuthenLayout;
