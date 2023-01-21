import { FC, memo } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import NumberIncidents from 'pages/incidents/summary/number-incidents';
import ReviewStatus from 'pages/incidents/summary/review-status';
import cx from 'classnames';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import styles from './incidents-overview.module.scss';
import { IncidentsChartType } from './incidents-overview.const';
import IncidentCasesPerPort from '../incident-cases-per-port/IncidentCasesPerport';

const IncidentsOverview: FC = () => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });
  return (
    <div className={styles.incidentsOverviewContainer}>
      <strong className={styles.title}>
        {renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Incidents overview'],
        )}
      </strong>
      <Row gutter={[16, 0]} className="mb-2">
        <Col span={16} className="d-flex flex-column">
          <div
            className={cx(
              styles.contentContainer,
              styles.contentContainerIncident,
            )}
          >
            <NumberIncidents
              barColor="#3B9FF3"
              barThickness={20}
              barHeight={373}
              key="incidents of number incidents"
            />
          </div>
        </Col>
        <Col span={8} className="d-flex flex-column">
          <div
            className={cx(
              styles.contentContainer,
              styles.paddingNone,
              styles.contentContainerIncident,
            )}
          >
            <ReviewStatus
              dropdown
              isVertical
              height={170}
              width={170}
              // legendTop={16}
              title={renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Incident review status'],
              )}
              fullHeight
              containerClassName={styles.fullHeight}
              key="incidents of review status"
              dynamicLabels={dynamicLabels}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 0]}>
        <Col span={8}>
          <div className={styles.contentContainerIncidentPieChart}>
            <ReviewStatus
              dropdown
              isVertical
              fullHeight
              height="100%"
              title={renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Number of incidents per port'],
              )}
              containerClassName={styles.fullHeight}
              key="numberOfIncidentsPerPort"
              type={IncidentsChartType.NUMBER_OF_INCIDENTS_PER_PORT}
              scrollableClass={styles.maxHeight170}
              customClassTitle={styles.customClassTitle}
              dynamicLabels={dynamicLabels}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.contentContainerIncidentPieChart}>
            <ReviewStatus
              dropdown
              isVertical
              fullHeight
              height="100%"
              title={renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Incident basis potential risk'],
              )}
              containerClassName={styles.fullHeight}
              key="incidentBasisPotentialRisk"
              type={IncidentsChartType.INCIDENT_BASIC_POTENTIAL_RISK}
              scrollableClass={styles.maxHeight170}
              customClassTitle={styles.customClassTitle}
              dynamicLabels={dynamicLabels}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.contentContainerIncidentPieChart}>
            <ReviewStatus
              dropdown
              isVertical
              fullHeight
              height="100%"
              title={renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS['Types of incidents'],
              )}
              containerClassName={styles.fullHeight}
              key="typesOfIncidents"
              type={IncidentsChartType.TYPE_OF_INCIDENTS}
              scrollableClass={styles.maxHeight170}
              customClassTitle={styles.customClassTitle}
              dynamicLabels={dynamicLabels}
            />
          </div>
        </Col>
      </Row>
      <IncidentCasesPerPort />
    </div>
  );
};

export default memo(IncidentsOverview);
