import { FC, useCallback } from 'react';
import { DataObj } from 'models/common.model';
import { Table } from 'reactstrap';
import cx from 'classnames';

import styles from './form.module.scss';

export interface TableHistoryRejectProp {
  generalInfoDetail: DataObj;
}

const rowLabels = [
  {
    id: 'S.no',
    label: 'S.No',
    sort: false,
    width: '15%',
  },
  {
    id: 'reviewName ',
    label: 'Review Name ',
    sort: false,
    width: '35%',
  },
  {
    id: 'reviewerComment',
    label: 'Reviewer Comment',
    sort: false,
    width: '50%',
  },
];

const TableHistoryReject: FC<TableHistoryRejectProp> = (
  props: TableHistoryRejectProp,
) => {
  const { generalInfoDetail } = props;

  const renderRow = useCallback(
    () => (
      <tbody>
        {generalInfoDetail?.statusHistory
          ?.filter((i) => i.status === 'Rejected')
          ?.map((item, index) => (
            <tr key={item.id} className={styles.rowTitle}>
              <td>
                <span>{index + 1} </span>
              </td>
              <td>
                <span>{item?.createdUser?.username} </span>
              </td>
              <td>
                <span>{item.remark} </span>
              </td>
            </tr>
          ))}
      </tbody>
    ),
    [generalInfoDetail],
  );

  return (
    <div className={cx('bg-white', styles.wrapTable)}>
      <p className={cx('fw-bold', styles.titleTable)}>
        Additional Reviewer Section
      </p>
      <Table hover className={styles.table}>
        <thead className={styles.thread}>
          <tr className={styles.title}>
            {rowLabels.map((item) => (
              <th
                key={item.id}
                className={cx('fw-bold', styles.subTitle)}
                style={{
                  width: item.width,
                }}
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        {renderRow()}
      </Table>
    </div>
  );
};
export default TableHistoryReject;
