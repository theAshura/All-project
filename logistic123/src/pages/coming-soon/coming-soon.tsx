import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import styles from './coming-soon.module.scss';

const PageComingSoon = () => {
  const { token } = useSelector((state) => state.authenticate);

  if (token?.length === 0) {
    return <Redirect to="/auth/login" />;
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>Coming soon</div>
    </div>
  );
};

export default PageComingSoon;
