import Table, { ColumnsType } from 'antd/lib/table';
import images from 'assets/images/images';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { formatDateNoTime } from 'helpers/date.helper';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './detail-information.module.scss';

interface Props {
  className?: string;
}
const SCREEN_TYPE = {
  classDispensations: 'Condition of Class/Dispensations',
  survey: 'Survey/Class Info',
  maintenance: 'Maintenance Performance',
  technical: 'Other Technical Record',
  dryDocking: 'Dry Docking',
  incident: 'Incident',
  injuries: 'Injuries',
  sms: 'Other SMS Records',
  plansDrawing: 'Plans And Drawing',
  externalInspection: 'External Inspections (Except PSC/SIRE/CDI)',
  internalInspection: 'Internal Inspections / Audit',
  psc: 'Port State Control',
};

export const LatestRecordsUpdate: FC<Props> = ({ className }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { latestRecordsUpdate } = useSelector(
    (state) => state.sailReportingSummary,
  );
  const columnsModal: ColumnsType = [
    {
      title: t('summary.recentScreen'),
      dataIndex: 'recentScreen',
      key: 'recentScreen',
      width: 300,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('summary.date'),
      width: 150,
      key: 'date',
      dataIndex: 'date',
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
  ];

  const dataSource = useMemo(
    () =>
      latestRecordsUpdate
        ? Object.entries(latestRecordsUpdate)?.map(([key, value]) => ({
            recentScreen: SCREEN_TYPE[key],
            date: formatDateNoTime(value),
          }))
        : [],
    [latestRecordsUpdate],
  );

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.title}>{t('summary.latestRecordsUpdate')}</div>
      {dataSource?.length ? (
        <Table
          columns={columnsModal}
          className={cx(styles.tableWrapper)}
          dataSource={dataSource}
          scroll={{ x: 400, y: 190 }}
          pagination={false}
          rowClassName={styles.rowWrapper}
          locale={{ emptyText: 'No data' }}
        />
      ) : (
        <div className={cx(styles.dataWrapperEmpty)}>
          <img
            src={images.icons.icNoData}
            className={styles.noData}
            alt="no data"
          />
        </div>
      )}
    </div>
  );
};
