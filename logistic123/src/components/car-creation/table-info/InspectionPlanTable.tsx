import Table, { ColumnsType } from 'antd/lib/table';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { formatDateNoTime } from 'helpers/date.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC, useMemo } from 'react';
import styles from './car-history.module.scss';

interface Props {
  data: any;
  dynamicLabels?: IDynamicLabel;
}

const InspectionPlanTable: FC<Props> = ({ data, dynamicLabels }) => {
  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Inspection ref id'],
      ),
      dataIndex: 'refId',
      key: 'refId',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Planned from date'],
      ),
      dataIndex: 'plannedFromDate',
      key: 'plannedFromDate',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Planned to date'],
      ),
      dataIndex: 'plannedToDate',
      key: 'plannedToDate',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Inspector name'],
      ),
      dataIndex: 'auditNo',
      key: 'auditNo',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Lead inspector name'],
      ),
      dataIndex: 'leadInspectorName',
      key: 'leadInspectorName',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['From port'],
      ),
      dataIndex: 'fromPort',
      key: 'fromPort',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['To port'],
      ),
      dataIndex: 'toPort',
      key: 'toPort',
    },
  ];

  const dataSource = useMemo(
    () =>
      data?.map((item, index) => ({
        refId: item?.refId || '',
        plannedFromDate: item?.plannedFromDate
          ? formatDateNoTime(item?.plannedFromDate)
          : '',
        plannedToDate: item?.plannedToDate
          ? formatDateNoTime(item?.plannedToDate)
          : '',
        auditNo: item?.auditors?.length
          ? item?.auditors?.map((i) => i.username)?.join(', ')
          : '',
        leadInspectorName: item?.leadAuditor?.username || '',
        fromPort: item?.fromPort?.name || '',
        toPort: item?.toPort?.name || '',
      })),
    [data],
  );

  return (
    <div>
      <div className={styles.title}>
        {renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['Inspection plan'],
        )}
      </div>
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

export default InspectionPlanTable;
