import {
  FC,
  Dispatch,
  SetStateAction,
  Fragment,
  useCallback,
  useMemo,
  ReactElement,
} from 'react';
import images from 'assets/images/images';
import cx from 'classnames';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import {
  AG_DYNAMIC_FIELDS,
  COMMON_DYNAMIC_FIELDS,
} from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { AgGridReact, SharedProps } from 'ag-grid-react';
import { CONFIG } from 'config';
import RowStatus from 'components/common/table/row-status/RowStatus';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { GridReadyEvent } from 'ag-grid-community';
import Select from 'components/ui/select/Select';
import useDynamicLabels from 'hoc/useDynamicLabels';
import cloneDeep from 'lodash/cloneDeep';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { LicenseManager } from 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import DropdownActions, { ExtensionOption } from './ActionTable';

LicenseManager.setLicenseKey(CONFIG.REACT_APP_LICENSE_KEY_AG_GRID);
export interface DefaultColDefProps {
  sortable: boolean;
  filter: boolean;
  floatingFilter: boolean;
  resizable: boolean;
  openByDefault: boolean;
  pivot: boolean;
  enableRowGroup: boolean;
  minWidth: number;
  flex: number;
}
export interface Template {
  id: string;
  name: string;
  type: string;
}

export interface AGGridTableProps {
  rowData: any[];
  isFullScreen?: boolean;
  columnDefs: any[];
  extensionOptions: ExtensionOption[];
  templates: Template[];
  pageSize: number;
  setPageSize: (newPageSize: number) => void;
  totalItem: number;
  height: string;
  onGridReady: (event: GridReadyEvent) => void;
  handleSetTemplateID: (templateID: string) => void;
  handleDeleteTemplate: (templateID: string) => void;
  templateID: string;
  loading: boolean;
  typeRange?: string;
  setTypeRange?: Dispatch<SetStateAction<string>>;
  aggridId?: string;
  renderModalInside?: ReactElement;
  suppressRowClickSelection?: boolean;
  onFirstDataRendered?: (params: any) => void;
}

