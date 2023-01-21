import Table, { ColumnsType } from 'antd/lib/table';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './detail-information.module.scss';

interface Props {
  data?: any;
  className?: string;
}

export const LatestRecordsUpdate: FC<Props> = ({ data, className }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);

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
      [1, 2, 3, 4, 5, 6]?.map((item, index) => ({
        recentScreen: 'Incident Investigation',
        date: '01/05/2022',
      })),
    [],
  );
  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.title}>{t('summary.latestRecordsUpdate')}</div>
      <Table
        columns={columnsModal}
        className={cx(styles.tableWrapper)}
        dataSource={dataSource}
        scroll={{ x: 500, y: 170 }}
        pagination={false}
        rowClassName={styles.rowWrapper}
        locale={{ emptyText: 'No data' }}
      />
    </div>
  );
};
