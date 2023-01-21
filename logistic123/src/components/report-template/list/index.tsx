import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import {
  MODULE_TEMPLATE,
  TYPE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  DATA_SPACE,
  DEFAULT_COL_DEF_TYPE_FLEX,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import { useDispatch, useSelector } from 'react-redux';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import { ReportTemplateResponse } from 'models/api/report-template/report-template.model';

import {
  deleteReportTemplateActions,
  getListReportTemplateActions,
  setDataFilterAction,
} from 'store/report-template/report-template.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  getListTemplateActions,
  deleteTemplateActions,
  createTemplateActions,
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
  SelectionChangedEvent,
  PaginationChangedEvent,
} from 'ag-grid-community';
import PermissionCheck from 'hoc/withPermissionCheck';
import HeaderPage from 'components/common/header-page/HeaderPage';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { formatDateTime, dateStringComparator } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS } from 'constants/dynamic/report-template-master.const';
import styles from '../../list-common.module.scss';

const ReportTemplateContainer = () => {
  const dispatch = useDispatch();
  const { loading, listReportTemplates, params, dataFilter } = useSelector(
    (state) => state.ReportTemplate,
  );

  const { userInfo } = useSelector((state) => state.authenticate);

  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );

  const [page, setPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 20);
  const [content] = useState(params.content || '');
  const [status] = useState<string>(params?.status || 'all');
  const [auditEntity] = useState<string>(params?.auditEntity || 'all');
  const [sort] = useState<string>(params.sort || '');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [titleModal, setTitleModal] = useState('');
  const [openTemplate, setOpenTemplate] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF_TYPE_FLEX);
  const [templateID, setTemplateID] = useState(null);
  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    modulePage: ModulePage.List,
  });

  const totalPage = gridApi?.paginationGetTotalPages();

  const el2 = document.getElementById('ag-grid-table-theme');
  const el = document.getElementById('ag-grid-table');

  const handleSaveFilter = useCallback(
    (data: CommonApiParam) => {
      dispatch(setDataFilterAction(data));
    },
    [dispatch],
  );

  const viewDetail = useCallback(
    (id?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          AppRouteConst.ReportTemplateDetail(id),
          '_blank',
        );
        win.focus();
      } else {
        handleSaveFilter({
          columnsAGGrid: gridColumnApi?.getColumnState(),
          filterModel: currentFilterModel,
          page,
          pageSize,
          dateFilter,
          typeRange,
        });
        history.push(AppRouteConst.ReportTemplateDetail(id));
      }
    },
    [
      currentFilterModel,
      dateFilter,
      gridColumnApi,
      handleSaveFilter,
      page,
      pageSize,
      typeRange,
    ],
  );

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.ReportTemplateDetail(id)}?edit`);
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListReportTemplateActions.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (listTemplate?.data?.length === 0) {
      gridColumnApi?.resetColumnState();
      setColDef(DEFAULT_COL_DEF_TYPE_FLEX);
      gridApi?.setFilterModel(null);
    }
  }, [listTemplate, gridApi, gridColumnApi]);

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
    dataFilter,
    gridApi,
    gridColumnApi,
    isFirstSetDataFilter,
    listTemplate?.data?.length,
    templateDetail,
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
    // TODO: maybe this omits deps because of running on didMount. Need to check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // TODO: maybe this omits deps because of running on didMount. Need to check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteAudit = useCallback(
    (id: string) => {
      dispatch(
        deleteReportTemplateActions.request({
          id,
          getListReportTemplate: () => {
            if (page > 1 && listReportTemplates?.data?.length === 1) {
              setPage(page - 1);
              handleGetList({
                isRefreshLoading: false,
                page: page - 1,
                pageSize,
                content,
                sort,
                status: status?.toString(),
                auditEntity: auditEntity?.toString(),
              });
            } else {
              handleGetList({
                isRefreshLoading: false,
                page,
                pageSize,
                content,
                sort,
                status: status?.toString(),
                auditEntity: auditEntity?.toString(),
              });
            }
          },
        }),
      );
    },
    [
      auditEntity,
      content,
      dispatch,
      handleGetList,
      listReportTemplates,
      page,
      pageSize,
      sort,
      status,
    ],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS.Delete,
        ),
        onPressButtonRight: () => handleDeleteAudit(id),
      });
    },
    [dynamicFields, handleDeleteAudit],
  );

  const onFullScreenChange = (event) => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
      el2.style.height = 'calc(100% - 36px)';
    } else {
      setIsFullScreen(false);
      el2.style.height = '100%';
    }
  };

  const extensionOptions: ExtensionOption[] = [
    {
      label: TEXT_ACTION_TEMPLATE.saveTemplate,
      icon: images.icons.agGrid.icAGSave,
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
      icon: images.icons.agGrid.icAGSaveAs,
      onClick: () => {
        setTitleModal(TEXT_ACTION_TEMPLATE.saveAsTemplate);
        setOpenTemplate((p) => !p);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.deleteTemplate,
      icon: images.icons.agGrid.icAGDelete,
      onClick: () => setModalOpen(true),
    },
    {
      label: TEXT_ACTION_TEMPLATE.globalTemplate,
      icon: images.icons.agGrid.icAGGlobal,
      onClick: () => {
        setTitleModal(TEXT_ACTION_TEMPLATE.globalTemplate);
        setOpenTemplate((p) => !p);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.distinctFilter,
      icon: images.icons.agGrid.icAGDistinctFilter,
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
      icon: images.icons.agGrid.icAGConditionalFilter,
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
      icon: images.icons.agGrid.icAGMultipleFilter,
      onClick: () => {
        setIsMultiColumnFilter(true);
        setColDef({ ...colDef });
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.reset,
      icon: images.icons.agGrid.icAGReset,
      onClick: () => {
        gridColumnApi?.resetColumnState();
        setColDef(DEFAULT_COL_DEF_TYPE_FLEX);
        gridApi?.setFilterModel(null);
        setIsMultiColumnFilter(false);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.excel,
      icon: images.icons.agGrid.icAGExcel,
      onClick: () =>
        gridApi?.exportDataAsExcel({
          fileName: `${renderDynamicModuleLabel(
            listModuleDynamicLabels,
            DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
          )}.xlsx`,
        }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({
          fileName: `${renderDynamicModuleLabel(
            listModuleDynamicLabels,
            DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
          )}.csv`,
        }),
    },
    !isFullScreen && {
      label: TEXT_ACTION_TEMPLATE.fullScreen,
      icon: images.icons.agGrid.icAGFullScreen,
      onClick: () => {
        el.requestFullscreen();
        el.addEventListener('fullscreenchange', onFullScreenChange);
      },
    },
  ];

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const checkWorkflow = useCallback(
    (item: ReportTemplateResponse): Action[] => {
      let actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.REPORT_TEMPLATE,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
      ];
      if (userInfo?.mainCompanyId === item?.company?.id) {
        actions = [
          ...actions,
          {
            img: images.icons.icEdit,
            function: () => editDetail(item?.id),
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.REPORT_TEMPLATE,
            action: ActionTypeEnum.UPDATE,
            cssClass: 'me-1',
          },
          {
            img: images.icons.icRemove,
            function: () => handleDelete(item?.id),
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.REPORT_TEMPLATE,
            action: ActionTypeEnum.DELETE,
            buttonType: ButtonType.Orange,
            cssClass: 'me-1',
          },
        ];
      }

      actions = [
        ...actions,
        {
          img: images.icons.table.icNewTab,
          function: () => viewDetail(item?.id, true),
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.REPORT_TEMPLATE,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Green,
        },
      ];
      return actions;
    },
    [editDetail, handleDelete, userInfo?.mainCompanyId, viewDetail],
  );

  const dataTable = useMemo(
    () =>
      listReportTemplates?.data?.map((item) => ({
        id: item.id || DATA_SPACE,
        serialNumber: item.serialNumber || DATA_SPACE,
        entity: item?.auditEntity || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        createdAt: formatDateTime(item?.createdAt),
        createdUser: item?.createdUser?.username || DATA_SPACE,
        updatedAt: item?.updatedUser?.username
          ? formatDateTime(item?.updatedAt)
          : DATA_SPACE,
        updatedUser: item?.updatedUser?.username || DATA_SPACE,
        status: item?.status || DATA_SPACE,
        company: item?.company,
      })) || [],
    [listReportTemplates?.data],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;

          let actions = checkWorkflow(data);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'serialNumber',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Serial number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'entity',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicFields, isMultiColumnFilter, checkWorkflow],
  );

  const handleGetTemplate = (templateId: string) => {
    dispatch(getTemplateDetailActions.request({ templateId }));
  };
  const handleDeleteTemplate = (templateId: string) => {
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
  };

  const getTypeTemplate = (type: string, templateDetailType: string) => {
    if (type === TEXT_ACTION_TEMPLATE.globalTemplate)
      return TYPE_TEMPLATE.global;
    if (type === TEXT_ACTION_TEMPLATE.saveAsTemplate)
      return TYPE_TEMPLATE.template;
    return templateDetailType || TYPE_TEMPLATE.template;
  };

  const handleSaveTemplate = (templateName: string) => {
    dispatch(
      createTemplateActions.request({
        module: MODULE_TEMPLATE.reportTemplateMaster,
        type: getTypeTemplate(titleModal, templateDetail?.type),
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
  };

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.REPORT_TEMPLATE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
        )}
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
                  history.push(AppRouteConst.REPORT_TEMPLATE_CREATE);
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
                disabled={loading}
              >
                {renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_LIST_FIELDS['Create New'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <RangePickerFilter
        disable={loading}
        valueDateRange={dateFilter}
        onChangeRange={(data) => {
          setDateFilter(data);
        }}
        handleGetList={() =>
          handleGetList({
            createdAtFrom: dateFilter[0].toISOString(),
            createdAtTo: dateFilter[1].toISOString(),
          })
        }
        setTypeRange={(type: string) => {
          handleSaveFilter({ typeRange: type });
          setTypeRange(type);
        }}
        typeRange={typeRange}
      />

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
        onSelectionChanged={(event: SelectionChangedEvent) => {
          const selectedRows = event.api.getSelectedRows();

          if (selectedRows[0]?.id?.length > 0) {
            viewDetail(selectedRows[0].id);
          }
        }}
        renderModalInside={
          <>
            <TemplateModal
              title={titleModal}
              isOpen={openTemplate}
              loading={loading}
              toggle={() => setOpenTemplate((p) => !p)}
              handleSave={handleSaveTemplate}
              templates={listTemplate?.data || []}
            />
            <ModalList
              data={listTemplate?.data || []}
              isOpen={modalOpen}
              toggle={setModalOpen}
              templateModule={MODULE_TEMPLATE.reportTemplateMaster}
            />
          </>
        }
        dynamicLabels={dynamicFields}
      />
    </div>
  );
};

export default ReportTemplateContainer;
