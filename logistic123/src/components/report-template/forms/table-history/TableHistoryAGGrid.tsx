import { FC, useCallback, useMemo, useState } from 'react';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import cx from 'classnames';
import { formatDateTime, dateStringComparator } from 'helpers/utils.helper';
import { IStepHistory } from 'models/common.model';
import { ReportFindingHistory } from 'models/api/report-of-finding/report-of-finding.model';
import { StatusHistory } from 'models/api/audit-checklist/audit-checklist.model';
import capitalize from 'lodash/capitalize';
import { useDispatch } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { DEFAULT_COL_DEF_TYPE_FLEX_QA } from 'constants/components/ag-grid.const';
import styles from './table-history.module.scss';

export interface TableProps {
  data: StatusHistory[] | IStepHistory[] | ReportFindingHistory[];
  loading?: boolean;
  hideStatus?: boolean;
  showAction?: boolean;
  hideComment?: boolean;
  pageSizeDefault?: number;
  moduleTemplate?: string;
  aggridId?: string;
  dynamicLabels?: IDynamicLabel;
}

const TableHistory: FC<TableProps> = ({
  data,
  showAction,
  hideStatus,
  hideComment,
  loading,
  pageSizeDefault,
  moduleTemplate,
  aggridId,
  dynamicLabels,
}) => {
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const dispatch = useDispatch();

  const columnDefs = useMemo(
    () => [
      {
        field: 'sNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
        hide: hideStatus,
      },
      {
        field: 'updatedUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['User name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'jobTitle',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Job title'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'comment',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Comment,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        hide: hideComment,
      },
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Action,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        hide: !showAction,
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Uploaded date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
    ],
    [dynamicLabels, isMultiColumnFilter, hideStatus, hideComment, showAction],
  );

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

  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: moduleTemplate,
      }),
    );
  }, [dispatch, moduleTemplate]);

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

  const dataTable = useMemo(
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
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.header, styles.historySection)}>
        {renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['User history section'],
        )}
      </div>
      <AGGridModule
        loading={loading}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={moduleTemplate}
        fileName={renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Table history'],
        )}
        dataTable={dataTable}
        height="275px"
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX_QA}
        getList={getList}
        pageSizeDefault={pageSizeDefault}
        classNameHeader={styles.header}
        aggridId={aggridId}
      />
    </div>
  );
};

export default TableHistory;
