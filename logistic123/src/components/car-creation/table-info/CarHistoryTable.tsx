import Table, { ColumnsType } from 'antd/lib/table';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import StatusBadge from 'components/common/status-badge/StatusBadge';
import { formatDateNoTime } from 'helpers/date.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useMemo } from 'react';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import styles from './car-history.module.scss';

interface Props {
  data: any;
  dynamicLabels?: IDynamicLabel;
}

const CarHistory: FC<Props> = ({ data, dynamicLabels }) => {
  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS['S.No']),
      dataIndex: 'sNo',
      key: 'sNo',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['CAP status'],
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge name={status} />,
    },
    {
      title: renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS.Comment),
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Commented by'],
      ),
      dataIndex: 'createdUser',
      key: 'createdUser',
    },
    {
      title: renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS.Date),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
  ];

  const dataSource = useMemo(
    () =>
      data?.map((item, index) => ({
        sNo: index + 1,
        status: item?.status,
        comment: item?.comment,
        createdUser: item?.createdUser?.username || '',
        updatedAt: formatDateNoTime(item?.updatedAt),
      })),
    [data],
  );

  return (
    <div>
      {data?.length ? (
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

export default CarHistory;
