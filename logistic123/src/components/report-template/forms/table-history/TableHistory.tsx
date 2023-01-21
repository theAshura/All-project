import { FC, useCallback, useMemo } from 'react';
import cx from 'classnames';

import Table, { ColumnsType } from 'antd/lib/table';
import { formatDateTime } from 'helpers/utils.helper';
import { useTranslation } from 'react-i18next';
import { IStepHistory } from 'models/common.model';
import { ReportFindingHistory } from 'models/api/report-of-finding/report-of-finding.model';
import { StatusHistory } from 'models/api/audit-checklist/audit-checklist.model';
import { I18nNamespace } from 'constants/i18n.const';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';
import capitalize from 'lodash/capitalize';

import { statusColor } from 'components/common/table/row/rowCp';
import NoDataImg from 'components/common/no-data/NoData';

import styles from './table-history.module.scss';

export interface TableProps {
  data: StatusHistory[] | IStepHistory[] | ReportFindingHistory[];
  loading?: boolean;
  hideStatus?: boolean;
  showAction?: boolean;
  hideComment?: boolean;
}

const TableHistory: FC<TableProps> = ({
  data,
  showAction,
  hideStatus,
  hideComment,
  loading,
}) => {
  const { t } = useTranslation(I18nNamespace.AUDIT_CHECKLIST);

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
    !hideStatus && {
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
      width: 180,
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

    !hideComment && {
      title: t('historySection.comment'),
      dataIndex: 'comment',
      key: 'comment',
      width: 160,
      render: (text) => <span className={cx(styles.textContent)}>{text}</span>,
    },
    showAction && {
      title: t('historySection.action'),
      dataIndex: 'action',
      key: 'action',
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

  const handleSortByDate = useCallback((data) => {
    if (data?.length > 0) {
      return data.sort((a, b) => {
        if (String(a?.updatedAt) < String(b?.updatedAt)) {
          return -1;
        }
        if (String(a?.updatedAt) > String(b?.updatedAt)) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
    }
    return [];
  }, []);

  const populateStatus = (status: string) => {
    if (String(status)?.toLocaleLowerCase() === 'rejected') {
      return 'Reassigned';
    }
    if (String(status)?.toLocaleLowerCase() === 'auditor_accepted') {
      return 'Accepted';
    }
    if (
      String(status).toLocaleLowerCase() === 'planned_successfully' ||
      String(status).toLocaleLowerCase() === 'planned successfully'
    ) {
      return 'Planned';
    }
    return capitalize(status?.replaceAll('_', ' '));
  };
  const dataSource = useMemo(
    () =>
      handleSortByDate(data)?.map((item, index) => ({
        sNo: index + 1,
        status: populateStatus(item.status),
        updatedUser: item?.createdUser?.username,
        updatedAt: formatDateTime(item?.updatedAt),
        jobTitle: item?.createdUser?.jobTitle || '-',
        comment: item?.remark || item?.workflowRemark || '',
        action: capitalize(item?.status?.replaceAll('_', ' ')),
        key: item?.id,
      })),
    [data, handleSortByDate],
  );

  return (
    <div className="">
      <div className={cx(styles.header)}>User history section</div>
      {dataSource?.length ? (
        <Table
          columns={columns}
          className={cx(styles.tableWrapper)}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 'max-content' }}
          rowClassName={styles.rowWrapper}
        />
      ) : (
        <NoDataImg />
      )}
    </div>
  );
};

export default TableHistory;
