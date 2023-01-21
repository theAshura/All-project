import { FC, useCallback } from 'react';
import TableCp from 'components/common/table/TableCp';
import { AuditCheckList } from 'models/api/audit-checklist/audit-checklist.model';
import { formatDateTime } from 'helpers/utils.helper';
import images from 'assets/images/images';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { Action } from 'models/common.model';
import { ButtonType } from 'components/ui/button/Button';
import { AppRouteConst } from 'constants/route.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

import { RowComponent } from 'components/common/table/row/rowCp';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS } from 'constants/dynamic/inspectionMapping.const';
import styles from './table-audit-checklist.module.scss';

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
}

export interface ModalProps {
  data: AuditCheckList[];
  loading?: boolean;
  onDelete: (id: string) => void;
  isEdit: boolean;
  isCreated?: boolean;
}

const TableAuditChecklist: FC<ModalProps> = ({
  data,
  loading,
  onDelete,
  isEdit,
  isCreated = false,
}) => {
  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreated),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rowLabels = [
    {
      id: 'action',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Action,
      ),
      sort: false,
      width: '100',
    },
    {
      id: 'code',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Checklist code'],
      ),
      sort: true,
      width: '200',
    },
    {
      id: 'name',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Checklist name'],
      ),
      sort: true,
      width: '200',
    },
    {
      id: 'auditEntity',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Entity,
      ),
      sort: true,
      width: '200',
    },
    {
      id: 'revisionNumber',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Revision number'],
      ),
      width: '200',
      sort: true,
    },
    {
      id: 'revisionDate ',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Revision date'],
      ),
      width: '200',
      sort: true,
    },
    {
      id: 'status',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Status,
      ),
      width: '200',
      sort: true,
    },
    // {
    //   id: 'appType ',
    //   label: 'App Type',
    //   width: '200',
    //   sort: true,
    // },
    {
      id: 'chkType',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Checklist type'],
      ),
      width: '200',
      sort: true,
    },
    {
      id: 'validityFrom',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Valid form'],
      ),
      width: '200',
      sort: true,
    },
    {
      id: 'validityTo',
      label: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Valid to'],
      ),
      width: '200',
      sort: true,
    },
  ];

  const viewDetail = useCallback((id?: string) => {
    window.open(AppRouteConst.auditCheckListDetail(id), '_blank');
  }, []);

  const sanitizeData = (data: AuditCheckList) => {
    const finalData = {
      id: data.id,
      checklistCode: data.code,
      checklistName: data.name,
      auditEntity: data.auditEntity,
      revisionNumber: data.revisionNumber,
      revisionDate: formatDateTime(data.revisionDate),
      status: data.status,
      // appType: data.appType,
      checklistType: data.chkType,
      validityFrom: formatDateTime(data.validityFrom),
      validityTo: formatDateTime(data.validityTo),
    };
    return finalData;
  };
  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && data?.length > 0) {
        return (
          <tbody>
            {data?.map((item) => {
              const finalData = sanitizeData(item);
              let actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.INSPECTION_MAPPING,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                },
              ];

              if (isEdit) {
                actions = [
                  ...actions,
                  {
                    img: images.icons.icRemove,
                    function: () => {
                      showConfirmBase({
                        isDelete: true,
                        txTitle: renderDynamicLabel(
                          dynamicFields,
                          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Delete?'],
                        ),
                        txMsg: renderDynamicLabel(
                          dynamicFields,
                          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
                            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                          ],
                        ),
                        txButtonLeft: renderDynamicLabel(
                          dynamicFields,
                          COMMON_DYNAMIC_FIELDS.Cancel,
                        ),
                        txButtonRight: renderDynamicLabel(
                          dynamicFields,
                          COMMON_DYNAMIC_FIELDS.Delete,
                        ),
                        onPressButtonRight: () => onDelete(item.id),
                      });
                    },
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.INSPECTION_MAPPING,
                    action: ActionTypeEnum.DELETE,
                    buttonType: ButtonType.Orange,
                    cssClass: 'ms-1',
                  },
                ];
              }

              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  onClickRow={undefined}
                  rowLabels={rowLabels}
                  key={finalData.id}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [loading, data, isEdit, rowLabels, viewDetail, dynamicFields, onDelete],
  );
  return (
    <div className={styles.tableAuditChecklist}>
      <TableCp
        rowLabels={rowLabels}
        isEmpty={data?.length === 0}
        classNameNodataWrapper={styles.dataWrapperEmpty}
        loading={loading}
        renderRow={renderRow}
      />
    </div>
  );
};

export default TableAuditChecklist;
