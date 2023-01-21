/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useCallback, useMemo, useState } from 'react';
import { InspectionMappingDetailResponse } from 'models/api/inspection-mapping/inspection-mapping.model';
import { useDispatch, useSelector } from 'react-redux';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { RoleScope } from 'constants/roleAndPermission.const';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS } from 'constants/dynamic/inspectionMapping.const';
import styles from './table-user-history-section.module.scss';

export interface RowLabelType {
  label: string;
  id: string;
  width: number | string;
}

export interface ModalProps {
  loading?: boolean;
  data?: InspectionMappingDetailResponse;
  isEdit?: boolean;
  isCreated?: boolean;
}

const TableUserHistorySection: FC<ModalProps> = ({
  loading,
  data,
  isEdit = false,
  isCreated = false,
}) => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { userInfo } = useSelector((state) => state.authenticate);
  const dispatch = useDispatch();

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreated),
  });

  const columnDef = useMemo(
    () => [
      {
        field: 'sNo',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'userName',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['User name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'jobTitle',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Job title'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'action1',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Action,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dateTime',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Update date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
    ],
    [dynamicFields, isMultiColumnFilter],
  );

  const sanitizeData = useCallback((data, index) => {
    const finalData = {
      sNo: index + 1,
      userName: data?.createdUser?.username,
      jobTitle: data?.createdUser?.jobTitle,
      action1: data?.status,
      dateTime: formatDateTime(data?.createdAt),
    };
    return finalData;
  }, []);

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

  const dataSource = useMemo(
    () =>
      handleSortByDate(data?.statusHistory)?.map((item, index) =>
        sanitizeData(item, index),
      ),
    [data?.statusHistory, handleSortByDate, sanitizeData],
  );

  const handleGetList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: MODULE_TEMPLATE.inspectionInspectionMappingUserHistoryTemplate,
      }),
    );
  }, [dispatch]);

  return (
    <div className={styles.tableAuditChecklist}>
      <AGGridModule
        dataFilter={null}
        dataTable={dataSource}
        loading={loading}
        moduleTemplate={
          MODULE_TEMPLATE.inspectionInspectionMappingUserHistoryTemplate
        }
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        params={undefined}
        getList={handleGetList}
        hasRangePicker={false}
        columnDefs={columnDef}
        height="275px"
        hiddenTemplate={userInfo?.roleScope === RoleScope.SuperAdmin}
        extensions={
          userInfo?.roleScope === RoleScope.SuperAdmin
            ? {
                saveTemplate: false,
                saveAsTemplate: false,
                deleteTemplate: false,
                globalTemplate: false,
              }
            : {}
        }
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        fileName={renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['User history section'],
        )}
        pageSizeDefault={5}
        dynamicLabels={dynamicFields}
      />
    </div>
  );
};

export default TableUserHistorySection;
