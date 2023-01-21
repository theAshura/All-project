import Table, { ColumnsType } from 'antd/lib/table';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { useContext, useMemo } from 'react';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import { CarFormContext } from '../CarFormContext';
import styles from './step.module.scss';

const FindingTable = ({ dynamicLabels }) => {
  const { step1Values } = useContext(CarFormContext);

  const findingValues = useMemo(
    () => step1Values?.findingSelected || [],
    [step1Values?.findingSelected],
  );

  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS['S.No']),
      dataIndex: 'sNo',
      key: 'sNo',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Reference number'],
      ),
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Inspection type'],
      ),
      dataIndex: 'auditTypeName',
      key: 'auditTypeName',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Finding comments'],
      ),
      dataIndex: 'findingComment',
      key: 'findingComment',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Finding remarks'],
      ),
      dataIndex: 'findingRemark',
      key: 'findingRemark',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Finding type'],
      ),
      dataIndex: 'natureFindingName',
      key: 'natureFindingName',
    },
  ];

  const dataSource = useMemo(
    () =>
      findingValues?.map((item, index) => ({
        sNo: index + 1,
        id: item.id,
        reference: item?.reference || 'N/A',
        auditTypeName: item?.auditType?.name || item?.auditTypeName || '',
        findingComment: item?.findingComment,
        findingRemark: item?.findingRemark,
        natureFindingName: item?.natureFindingName,
      })),
    [findingValues],
  );

  return (
    <div>
      <div className={styles.headerTable}>
        <div>
          {renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS.Findings)}
        </div>
      </div>
      {findingValues?.length ? (
        <Table
          columns={columns}
          rowKey="id"
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

export default FindingTable;
