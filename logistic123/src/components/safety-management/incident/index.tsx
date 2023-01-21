import ListIncident from './TableIncident';

import styles from './incident.module.scss';

const IncidentContainer = () => (
  <div className={styles.wrapperContainer}>
    <ListIncident activeTab="safety-management" />
  </div>
);
export default IncidentContainer;
