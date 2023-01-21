import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import {
  MODULE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReportTemplateResponse } from 'models/api/report-template/report-template.model';

import { getListReportTemplateActions } from 'store/report-template/report-template.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  getListTemplateActions,
  deleteTemplateActions,
  updateTemplateActions,
  getTemplateDetailActions,
  clearTemplateReducer,
} from 'store/template/template.action';
import {
  ColumnApi,
  FilterChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  PaginationChangedEvent,
} from 'ag-grid-community';
import PermissionCheck from 'hoc/withPermissionCheck';
import HeaderPage from 'components/common/header-page/HeaderPage';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import TableFilter from 'components/common/table-filter/TableFilter';
import ModalModule from '../common/ModalModule';
import styles from '../../list-common.module.scss';

const ModuleManagementContainer = () => {
  const { t } = useTranslation(I18nNamespace.MODULE_MANAGEMENT);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>(undefined);
  const el = useRef(null);
  const el2 = useRef(null);

  const dispatch = useDispatch();
  const { loading, listReportTemplates, params, dataFilter } = useSelector(
    (state) => state.ReportTemplate,
  );

  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  // [NhatPD]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 20);
  const [content, setContent] = useState(params.content || '');
  const [status, setStatus] = useState<string>(params?.status || 'all');
  // [NhatPD]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sort, setSort] = useState<string>(params.sort || '');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  // [NhatPD]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [titleModal, setTitleModal] = useState('');
  // [NhatPD]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openTemplate, setOpenTemplate] = useState(false);
  // [NhatPD]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF_TYPE_FLEX);
  const [templateID, setTemplateID] = useState(null);
  // [NhatPD]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  // [NhatPD]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);

  const totalPage = gridApi?.paginationGetTotalPages();

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.ReportTemplateDetail(id)}?edit`);
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListReportTemplateActions.request(newParams));
    },
    [dispatch],
  );

  useEffect(() => {
    // Only access DOM when component mounted
    el2.current = document.getElementById('ag-grid-table-theme');
    el.current = document.getElementById('ag-grid-table');
  }, []);

  useEffect(() => {
    if (listTemplate?.data?.length === 0) {
      gridColumnApi?.resetColumnState();
      setColDef(DEFAULT_COL_DEF_TYPE_FLEX);
      gridApi?.setFilterModel(null);
    }
  }, [listTemplate, gridColumnApi, gridApi]);

  useEffect(() => {
    if (dataFilter?.pageSize && totalPage && isFirstSetDataFilter) {
      setIsFirstSetDataFilter(false);
      gridApi?.setFilterModel(dataFilter.filterModel);
      gridApi?.paginationGoToPage(dataFilter?.page);
      setDateFilter([...dataFilter?.dateFilter]);

      if (dataFilter?.columnsAGGrid) {
        gridColumnApi?.applyColumnState({
          state: dataFilter.columnsAGGrid,
          applyOrder: true,
        });
      }
    }
  }, [dataFilter, gridApi, totalPage, gridColumnApi, isFirstSetDataFilter]);

  useEffect(() => {
    if (templateDetail && listTemplate?.data?.length > 0) {
      setTemplateID(templateDetail.id);
      if (!dataFilter || !isFirstSetDataFilter) {
        setPage(0);
        setPageSize(20);
        const template = JSON.parse(templateDetail.template);

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
    templateDetail,
    dataFilter,
    isFirstSetDataFilter,
    gridApi,
    gridColumnApi,
    listTemplate?.data?.length,
  ]);

  useEffect(() => {
    if (params?.isLeftMenu) {
      setDateFilter(DATE_DEFAULT);
      setTypeRange(TYPE_CUSTOM_RANGE);
      setPageSize(20);
      setPage(0);
      gridApi?.paginationGoToPage(0);
      handleGetList({
        createdAtFrom: DATE_DEFAULT[0].toISOString(),
        createdAtTo: DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.reportTemplateMaster,
            }),
          );
        },
      });
    }
  }, [params?.isLeftMenu, gridApi, dispatch, handleGetList]);

  useEffect(() => {
    if (!params?.isLeftMenu) {
      handleGetList({
        createdAtFrom: dataFilter?.dateFilter[0]
          ? dataFilter?.dateFilter[0]?.toISOString()
          : DATE_DEFAULT[0].toISOString(),
        createdAtTo: dataFilter?.dateFilter[1]
          ? dataFilter?.dateFilter[1]?.toISOString()
          : DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.reportTemplateMaster,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListReportTemplateActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
  }, [dataFilter?.dateFilter, handleGetList, dispatch, params?.isLeftMenu]);

  const handleChangeSearchValue = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case 'search':
          setContent(value);
          break;
        case 'status':
          setStatus(value);
          break;
        default:
          setContent(value);
      }
    },
    [],
  );

  const handleClearSearchValue = useCallback(() => {
    setContent('');
    setStatus('all');
    setPage(1);
    setPageSize(20);
    setSort('');
    handleGetList({});
  }, [handleGetList]);

  const handleGetListSearch = useCallback(() => {
    setPage(1);
    setSort('');
    if (!content && status === 'all') {
      setPageSize(20);
      handleGetList({
        isRefreshLoading: undefined,
        status: status.toString(),
        pageSize: 20,
        content,
      });
    } else {
      handleGetList({
        isRefreshLoading: undefined,
        status: status.toString(),
        pageSize,
        content,
      });
    }
  }, [content, pageSize, status, handleGetList]);

  const onFullScreenChange = useCallback((event) => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
      el2.current.style.height = 'calc(100% - 36px)';
    } else {
      setIsFullScreen(false);
      el2.current.style.height = '100%';
    }
  }, []);

  // TODO: check why using useMemo broads an error
  const extensionOptions: ExtensionOption[] = [
    {
      label: TEXT_ACTION_TEMPLATE.saveTemplate,
      icon: images.icons.table.icSave,
      onClick: () => {
        if (listTemplate?.data?.length > 0) {
          dispatch(
            updateTemplateActions.request({
              id: templateDetail.id,
              module: MODULE_TEMPLATE.reportTemplateMaster,
              type: templateDetail.type,
              name: templateDetail.name,
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
          setTitleModal(TEXT_ACTION_TEMPLATE.saveTemplate);
          setOpenTemplate((p) => !p);
        }
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.saveAsTemplate,
      icon: images.icons.table.icSaveAs,
      onClick: () => {
        setTitleModal(TEXT_ACTION_TEMPLATE.saveAsTemplate);
        setOpenTemplate((p) => !p);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.deleteTemplate,
      icon: images.icons.table.icRecycle,
      onClick: () => setModalOpen(true),
    },
    {
      label: TEXT_ACTION_TEMPLATE.globalTemplate,
      icon: images.icons.table.icTemplate,
      onClick: () => {
        setTitleModal(TEXT_ACTION_TEMPLATE.globalTemplate);
        setOpenTemplate((p) => !p);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.distinctFilter,
      icon: images.icons.table.icDistinct,
      onClick: () => {
        const columnDefs = gridApi.getColumnDefs();
        columnDefs.forEach((colDef: ColDef, index) => {
          // eslint-disable-next-line no-param-reassign
          colDef.floatingFilter = false;
        });
        gridApi.setColumnDefs(columnDefs);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.conditionFilter,
      icon: images.icons.table.icConditionFilter,
      onClick: () => {
        const columnDefs = gridApi.getColumnDefs();
        columnDefs.forEach((colDef: ColDef, index) => {
          // eslint-disable-next-line no-param-reassign
          colDef.floatingFilter = true;
        });
        gridApi.setColumnDefs(columnDefs);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.multipleFilter,
      icon: images.icons.table.icMultipleFilter,
      onClick: () => {
        setIsMultiColumnFilter(true);
        setColDef({ ...colDef });
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.reset,
      icon: images.icons.table.icReset,
      onClick: () => {
        gridColumnApi?.resetColumnState();
        setColDef(DEFAULT_COL_DEF_TYPE_FLEX);
        gridApi?.setFilterModel(null);
        setIsMultiColumnFilter(false);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.excel,
      icon: images.icons.table.icExcel,
      onClick: () =>
        gridApi?.exportDataAsExcel({ fileName: 'Module Management.xlsx' }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.table.icCSV,
      onClick: () =>
        gridApi?.exportDataAsCsv({ fileName: 'Module Management.csv' }),
    },
    !isFullScreen && {
      label: TEXT_ACTION_TEMPLATE.fullScreen,
      icon: images.icons.table.icFullScreen,
      onClick: () => {
        el.current.requestFullscreen();
        el.current.addEventListener('fullscreenchange', onFullScreenChange);
      },
    },
  ];

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }, []);

  const checkWorkflow = useCallback(
    (item: ReportTemplateResponse): Action[] => {
      const actions: Action[] = [
        {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.REPORT_TEMPLATE,
          action: ActionTypeEnum.UPDATE,
        },
      ];
      return actions;
    },
    [editDetail],
  );

  const dataTable = useMemo(
    () =>
      listReportTemplates?.data?.map((item) => ({
        id: item.id,
        serialNumber: '1.2.3',
        moduleName: 'Dashboard',
        moduleType: 'Tab',
        description: 'Loren ipsum',
        createdAt: formatDateTime(item?.createdAt),
        createdUser: item?.createdUser?.username,
        updatedAt: item?.updatedUser?.username
          ? formatDateTime(item?.updatedAt)
          : '',
        updatedUser: item?.updatedUser?.username,
        status: item.status,
      })) || [],
    [listReportTemplates?.data],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;

          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={checkWorkflow(data)} />
            </div>
          );
        },
      },
      {
        field: 'serialNumber',
        headerName: t('serialNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'moduleName',
        headerName: t('moduleName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'moduleType',
        headerName: t('moduleType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: t('description'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: t('createdDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: t('createdUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: t('updatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: t('updatedUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
  );

  const handleGetTemplate = useCallback(
    (templateId: string) => {
      dispatch(getTemplateDetailActions.request({ templateId }));
    },
    [dispatch],
  );
  const handleDeleteTemplate = useCallback(
    (templateId: string) => {
      dispatch(
        deleteTemplateActions.request({
          ids: [templateId],
          getList: () => {
            dispatch(
              getListTemplateActions.request({
                content: MODULE_TEMPLATE.reportTemplateMaster,
              }),
            );
          },
        }),
      );
    },
    [dispatch],
  );

  const onSubmitForm = useCallback((formData) => {
    // [NhatPD]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isNew, resetForm, ...other } = formData;
  }, []);

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.MODULE_MANAGEMENT}
        titlePage={t('ModuleManagementTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.REPORT_TEMPLATE,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  setVisibleModal(true);
                  setIsCreate(true);
                  setSelectedData(undefined);
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icEdit}
                    alt="edit"
                    className={styles.icButton}
                  />
                }
                disabled={loading}
              >
                {t('edit')}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <TableFilter
        disable={loading}
        content={content}
        status={status}
        handleChangeSearchValue={handleChangeSearchValue}
        handleClearSearchValue={handleClearSearchValue}
        handleGetList={handleGetListSearch}
      />

      <div className={styles.wrapTable}>
        <AGGridTable
          isFullScreen={isFullScreen}
          loading={loading}
          extensionOptions={extensionOptions}
          onGridReady={onGridReady}
          height="calc(100vh - 188px)"
          rowData={dataTable}
          columnDefs={columnDefs}
          defaultColDef={colDef}
          templates={listTemplate?.data || []}
          pageSize={pageSize}
          setPageSize={(newPageSize: number) => {
            setPageSize(newPageSize);
            gridApi.paginationGoToPage(0);
            setPage(0);
          }}
          onPaginationChanged={(event: PaginationChangedEvent) => {
            const pageNumber = event.api.paginationGetCurrentPage();
            setPage(pageNumber);
          }}
          totalItem={listReportTemplates?.totalItem}
          templateID={templateID}
          handleSetTemplateID={handleGetTemplate}
          handleDeleteTemplate={handleDeleteTemplate}
          onFilterChanged={(event: FilterChangedEvent) => {
            const filterModel = event.api.getFilterModel();
            setCurrentFilterModel(filterModel);
          }}
          rowSelection="single"
        />
        <ModalModule
          title={t('moduleInformation')}
          isOpen={visibleModal}
          loading={loading}
          toggle={() => {
            setVisibleModal((e) => !e);
            setSelectedData(undefined);
            setIsCreate(undefined);
          }}
          isCreate={isCreate}
          handleSubmitForm={onSubmitForm}
          data={selectedData}
          setIsCreate={(value) => setIsCreate(value)}
        />
      </div>
    </div>
  );
};

export default ModuleManagementContainer;
