import { FC, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-time-table.const';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { formatDateTime } from 'helpers/utils.helper';
import { useDispatch } from 'react-redux';
import styles from './form.module.scss';

interface ChecklistViewTableProps {
  data?: any;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

export const ChecklistViewTable: FC<ChecklistViewTableProps> = (props) => {
  const { data, loading, dynamicLabels } = props;

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const dispatch = useDispatch();

  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: MODULE_TEMPLATE.tableCheckListView,
      }),
    );
  }, [dispatch]);

  const dataTable = useMemo(
    () =>
      (!loading &&
        data?.length > 0 &&
        data.map((data: any, index) => ({
          code: data.code,
          auditType: data.auditType,
          name: data.name,
          updatedAt: formatDateTime(data.updatedAt),
        }))) ||
      [],
    [loading, data],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Checklist code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Checklist name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Last updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter],
  );

  return (
    <div
      className={cx(
        'mt-3',
        styles.wrapperContainer,
        styles.wrapperContainerCheckList,
      )}
    >
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleForm)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Checklist view'],
            )}
          </div>
        </div>
        <div className={cx('pt-2', styles.table)}>
          <AGGridModule
            loading={loading}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker={false}
            columnDefs={columnDefs}
            dataFilter={null}
            moduleTemplate={MODULE_TEMPLATE.tableCheckListView}
            fileName="Table office comment new"
            dataTable={dataTable}
            height="275px"
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
            getList={getList}
            pageSizeDefault={5}
            classNameHeader={styles.header}
            aggridId="ag-grid-table-1"
          />
        </div>
      </div>
    </div>
  );
};
