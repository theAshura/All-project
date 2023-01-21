import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
  IsRowSelectable,
  PaginationChangedEvent,
  RowClickedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import cx from 'classnames';
import images from 'assets/images/images';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import useEffectOnce from 'hoc/useEffectOnce';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import {
  DATE_DEFAULT,
  DEFAULT_COL_DEF,
  TEXT_ACTION_TEMPLATE,
  TYPE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import { CommonApiParam } from 'models/common.model';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { useDispatch, useSelector } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  AG_DYNAMIC_FIELDS,
  COMMON_DYNAMIC_FIELDS,
} from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { setDataFilterAction } from 'store/internal-audit-report/internal-audit-report.action';
import {
  clearTemplateDictionaryReducer,
  createTemplateDictionaryActions,
  deleteTemplateDictionaryActions,
  getListTemplateDictionaryActions,
  getTemplateDetailDictionaryActions,
  updateTemplateDictionaryActions,
} from 'store/template/template.action';
import styles from './ag-grid.module.scss';

interface Extensions {
  saveTemplate?: boolean;
  saveAsTemplate?: boolean;
  deleteTemplate?: boolean;
  globalTemplate?: boolean;
  distinctFilter?: boolean;
  conditionFilter?: boolean;
  multipleFilter?: boolean;
  reset?: boolean;
  excel?: boolean;
  CSV?: boolean;
  fullScreen?: boolean;
}

export interface AggModule2Props {
  loading: boolean;
  colDefProp?: any;
  params: CommonApiParam;
  dataFilter: CommonApiParam;
  hasRangePicker?: boolean;
  moduleTemplate: string;
  height?: string;
  fileName?: string;
  title?: string;
  dataTable: any[];
  className?: string;
  classNameHeader?: string;
  extensions?: Extensions;
  setIsMultiColumnFilter: Dispatch<SetStateAction<boolean>>;
  buttons?: ReactNode;
  columnDefs?: any[];
  rowSelection?: string;
  pageSizeDefault?: number;
  view?: (params?: any, item?: any) => boolean;
  getList?: (params?: any) => void;
  clearData?: (params?: any) => void;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
  onRowSelected?: (event: RowSelectedEvent) => void;
  isRowSelectable?: IsRowSelectable;
  exposeGridApi?: (api: GridApi) => void;
  preventRowEventWhenClickOn?: string[];
  objectReview?: ReactNode;
  datePickerClassName?: string;
  isQuickSearchDatePicker?: boolean;
  stopEditingWhenCellsLoseFocus?: boolean;
  hiddenTemplate?: boolean;
  classNameObjectOverview?: string;
  aggridId?: string;
  suppressRowClickSelection?: boolean;
  onFirstDataRendered?: (params: any) => void;
  dynamicLabels?: IDynamicLabel;
}

const DEFAULT_EXTENSIONS = {
  saveTemplate: true,
  saveAsTemplate: true,
  deleteTemplate: true,
  globalTemplate: true,
  distinctFilter: true,
  conditionFilter: true,
  multipleFilter: true,
  reset: true,
  excel: true,
  CSV: true,
  fullScreen: true,
};

