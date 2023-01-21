import Table, { ColumnsType } from 'antd/lib/table';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { InspectionFollowUp } from 'models/api/inspection-follow-up/inspection-follow-up.model';
import { FC, useMemo } from 'react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-follow-up.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './table-summary.module.scss';

export interface TableProps {
  inspectionFollowDetail?: InspectionFollowUp;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const TableSummary: FC<TableProps> = ({
  inspectionFollowDetail,
  dynamicLabels,
}) => {
  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Total no of CAR'],
      ),
      dataIndex: 'totalNoOfCar',
      key: 'totalNoOfCar',
      width: 200,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Total no of open CAR'],
      ),
      dataIndex: 'totalNoOfOpenCar',
      key: 'totalNoOfOpenCar',
      width: 150,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Total no of closed CAR'],
      ),
      dataIndex: 'totalNoOfClosedCar',
      key: 'totalNoOfClosedCar',
      width: 240,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
  ];

  const dataSource = useMemo(
    () => [
      {
        totalNoOfCar: inspectionFollowDetail?.totalCars || 0,
        totalNoOfOpenCar: inspectionFollowDetail?.totalOpenCars || 0,
        totalNoOfClosedCar: inspectionFollowDetail?.totalCloseCars || 0,
      },
    ],

    [inspectionFollowDetail],
  );

  return (
    <div className="">
      <div className={cx(styles.header)}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['CAR / CAP summary'],
        )}
      </div>
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

export default TableSummary;
