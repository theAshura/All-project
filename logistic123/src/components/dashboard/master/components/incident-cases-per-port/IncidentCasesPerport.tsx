import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import cx from 'classnames';
import IncidentCasesLineChart from './incident-cases-line-chart/IncidentCasesLineChart';
import IncidentCasesBarChart from './incident-cases-bar-chart/IncidentCasesBarChart';
import styles from './IncidentCasesPerport.module.scss';

const IncidentCasesPerPort = () => (
  <Row className="mt-3">
    <Col xs={12}>
      <div
        className={cx(styles.incidentOverviewChart, styles.customMarginLeft)}
      >
        <IncidentCasesLineChart />
      </div>
    </Col>
    <Col xs={12}>
      <div className={styles.incidentOverviewChart}>
        <IncidentCasesBarChart />
      </div>
    </Col>
  </Row>
);
export default IncidentCasesPerPort;
