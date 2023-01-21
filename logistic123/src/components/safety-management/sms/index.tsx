import Container from 'components/common/container/ContainerPage';

import styles from './sms.module.scss';
import ListSmsContainer from './TableSms';

const MaintenanceSmslList = () => (
  <Container className={styles.wrapperContainer}>
    <ListSmsContainer />
  </Container>
);
export default MaintenanceSmslList;