const AGGridTable: FC<AGGridTableProps & SharedProps> = (props) => {
  const {
    rowData,
    columnDefs,
    height,
    totalItem,
    pageSize,
    setPageSize,
    extensionOptions,
    templates,
    onGridReady,
    handleSetTemplateID,
    handleDeleteTemplate,
    templateID,
    isFullScreen = false,
    loading,
    aggridId,
    renderModalInside,
    suppressRowClickSelection,
    onFirstDataRendered,
    ...others
  } = props;

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonAGGrid,
    modulePage: ModulePage.List,
  });

  const { userInfo } = useSelector((state) => state.authenticate);
  const isRemove = useCallback(
    (templateType: string) => {
      if (userInfo.roleScope === 'Admin') return true;
      if (templateType === 'global') return false;
      return true;
    },
    [userInfo.roleScope],
  );
  const debounce_fun = useMemo(
    () =>
      debounce((id: string) => {
        handleDeleteTemplate(id);
      }, 500),
    [handleDeleteTemplate],
  );

  const renderTemplate = useCallback(
    (template: Template) => (
      <div
        onClick={() => handleSetTemplateID(template.id)}
        className={cx('template d-flex align-items-center', {
          'template--inactive': template.id !== templateID,
          'template--active':
            template.id === templateID && template.type === 'template',
          template__global: template.type === 'global',
          'template--inactive__global':
            template.id === templateID && template.type === 'global',
        })}
      >
        <div className="template__text--delete"> {template.name}</div>
        {isRemove(template.type) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              debounce_fun(template.id);
            }}
          >
            <img
              className="ms-2 template__icon--delete"
              src={images.icons.icClose}
              alt="ic-close-modal"
            />
          </div>
        )}
      </div>
    ),
    [debounce_fun, handleSetTemplateID, isRemove, templateID],
  );

  const CellRenderRight = useCallback(
    ({ value }: any) => <div className="text-end">{value}</div>,
    [],
  );

  const CellRenderStatus = useCallback(
    ({ value }: any) => <RowStatus status={value || ''} />,
    [],
  );

  const CellRenderHighLight = useCallback(
    ({ value }: any) => <div className="cell-high-light">{value || ''}</div>,
    [],
  );

  const renderDynamicLabels = useMemo(() => {
    const labels: IDynamicLabel = {};
    if (!dynamicLabels) {
      return null;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of cloneDeep(Object.entries(AG_DYNAMIC_FIELDS))) {
      labels[key] = renderDynamicLabel(dynamicLabels, value);
    }
    return labels;
  }, [dynamicLabels]);

  return (
    <div
      id={aggridId ? `ag-grid-table-${aggridId}` : 'ag-grid-table'}
      className="ag-grid-table w-100 position-relative"
      style={{ height }}
    >
      <div
        id={
          aggridId ? `ag-grid-table-theme-${aggridId}` : 'ag-grid-table-theme'
        }
        className="ag-theme-alpine w-100 position-relative"
        style={{ height: '100%' }}
      >
        <div className="ag-grid-table__header d-flex justify-content-between">
          <div className="d-flex templates">
            {templates.map((item) => (
              <Fragment key={item.id}>{renderTemplate(item)}</Fragment>
            ))}
          </div>
          <div className="ag-grid-table__header-left d-flex justify-content-end align-items-center">
            <div className="fw-bold">
              {renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Total Records'],
              )}{' '}
              : {totalItem}
            </div>
            <DropdownActions
              extensionOptions={extensionOptions?.filter((item) => item) || []}
            />
          </div>
        </div>
        {renderModalInside}

        {!loading && (
          <AgGridReact
            frameworkComponents={{
              cellRenderStatus: CellRenderStatus,
              cellRenderRight: CellRenderRight,
              cellRenderHighLight: CellRenderHighLight,
            }}
            sideBar={{
              toolPanels: ['columns'],
              defaultToolPanel: '',
            }}
            onGridReady={onGridReady}
            rowData={rowData}
            columnDefs={columnDefs}
            floatingFiltersHeight={27}
            rowBuffer={100}
            pivotHeaderHeight={27}
            pivotGroupHeaderHeight={27}
            suppressDragLeaveHidesColumns
            // rightAligned={{
            //   headerClass: 'ag-right-aligned-header',
            //   cellClass: 'ag-right-aligned-cell',
            // }}
            // groupUseEntireRow
            // animateRows
            // groupUseEntireRow
            // domLayout="autoHeight"
            pagination
            paginationPageSize={pageSize}
            rowHeight={27}
            // rowBuffert
            headerHeight={27}
            rowGroupPanelShow="always"
            suppressRowClickSelection={suppressRowClickSelection}
            onFirstDataRendered={onFirstDataRendered}
            localeText={renderDynamicLabels}
            {...others}
          />
        )}

        <div style={{ position: 'absolute', bottom: -27, left: 15 }}>
          <Select
            data={[
              {
                value: 5,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['5 / page'],
                ),
              },
              {
                value: 10,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['10 / page'],
                ),
              },
              {
                value: 20,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['20 / page'],
                ),
              },
              {
                value: 35,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['35 / page'],
                ),
              },
              {
                value: 50,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['50 / page'],
                ),
              },
              {
                value: 100,
                label: renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['100 / page'],
                ),
              },
            ]}
            notAllowSortData
            value={pageSize}
            onChange={(value) => {
              // gridApi?.api?.paginationSetPageSize(Number(value));
              setPageSize(Number(value));
            }}
            {...(isFullScreen && { dropdownAlign: { offset: [0, -230] } })}
            // disabled={disable}
            // className={styles.inputSelect}
            // styleLabel={styles.labelFilter}
            // onChange={(value) => handleChangeSearchValue('status', value)}
          />
        </div>
      </div>
      {loading && (
        <div className="position-absolute h-100 w-100 wrapper__loading d-flex align-items-center">
          <img src={images.common.loading} alt="loading" />
        </div>
      )}
    </div>
  );
};
export default AGGridTable;