const AGGridModule = ({
  loading,
  params,
  dataFilter,
  hasRangePicker = true,
  fileName = 'data',
  moduleTemplate,
  dataTable,
  columnDefs,
  className,
  classNameHeader,
  extensions,
  hiddenTemplate = false,
  colDefProp = DEFAULT_COL_DEF,
  setIsMultiColumnFilter,
  onSelectionChanged,
  onRowSelected,
  exposeGridApi,
  buttons,
  height,
  clearData,
  title = '',
  pageSizeDefault = 20,
  rowSelection = 'single',
  isRowSelectable,
  getList,
  view,
  preventRowEventWhenClickOn,
  objectReview,
  datePickerClassName,
  isQuickSearchDatePicker,
  stopEditingWhenCellsLoseFocus = true,
  aggridId,
  suppressRowClickSelection,
  onFirstDataRendered,
}: AggModule2Props) => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonAGGrid,
    modulePage: ModulePage.List,
  });

  const { listTemplateDictionary, templateDetailDictionary } = useSelector(
    (state) => state.template,
  );
  const el = aggridId
    ? document.getElementById(`ag-grid-table-theme-${aggridId}`)
    : document.getElementById('ag-grid-table-theme');
  const el2 = aggridId
    ? document.getElementById(`ag-grid-table-${aggridId}`)
    : document.getElementById('ag-grid-table');

  // const agGridTableThemeRef = useRef(null);
  const dispatch = useDispatch();
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);
  const [pageSize, setPageSize] = useState(
    dataFilter?.pageSize || pageSizeDefault,
  );
  const [page, setPage] = useState(dataFilter?.page > 0 ? dataFilter?.page : 0);
  const [colDef, setColDef] = useState(colDefProp);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [templateID, setTemplateID] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );

  const templateDetail = useMemo(
    () => templateDetailDictionary[moduleTemplate],
    [moduleTemplate, templateDetailDictionary],
  );

  const listTemplate = useMemo(
    () => listTemplateDictionary[moduleTemplate],
    [listTemplateDictionary, moduleTemplate],
  );

  const totalPage = useMemo(
    () => gridApi?.paginationGetTotalPages(),
    [gridApi],
  );

  const mergedExtensions = useMemo(() => {
    if (!extensions) {
      return DEFAULT_EXTENSIONS;
    }
    return {
      ...DEFAULT_EXTENSIONS,
      ...extensions,
    };
  }, [extensions]);

  const onFullScreenChange = useCallback(() => {
    if (el2 && el2.style && el2.style.height) {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
        // el2.style.height = 'calc(100% - 36px)';
      } else {
        setIsFullScreen(false);
        // el2.style.height = '100%';
      }
    }
  }, [el2]);

  const handleSaveFilter = useCallback(
    (data: CommonApiParam) => {
      dispatch(setDataFilterAction(data));
    },
    [dispatch],
  );

  const handleDeleteTemplate = useCallback(
    (templateId: string) => {
      dispatch(
        deleteTemplateDictionaryActions.request({
          ids: [templateId],
          getList: () => {
            dispatch(
              getListTemplateDictionaryActions.request({
                content: moduleTemplate,
              }),
            );
          },
        }),
      );
    },
    [dispatch, moduleTemplate],
  );

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
      exposeGridApi?.(params.api);
    },
    [exposeGridApi],
  );

  const handleGetTemplate = useCallback(
    (templateId: string) => {
      dispatch(
        getTemplateDetailDictionaryActions.request({
          templateId,
          content: moduleTemplate,
        }),
      );
    },
    [dispatch, moduleTemplate],
  );

  const getTypeTemplate = useCallback(
    (type: string, templateDetailType: string) => {
      if (
        type ===
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.globalTemplate],
        )
      )
        return TYPE_TEMPLATE.global;
      if (
        type ===
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.saveAsTemplate],
        )
      )
        return TYPE_TEMPLATE.template;
      return templateDetailType || TYPE_TEMPLATE.template;
    },
    [dynamicLabels],
  );

  const handleSaveTemplate = useCallback(
    (templateName: string) => {
      dispatch(
        createTemplateDictionaryActions.request({
          module: moduleTemplate,
          type: getTypeTemplate(
            titleModal,
            templateDetailDictionary?.[moduleTemplate]?.type,
          ),
          name: templateName,
          defaultTemplate: JSON.stringify({
            columns: gridColumnApi?.getColumnState(),
            filterModel: currentFilterModel,
          }),
          template: JSON.stringify({
            columns: gridColumnApi?.getColumnState(),
            filterModel: currentFilterModel,
          }),
        }),
      );

      setOpenTemplate((p) => !p);
    },
    [
      currentFilterModel,
      dispatch,
      getTypeTemplate,
      gridColumnApi,
      moduleTemplate,
      templateDetailDictionary,
      titleModal,
    ],
  );

  const extensionOptionSaveTemplate = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.saveTemplate],
      ),
      icon: images.icons.agGrid.icAGSave,
      onClick: () => {
        if (listTemplate?.data?.length > 0) {
          dispatch(
            updateTemplateDictionaryActions.request({
              id: templateDetail?.id,
              module: moduleTemplate,
              type: templateDetail?.type,
              name: templateDetail?.name,
              defaultTemplate: JSON.stringify({
                columns: gridColumnApi?.getColumnState(),
                filterModel: currentFilterModel,
              }),
              template: JSON.stringify({
                columns: gridColumnApi?.getColumnState(),
                filterModel: currentFilterModel,
              }),
            }),
          );
        } else {
          setTitleModal(
            renderDynamicLabel(
              dynamicLabels,
              AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.saveTemplate],
            ),
          );
          setOpenTemplate((p) => !p);
        }
      },
    }),
    [
      currentFilterModel,
      dispatch,
      dynamicLabels,
      gridColumnApi,
      listTemplate?.data?.length,
      moduleTemplate,
      templateDetail?.id,
      templateDetail?.name,
      templateDetail?.type,
    ],
  );

  const extensionOptionSaveAsTemplate = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.saveAsTemplate],
      ),
      icon: images.icons.agGrid.icAGSaveAs,
      onClick: () => {
        setTitleModal(
          renderDynamicLabel(
            dynamicLabels,
            AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.saveAsTemplate],
          ),
        );
        setOpenTemplate((p) => !p);
      },
    }),
    [dynamicLabels],
  );

  const extensionOptionDeleteTemplate = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.deleteTemplate],
      ),
      icon: images.icons.agGrid.icAGDelete,
      onClick: () => setModalOpen(true),
    }),
    [dynamicLabels],
  );

  const extensionOptionGlobalTemplate = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.globalTemplate],
      ),
      icon: images.icons.agGrid.icAGGlobal,
      onClick: () => {
        setTitleModal(
          renderDynamicLabel(
            dynamicLabels,
            AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.globalTemplate],
          ),
        );
        setOpenTemplate((p) => !p);
      },
    }),
    [dynamicLabels],
  );

  const extensionOptionDistinctFilter = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.distinctFilter],
      ),
      icon: images.icons.agGrid.icAGDistinctFilter,
      onClick: () => {
        const columnDefs = gridApi.getColumnDefs();
        columnDefs.forEach((colDef: ColDef) => {
          // NOTED: allow reassign with aggrid api
          // eslint-disable-next-line no-param-reassign
          colDef.floatingFilter = false;
        });
        gridApi.setColumnDefs(columnDefs);
      },
    }),
    [dynamicLabels, gridApi],
  );

  const extensionOptionConditionFilter = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.conditionFilter],
      ),
      icon: images.icons.agGrid.icAGConditionalFilter,
      onClick: () => {
        const columnDefs = gridApi.getColumnDefs();
        columnDefs.forEach((colDef: ColDef) => {
          // NOTED: allow reassign with aggrid api
          // eslint-disable-next-line no-param-reassign
          colDef.floatingFilter = true;
        });
        gridApi.setColumnDefs(columnDefs);
      },
    }),
    [dynamicLabels, gridApi],
  );

  const extensionOptionMultipleFilter = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.multipleFilter],
      ),
      icon: images.icons.agGrid.icAGMultipleFilter,
      onClick: () => {
        setIsMultiColumnFilter(true);
        setColDef({ ...colDef });
      },
    }),
    [colDef, dynamicLabels, setIsMultiColumnFilter],
  );

  const extensionOptionReset = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.reset],
      ),
      icon: images.icons.agGrid.icAGReset,
      onClick: () => {
        gridColumnApi?.resetColumnState();
        setColDef(colDefProp);
        gridApi?.setFilterModel(null);
        setIsMultiColumnFilter(false);
      },
    }),
    [colDefProp, dynamicLabels, gridApi, gridColumnApi, setIsMultiColumnFilter],
  );

  const extensionOptionExcel = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.excel],
      ),
      icon: images.icons.agGrid.icAGExcel,
      onClick: () =>
        gridApi?.exportDataAsExcel({
          fileName: `${fileName}.xlsx`,
        }),
    }),
    [dynamicLabels, fileName, gridApi],
  );

  const extensionOptionCSV = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.CSV],
      ),
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({
          fileName: `${fileName}.csv`,
        }),
    }),
    [dynamicLabels, fileName, gridApi],
  );

  const extensionOptionFullScreen = useMemo(
    () => ({
      label: renderDynamicLabel(
        dynamicLabels,
        AG_DYNAMIC_FIELDS[TEXT_ACTION_TEMPLATE.fullScreen],
      ),
      icon: images.icons.agGrid.icAGFullScreen,
      onClick: () => {
        el?.requestFullscreen();
        el?.addEventListener('fullscreenchange', onFullScreenChange);
      },
    }),
    [dynamicLabels, el, onFullScreenChange],
  );

  const extensionOptions: ExtensionOption[] = useMemo(() => {
    const result = [];

    if (mergedExtensions.saveTemplate) {
      result.push(extensionOptionSaveTemplate);
    }

    if (mergedExtensions.saveAsTemplate) {
      result.push(extensionOptionSaveAsTemplate);
    }

    if (mergedExtensions.deleteTemplate) {
      result.push(extensionOptionDeleteTemplate);
    }

    if (mergedExtensions.globalTemplate) {
      result.push(extensionOptionGlobalTemplate);
    }

    if (mergedExtensions.distinctFilter) {
      result.push(extensionOptionDistinctFilter);
    }

    if (mergedExtensions.conditionFilter) {
      result.push(extensionOptionConditionFilter);
    }

    if (mergedExtensions.multipleFilter) {
      result.push(extensionOptionMultipleFilter);
    }

    if (mergedExtensions.reset) {
      result.push(extensionOptionReset);
    }

    if (mergedExtensions.excel) {
      result.push(extensionOptionExcel);
    }

    if (mergedExtensions.CSV) {
      result.push(extensionOptionCSV);
    }

    if (mergedExtensions.fullScreen) {
      result.push(extensionOptionFullScreen);
    }

    return result;
  }, [
    extensionOptionCSV,
    extensionOptionConditionFilter,
    extensionOptionDeleteTemplate,
    extensionOptionDistinctFilter,
    extensionOptionExcel,
    extensionOptionFullScreen,
    extensionOptionGlobalTemplate,
    extensionOptionMultipleFilter,
    extensionOptionReset,
    extensionOptionSaveAsTemplate,
    extensionOptionSaveTemplate,
    mergedExtensions.CSV,
    mergedExtensions.conditionFilter,
    mergedExtensions.deleteTemplate,
    mergedExtensions.distinctFilter,
    mergedExtensions.excel,
    mergedExtensions.fullScreen,
    mergedExtensions.globalTemplate,
    mergedExtensions.multipleFilter,
    mergedExtensions.reset,
    mergedExtensions.saveAsTemplate,
    mergedExtensions.saveTemplate,
  ]);

  const onChangeRange = useCallback(
    (data) => {
      setDateFilter(data);

      if (isQuickSearchDatePicker) {
        getList({
          createdAtFrom: data[0].toISOString(),
          createdAtTo: data[1].toISOString(),
        });
      }
    },
    [getList, isQuickSearchDatePicker],
  );

  const handleGetListByDate = useCallback(() => {
    getList({
      createdAtFrom: dateFilter[0].toISOString(),
      createdAtTo: dateFilter[1].toISOString(),
    });
  }, [dateFilter, getList]);

  const setTypeRangeDate = useCallback(
    (type: string) => {
      handleSaveFilter({ typeRange: type });
      setTypeRange(type);
    },
    [handleSaveFilter],
  );

  const rangePicker = useMemo(() => {
    if (hasRangePicker) {
      return (
        <RangePickerFilter
          disable={loading}
          valueDateRange={dateFilter}
          onChangeRange={onChangeRange}
          handleGetList={handleGetListByDate}
          setTypeRange={setTypeRangeDate}
          typeRange={typeRange}
          className={datePickerClassName}
          isQuickSearchDatePicker={isQuickSearchDatePicker}
        />
      );
    }

    return null;
  }, [
    dateFilter,
    datePickerClassName,
    handleGetListByDate,
    hasRangePicker,
    isQuickSearchDatePicker,
    loading,
    onChangeRange,
    setTypeRangeDate,
    typeRange,
  ]);

  const handleSetPageSize = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      gridApi.paginationGoToPage(0);
      setPage(0);
    },
    [gridApi],
  );

  const onFilterChanged = useCallback((event: FilterChangedEvent) => {
    const filterModel = event.api.getFilterModel();
    setCurrentFilterModel(filterModel);
  }, []);

  const onPaginationChanged = useCallback((event: PaginationChangedEvent) => {
    const pageNumber = event.api.paginationGetCurrentPage();
    setPage(pageNumber);
  }, []);

  const onRowClick = useCallback(
    (event: RowClickedEvent) => {
      // @ts-ignore
      const cellClickedId = event.api.getFocusedCell()?.column?.colId;
      const selectedRows = event.api.getSelectedRows();
      if (
        selectedRows?.[0]?.id?.length > 0 &&
        (!preventRowEventWhenClickOn ||
          !preventRowEventWhenClickOn.includes(cellClickedId))
      ) {
        const isNewTab = view?.(selectedRows?.[0]?.id, selectedRows?.[0]);
        if (!isNewTab) {
          handleSaveFilter({
            columnsAGGrid: gridColumnApi?.getColumnState(),
            filterModel: currentFilterModel,
            page,
            pageSize,
            dateFilter,
            typeRange,
          });
        }
      }
    },
    [
      currentFilterModel,
      dateFilter,
      gridColumnApi,
      handleSaveFilter,
      page,
      pageSize,
      preventRowEventWhenClickOn,
      typeRange,
      view,
    ],
  );

  useEffectOnce(() => {
    if (!params?.isLeftMenu) {
      getList({
        createdAtFrom: dataFilter
          ? dataFilter?.dateFilter[0]?.toISOString()
          : DATE_DEFAULT[0].toISOString(),
        createdAtTo: dataFilter?.dateFilter[1]
          ? dataFilter?.dateFilter[1]?.toISOString()
          : DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          if (!hiddenTemplate) {
            dispatch(
              getListTemplateDictionaryActions.request({
                content: moduleTemplate,
              }),
            );
          }
        },
      });
    }
    return () => {
      clearData?.();
    };
  });

  useEffectOnce(() => {
    if (params?.isLeftMenu) {
      setDateFilter(DATE_DEFAULT);
      setTypeRange(TYPE_CUSTOM_RANGE);
      setPageSize(pageSizeDefault);
      setPage(0);
      gridApi?.paginationGoToPage(0);

      getList({
        createdAtFrom: DATE_DEFAULT[0].toISOString(),
        createdAtTo: DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          if (!hiddenTemplate) {
            dispatch(
              getListTemplateDictionaryActions.request({
                content: moduleTemplate,
              }),
            );
          }
        },
      });
    }
  });

  useEffect(() => {
    if (dataFilter?.pageSize && totalPage && isFirstSetDataFilter) {
      setIsFirstSetDataFilter(false);
      gridApi?.setFilterModel(dataFilter?.filterModel);
      gridApi?.paginationGoToPage(dataFilter?.page);
      setDateFilter([...dataFilter?.dateFilter]);

      if (dataFilter?.columnsAGGrid) {
        gridColumnApi?.applyColumnState({
          state: dataFilter?.columnsAGGrid,
          applyOrder: true,
        });
      }
    }
  }, [
    dataFilter?.columnsAGGrid,
    dataFilter?.dateFilter,
    dataFilter?.filterModel,
    dataFilter?.page,
    dataFilter?.pageSize,
    gridApi,
    gridColumnApi,
    isFirstSetDataFilter,
    totalPage,
  ]);

  useEffect(() => {
    gridApi?.paginationSetPageSize(Number(pageSize));
  }, [gridApi, pageSize]);

  useEffect(() => {
    if (templateDetail) {
      setTemplateID(templateDetail?.id);
      if (!dataFilter || !isFirstSetDataFilter) {
        setPage(0);
        setPageSize(pageSizeDefault);
        const template = templateDetail?.template
          ? JSON.parse(templateDetail?.template)
          : undefined;
        if (template) {
          gridApi?.setFilterModel(template.filterModel);
          gridColumnApi?.applyColumnState({
            state: template.columns,
            applyOrder: true,
          });
        }
      }
    }
  }, [
    dataFilter,
    gridApi,
    gridColumnApi,
    isFirstSetDataFilter,
    pageSizeDefault,
    templateDetail,
  ]);

  useEffect(() => {
    if (listTemplate?.data?.length === 0) {
      gridColumnApi?.resetColumnState();
      setColDef(colDefProp);
      gridApi?.setFilterModel(null);
    }
  }, [colDefProp, gridApi, gridColumnApi, listTemplate?.data?.length]);

  useEffect(
    () => () => {
      dispatch(clearTemplateDictionaryReducer());
    },
    [dispatch],
  );

  return (
    <div className={cx(styles.container, className)}>
      <div
        className={cx(
          'd-flex justify-content-between align-items-center',
          styles.header,
          classNameHeader,
        )}
      >
        <div className="d-flex align-items-center">
          <span className={cx('fw-bold ', styles.title)}>{title}</span>
          <div>{rangePicker}</div>
        </div>
        {objectReview}
        <div>{buttons}</div>
      </div>
      <AGGridTable
        isFullScreen={isFullScreen}
        loading={loading}
        extensionOptions={extensionOptions}
        onGridReady={onGridReady}
        height={height}
        rowData={dataTable}
        columnDefs={columnDefs}
        defaultColDef={colDef}
        templates={listTemplate?.data || []}
        pageSize={pageSize}
        setPageSize={handleSetPageSize}
        totalItem={dataTable?.length || 0}
        templateID={templateID}
        handleSetTemplateID={handleGetTemplate}
        handleDeleteTemplate={handleDeleteTemplate}
        onFilterChanged={onFilterChanged}
        onPaginationChanged={onPaginationChanged}
        rowSelection={rowSelection}
        suppressRowClickSelection={suppressRowClickSelection}
        onRowClicked={onRowClick}
        onSelectionChanged={onSelectionChanged}
        onFirstDataRendered={onFirstDataRendered}
        onRowSelected={onRowSelected}
        isRowSelectable={isRowSelectable}
        stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
        aggridId={aggridId}
        renderModalInside={
          <>
            <TemplateModal
              title={titleModal}
              isOpen={openTemplate}
              toggle={() => setOpenTemplate(false)}
              handleSave={handleSaveTemplate}
              templates={listTemplate?.data || []}
              dynamicLabels={dynamicLabels}
            />
            <ModalList
              data={listTemplate?.data || []}
              isOpen={modalOpen}
              toggle={() => setModalOpen(false)}
              templateModule={moduleTemplate}
              dynamicLabels={dynamicLabels}
            />
          </>
        }
      />
    </div>
  );
};

export default AGGridModule;
