import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { formatDateNoTime } from 'helpers/date.helper';
import { Action } from 'models/common.model';
import { FC, useContext, useMemo } from 'react';
import { v4 } from 'uuid';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

import styles from '../form.module.scss';
import '../form.scss';
import IHASList from './IHASList';

interface Props {
  isEdit: boolean;
  handleEditFindingItem?: (
    id?: string,
    isEdit?: boolean,
    isCreate?: boolean,
  ) => void;
}

const ManuallyCreatedRecordTable: FC<Props> = ({
  isEdit,
  handleEditFindingItem,
}) => {
  const { IHASListofItemsManual } = useContext(InternalAuditReportFormContext);
  // const defaultValues = {
  //   fromDate: moment().startOf('month'),
  //   toDate: moment().endOf('month'),
  // };
  // const { watch } = useForm<FieldValues>({
  //   mode: 'onSubmit',
  //   defaultValues,
  // });

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (text, record) => {
        const actions: Action[] = [
          {
            img: images.icons.icViewDetail,
            function: () => {
              handleEditFindingItem(record, false);
            },
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
            action: ActionTypeEnum.VIEW,
            buttonType: ButtonType.Blue,
            disable: false,
          },
          {
            img: images.icons.icEdit,
            function: () => {
              handleEditFindingItem(record, true);
            },
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
            action: ActionTypeEnum.EXECUTE,
            disable: !isEdit,
            cssClass: 'ms-1',
          },
        ];

        return (
          <div className={cx(styles.action, 'd-flex')}>
            <ActionBuilder actionList={actions} />
          </div>
        );
      },
    },
    {
      title: 'Inspection date',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      width: 170,
    },
    {
      title: 'Inspection type',
      dataIndex: 'auditType',
      key: 'auditType',
      width: 170,
      // minWidth: 170,
    },
    {
      title: 'Total number of findings',
      children: [
        {
          title: 'Total',
          dataIndex: 'totalOfFinding',
          key: 'totalOfFinding',
          width: 80,
          minWidth: 80,
          className: cx(styles.primaryChild),
        },
        {
          title: 'Open',
          dataIndex: 'openFinding',
          key: 'openFinding',
          width: 80,
          minWidth: 80,
          className: cx(styles.primaryChild),
        },
        {
          title: 'Close',
          dataIndex: 'closeFinding',
          key: 'closeFinding',
          width: 80,
          minWidth: 80,
          // className: cx(styles.bRight),
        },
      ],
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      width: 250,
      render: (text) => (
        <Tooltip
          placement="topLeft"
          destroyTooltipOnHide
          title={text}
          color="#3B9FF3"
        >
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        </Tooltip>
      ),
    },
  ];

  const dataItemList = useMemo(
    () =>
      IHASListofItemsManual?.map((i) => ({
        key: v4(),
        id: i?.id,
        inspectionDate: formatDateNoTime(i.inspectionDate),
        auditType: i.auditType?.name,
        openFinding: i.openFinding,
        closeFinding: i.closeFinding,
        totalOfFinding: i.totalFinding,
        remark: i.remark || '',
      })),
    [IHASListofItemsManual],
  );

  return (
    <div>
      <IHASList dataSource={dataItemList} columns={columns} />
    </div>
  );
};

export default ManuallyCreatedRecordTable;
