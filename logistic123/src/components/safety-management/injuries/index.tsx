import Container from 'components/common/container/ContainerPage';

import styles from './injuries.module.scss';
import ListInjuries from './TableInjuries';

const MaintenanceTechnicalContainer = () => (
  <Container className={styles.wrapperContainer}>
    <ListInjuries />
  </Container>
);
export default MaintenanceTechnicalContainer;
