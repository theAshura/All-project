import styles from './not-found.module.scss';

const NotFound = () => (
  <div className={styles.container}>
    <div className={styles.content}>404</div>
    <div className={styles.message}>
      Sorry, the page you visited does not exist.
    </div>
  </div>
);

export default NotFound;
