import cx from 'classnames';
import { FC, useCallback, useMemo, useState } from 'react';

import images from 'assets/images/images';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';

import { StatusHistory } from 'models/api/audit-checklist/audit-checklist.model';
import capitalize from 'lodash/capitalize';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { DEFAULT_COL_DEF_TYPE_FLEX } from 'constants/components/ag-grid.const';
import { getListTemplateDictionaryActions } from 'store/template/template.action';

import { useDispatch } from 'react-redux';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import styles from './table-history.module.scss';

export interface TableProps {
  data: StatusHistory[];
  hideActionCol?: boolean;
  loading?: boolean;
  pageSizeDefault?: number;
  moduleTemplate?: string;
  dynamicLabel?: IDynamicLabel;
}

const TableHistorySection: FC<TableProps> = ({
  data,
  hideActionCol,
  loading,
  pageSizeDefault,
  moduleTemplate,
  dynamicLabel,
}) => {
  const dispatch = useDispatch();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const columnDef = useMemo(
    () =>
      [
        {
          field: 'sNo',
          headerName: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
              'S.No'
            ],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'status',
          headerName: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation
              .Status,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          cellRenderer: 'cellRenderStatus',
        },
        {
          field: 'updatedUser',
          headerName: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
              'User name'
            ],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'jobTitle',
          headerName: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
              'Job title'
            ],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        !hideActionCol && {
          field: 'action',
          headerName: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
              'Job title'
            ],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'updatedAt',
          headerName: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
              'Updated date'
            ],
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
          comparator: dateStringComparator,
        },
        {
          field: 'comment',
          headerName: renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation
              .Comment,
          ),
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ].filter((item) => !!item),
    [dynamicLabel, isMultiColumnFilter, hideActionCol],
  );
  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: moduleTemplate,
      }),
    );
  }, [dispatch, moduleTemplate]);

  const populateStatus = useCallback((status: string) => {
    if (String(status)?.toLocaleLowerCase() === 'rejected') {
      return 'Reassigned';
    }
    return capitalize(status?.replaceAll('_', ' '));
  }, []);

  const dataTable = useMemo(
    () =>
      data?.map((item, index) => ({
        sNo: index + 1,
        status: populateStatus(item?.status),
        updatedUser: item?.createdUser?.username,
        updatedAt: formatDateTime(item?.updatedAt),
        jobTitle: item?.createdUser?.jobTitle,
        comment: item?.remark,
      })),
    [data, populateStatus],
  );

  return (
    <>
      <div className={cx(styles.header, 'pt-2 pb-3')}>
        {renderDynamicLabel(
          dynamicLabel,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
            'User history section'
          ],
        )}
      </div>
      {dataTable?.length ? (
        <AGGridModule
          dataFilter={null}
          dataTable={dataTable}
          loading={false}
          moduleTemplate={moduleTemplate}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          params={undefined}
          getList={getList}
          hasRangePicker={false}
          columnDefs={columnDef}
          height="275px"
          pageSizeDefault={pageSizeDefault}
          colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
          dynamicLabels={dynamicLabel}
          fileName={renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.generalInformation[
              'User history section'
            ],
          )}
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
    </>
  );
};

export default TableHistorySection;
