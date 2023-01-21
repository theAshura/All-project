import cx from 'classnames';
import { FC, useMemo } from 'react';
import Table, { ColumnsType } from 'antd/lib/table';

import images from 'assets/images/images';
import { formatDateTime } from 'helpers/utils.helper';

import { statusColor } from 'components/common/table/row/rowCp';
import { useTranslation } from 'react-i18next';
import { StatusHistory } from 'models/api/audit-checklist/audit-checklist.model';
import { I18nNamespace } from 'constants/i18n.const';
import lowerCase from 'lodash/lowerCase';
import capitalize from 'lodash/capitalize';
import upperFirst from 'lodash/upperFirst';

import styles from './table-history.module.scss';

export interface TableProps {
  data: StatusHistory[];
  hideActionCol?: boolean;
}

const TableHistorySection: FC<TableProps> = ({ data, hideActionCol }) => {
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
    !hideActionCol && {
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

  const populateStatus = (status: string) => {
    if (String(status)?.toLocaleLowerCase() === 'rejected') {
      return 'Reassigned';
    }
    return capitalize(status?.replaceAll('_', ' '));
  };

  const dataSource = useMemo(
    () =>
      data?.map((item, index) => ({
        sNo: index + 1,
        status: populateStatus(item?.status),
        updatedUser: item?.createdUser?.username,
        updatedAt: formatDateTime(item?.updatedAt),
        jobTitle: item.createdUser.jobTitle, // fix after
        comment: item?.remark,
      })),
    [data],
  );

  return (
    <div className="">
      <div className={cx(styles.header, 'pt-2 pb-3')}>User history section</div>
      {dataSource?.length ? (
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

export default TableHistorySection;
