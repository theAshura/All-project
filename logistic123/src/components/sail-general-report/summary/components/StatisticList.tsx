import { Row, Col } from 'antd/lib/grid';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';
import { OverviewCard } from 'components/common/overview-card/OverviewCard';
import { useSelector } from 'react-redux';
import styles from './statistic-list.module.scss';
import PendingActionChart from '../chart/PendingActionChart';

interface Props {
  className?: string;
}

export const StatisticList: FC<Props> = ({ className }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { generalReportDetail } = useSelector(
    (state) => state.sailReportingSummary,
  );
  return (
    <>
      <Row gutter={[16, 8]} className={cx(styles.container, className)}>
        <Col span={6}>
          <OverviewCard
            title={t('summary.openFindingsInPortStateControl')}
            content={generalReportDetail?.openFindingsPortStateControl}
            color={
              generalReportDetail?.openFindingsPortStateControl === '0'
                ? '#8E8C94'
                : '#3B9FF3'
            }
            hasBorder
          />
        </Col>
        <Col span={6}>
          <OverviewCard
            title={t('summary.openFindingsInExternalInspection')}
            content={generalReportDetail?.openFindingsExternalInspection}
            color={
              generalReportDetail?.openFindingsExternalInspection === '0'
                ? '#8E8C94'
                : '#3B9FF3'
            }
            hasBorder
          />
        </Col>
        <Col span={6}>
          <OverviewCard
            title={t('summary.openInternalInspection')}
            content={generalReportDetail?.openInternalInspection}
            color={
              generalReportDetail?.openInternalInspection === '0'
                ? '#8E8C94'
                : '#3B9FF3'
            }
            hasBorder
          />
        </Col>
        <Col span={6}>
          <OverviewCard
            title={t('summary.overdueConditionOfClasssDispensations')}
            content={generalReportDetail?.overdueClassDispensations}
            color={
              generalReportDetail?.overdueClassDispensations === '0'
                ? '#8E8C94'
                : '#3B9FF3'
            }
            hasBorder
          />
        </Col>
      </Row>
      <Row gutter={[16, 8]} className={styles.container}>
        <Col span={12}>
          <Row gutter={[16, 8]} className={styles.rowItem}>
            <Col span={12}>
              <OverviewCard
                title={t('summary.incidentsWithinTheLast3Months')}
                content={generalReportDetail?.incidentsLast3Months}
                color={
                  generalReportDetail?.incidentsLast3Months === '0'
                    ? '#8E8C94'
                    : '#3B9FF3'
                }
                hasBorder
              />
            </Col>
            <Col span={12}>
              <OverviewCard
                title={t('summary.injuriesWithinTheLast3Months')}
                content={generalReportDetail?.injuriesLast3Months}
                color={
                  generalReportDetail?.injuriesLast3Months === '0'
                    ? '#8E8C94'
                    : '#3B9FF3'
                }
                hasBorder
              />
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <OverviewCard
                title={t('summary.maintenancePerformanceOverdueCriticalJobs')}
                content={generalReportDetail?.overdueCriticalJobs || '0'}
                color={
                  !generalReportDetail?.overdueCriticalJobs ||
                  generalReportDetail?.overdueCriticalJobs === '0'
                    ? '#8E8C94'
                    : '#3B9FF3'
                }
                hasBorder
              />
            </Col>
            <Col span={12}>
              <OverviewCard
                title={t('summary.maintenancePerformanceOverdueJobs')}
                content={generalReportDetail?.overdueJobs || '0'}
                color={
                  !generalReportDetail?.overdueJobs ||
                  generalReportDetail?.overdueJobs === '0'
                    ? '#8E8C94'
                    : '#3B9FF3'
                }
                hasBorder
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <PendingActionChart />
        </Col>
      </Row>
    </>
  );
};
