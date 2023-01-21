import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import MaintenancePerformance from './maintenance-performance';

import OtherRecord from './other-record';

import styles from './maintenance-technical.module.scss';

const MaintenanceTechnicalContainer = () => (
  <Container className={cx(styles.wrapperContainer, 'pt-2')}>
    <MaintenancePerformance />
    <div className="pt-3" />
    <OtherRecord />
  </Container>
);
export default MaintenanceTechnicalContainer;
