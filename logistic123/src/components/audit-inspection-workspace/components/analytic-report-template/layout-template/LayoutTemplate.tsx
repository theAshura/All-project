import cx from 'classnames';
import images from 'assets/images/images';
import { useSelector } from 'react-redux';
import styles from './layout-template.module.scss';

const LayoutTemplate = ({ children }) => {
  const { userInfo } = useSelector((state) => state.authenticate);
  return (
    <div className={styles.wrap}>
      <div className={cx(styles.header, 'd-flex justify-content-between')}>
        <div className={styles.title}>Analytic Report</div>
        <div className="d-flex align-items-center">
          <img src={images.logo.logoHeader} alt="logoHeader" />
          <div className={styles.company}>{userInfo?.mainCompany?.name}</div>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default LayoutTemplate;
