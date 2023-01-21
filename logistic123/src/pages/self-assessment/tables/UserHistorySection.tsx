import cx from 'classnames';
import { FC, useMemo } from 'react';
import Table, { ColumnsType } from 'antd/lib/table';
import images from 'assets/images/images';
import { statusColor } from 'components/common/table/row/rowCp';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import lowerCase from 'lodash/lowerCase';
import capitalize from 'lodash/capitalize';
import upperFirst from 'lodash/upperFirst';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import styles from './table-history.module.scss';
import { UserHistory } from '../utils/model';
import { sortByDateOldToNew } from '../utils/functions';

export interface TableProps {
  data: UserHistory[];
  loading?: boolean;
}

const TableUserHistorySection: FC<TableProps> = ({ data, loading = false }) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);

  const columns: ColumnsType = [
    {
      title: t('historySection.sNo'),
      dataIndex: 'sNo',
      key: 'sNo',
      width: 100,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('historySection.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (text) => (
        <span
          className={cx(styles.textContent, {
            [styles.blue_3]: statusColor.blue_3.includes(lowerCase(text)),
            [styles.red_3]: statusColor.red_3.includes(lowerCase(text)),
            [styles.orange_3]: statusColor.orange_3.includes(lowerCase(text)),
            [styles.red_6]: statusColor.red_6.includes(lowerCase(text)),
            [styles.green_1]: statusColor.green_1.includes(lowerCase(text)),
            [styles.green_2]: statusColor.green_2.includes(lowerCase(text)),
            [styles.yellow_2]: statusColor.yellow_2.includes(lowerCase(text)),
          })}
        >
          {upperFirst(text)}
        </span>
      ),
    },
    {
      title: t('historySection.updatedUser'),
      dataIndex: 'updatedUser',
      key: 'updatedUser',
      width: 140,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('historySection.userEmail'),
      dataIndex: 'userEmail',
      key: 'userEmail',
      width: 140,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('historySection.jobTitle'),
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      width: 140,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('historySection.comment'),
      dataIndex: 'comment',
      key: 'comment',
      width: 160,
      render: (text) => <span className={cx(styles.textContent)}>{text}</span>,
    },
    {
      title: t('historySection.updatedDate'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
  ].filter((item) => !!item);

  const populateStatus = (status: string) =>
    capitalize(status?.replaceAll('_', ' '));

  const dataSource = useMemo(
    () =>
      sortByDateOldToNew(data).map((item, index) => ({
        sNo: index + 1,
        status: populateStatus(item?.status) || DATA_SPACE,
        updatedUser: item?.createdUser?.username || DATA_SPACE,
        updatedAt: formatDateLocalWithTime(item?.createdAt),
        jobTitle: item.createdUser.jobTitle || DATA_SPACE,
        comment: item?.comment || DATA_SPACE,
        userEmail: item?.createdUser?.email || DATA_SPACE,
      })),
    [data],
  );

  return (
    <div>
      {dataSource?.length || loading ? (
        <Table
          columns={columns}
          className={cx(styles.tableWrapper)}
          dataSource={dataSource}
          pagination={false}
          rowClassName={styles.rowWrapper}
          scroll={{ x: 'max-content' }}
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

export default TableUserHistorySection;
