import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
  PaginationChangedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import images from 'assets/images/images';
import cx from 'classnames';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import useEffectOnce from 'hoc/useEffectOnce';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
import { CommonQuery, WorkFlowType } from 'constants/common.const';
import {
  DATA_SPACE,
  DATE_DEFAULT,
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  TYPE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { CommonApiParam } from 'models/common.model';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListInspectionFollowUpActions,
  setDataFilterAction,
} from 'store/internal-audit-report/internal-audit-report.action';
import { LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-follow-up.const';
import {
  clearTemplateReducer,
  createTemplateActions,
  deleteTemplateActions,
  getListTemplateActions,
  getTemplateDetailActions,
  updateTemplateActions,
} from 'store/template/template.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import styles from '../../list-common.module.scss';

const InspectionFollowUpContainer = () => {
  const dispatch = useDispatch();
  const { loading, listInspectionFollowUp, params, dataFilter } = useSelector(
    (state) => state.internalAuditReport,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );

  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);
  const [pageSize, setPageSize] = useState(dataFilter?.pageSize || 20);
  const [page, setPage] = useState(dataFilter?.page > 0 ? dataFilter?.page : 0);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
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
  const totalPage = gridApi?.paginationGetTotalPages();

  const el = document.getElementById('ag-grid-table');
  const el2 = document.getElementById('ag-grid-table-theme');
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
    modulePage: ModulePage.List,
  });

  const onFullScreenChange = (event) => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
      el2.style.height = 'calc(100% - 36px)';
    } else {
      setIsFullScreen(false);
      el2.style.height = '100%';
    }
  };

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
          AppRouteConst.getInspectionFollowUpById(id),
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
        history.push(AppRouteConst.getInspectionFollowUpById(id));
      }
    },
    [
      handleSaveFilter,
      gridColumnApi,
      currentFilterModel,
      page,
      pageSize,
      dateFilter,
      typeRange,
    ],
  );

  const editDetail = useCallback(
    (id?: string) => {
      handleSaveFilter({
        columnsAGGrid: gridColumnApi?.getColumnState(),
        filterModel: currentFilterModel,
        page,
        pageSize,
        dateFilter,
        typeRange,
      });
      history.push(
        `${AppRouteConst.getInspectionFollowUpById(id)}${CommonQuery.EDIT}`,
      );
    },
    [
      handleSaveFilter,
      gridColumnApi,
      currentFilterModel,
      page,
      pageSize,
      dateFilter,
      typeRange,
    ],
  );

  const handleGetList = (params?: CommonApiParam) => {
    let newParams = handleFilterParams(params);
    if (params?.handleSuccess) {
      newParams = { ...newParams, handleSuccess: params?.handleSuccess };
    }
    dispatch(
      getListInspectionFollowUpActions.request({
        ...newParams,
        isRefreshLoading: true,
        pageSize: -1,
      }),
    );
  };

  useEffect(() => {
    if (listTemplate?.data?.length === 0) {
      gridColumnApi?.resetColumnState();
      setColDef(DEFAULT_COL_DEF);
      gridApi?.setFilterModel(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTemplate]);

  useEffect(() => {
    if (dataFilter?.pageSize && totalPage && isFirstSetDataFilter) {
      setIsFirstSetDataFilter(false);
      gridApi?.setFilterModel(dataFilter.filterModel);
      gridApi?.paginationGoToPage(dataFilter?.page);
      setDateFilter([...dataFilter?.dateFilter]);

      // eslint-disable-next-line no-unused-expressions
      dataFilter?.columnsAGGrid &&
        gridColumnApi?.applyColumnState({
          state: dataFilter.columnsAGGrid,
          applyOrder: true,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter, gridApi, totalPage]);

  useEffectOnce(() => {
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.INTERNAL_AUDIT_REPORT,
        isRefreshLoading: false,
      }),
    );
  });

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
              content: MODULE_TEMPLATE.inspectionFollowUp,
            }),
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.isLeftMenu]);

  useEffectOnce(() => {
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
              content: MODULE_TEMPLATE.inspectionFollowUp,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListInspectionFollowUpActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
  });

  useEffect(() => {
    gridApi?.paginationSetPageSize(Number(pageSize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  useEffect(() => {
    if (templateDetail && listTemplate?.data?.length > 0) {
      setTemplateID(templateDetail.id);
      if (!dataFilter || !isFirstSetDataFilter) {
        setPage(0);
        setPageSize(20);
        const template = JSON.parse(templateDetail.template);
        // eslint-disable-next-line no-unused-expressions
        template && gridApi?.setFilterModel(template.filterModel);
        // eslint-disable-next-line no-unused-expressions
        template &&
          gridColumnApi?.applyColumnState({
            state: template.columns,
            applyOrder: true,
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateDetail]);

  const getListByRelationship = useCallback((relationship, rofUsers) => {
    if (rofUsers?.length > 0) {
      const rofUserManager = rofUsers?.filter(
        (item) => item.relationship === relationship,
      );
      return rofUserManager.map((item) => item.username)?.join(', ');
    }
    return '-';
  }, []);

  const convertStatus = useCallback((status: string) => {
    if (status === 'CloseOut') {
      return 'Close out';
    }
    if (status === 'InProgress') {
      return 'In-progress';
    }
    return status;
  }, []);

  const dataTable = useMemo(() => {
    if (loading) {
      return null;
    }
    if (!listInspectionFollowUp?.data?.length) {
      return [];
    }
    return listInspectionFollowUp?.data?.map((item, index) => {
      const leadInspector = getListByRelationship(
        'leadAuditor',
        item?.rofUsers,
      );
      const totalNumberOfCap = item.totalAcceptCaps + item.totalDeniedCaps;
      return {
        id: item?.followUp?.id || DATA_SPACE,
        refId: item?.followUp?.refId || DATA_SPACE,
        rofRefId: item?.refNo || DATA_SPACE,
        entityType: item?.rofPlanningRequest?.auditCompanyName
          ? 'Office'
          : 'Vessel' || DATA_SPACE,
        vesselName: item?.rofPlanningRequest?.vesselName || DATA_SPACE,
        vesselType: item?.rofPlanningRequest?.vesselTypeName || DATA_SPACE,
        companyName: item?.rofPlanningRequest?.auditCompanyName || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        department:
          item?.rofPlanningRequest?.departments
            ?.map((i) => i.name)
            .join(', ') || DATA_SPACE,
        leadInspectorName: leadInspector || DATA_SPACE,
        status: convertStatus(item?.followUp?.status) || DATA_SPACE,
        globalStatus: item?.planningRequest?.globalStatus || DATA_SPACE,
        totalNumberOfCar: item?.totalCars || DATA_SPACE,
        totalNumberOfClosedCar: item?.totalCloseCars || DATA_SPACE,
        totalNumberOfCap: totalNumberOfCap || DATA_SPACE,
        totalNumberOfAcceptedCap: item?.totalAcceptCaps || DATA_SPACE,
        totalNumberOfDeniedCap: item?.totalDeniedCaps || DATA_SPACE,
        company: item?.company,
        vesselDocHolders: item?.planningRequest?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.planningRequest?.vessel?.vesselCharterers || [],
        vesselOwners: item?.planningRequest?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      };
    });
  }, [
    convertStatus,
    getListByRelationship,
    listInspectionFollowUp?.data,
    loading,
  ]);

  const handleDeleteTemplate = (templateId: string) => {
    dispatch(
      deleteTemplateActions.request({
        ids: [templateId],
        getList: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.inspectionFollowUp,
            }),
          );
        },
      }),
    );
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const renderActions = useCallback(
    (data) => {
      const isCurrentDoc = checkDocHolderChartererVesselOwner(
        {
          vesselDocHolders: data?.vesselDocHolders || [],
          vesselCharterers: data?.vesselCharterers || [],
          vesselOwners: data?.vesselOwners || [],
          createdAt: data?.createdAt,
        },
        userInfo,
      );

      const allowEdit =
        data?.status !== 'Close out' && !data.hiddenEdit && isCurrentDoc;

      return [
        {
          img: images.icons.icViewDetail,
          function: () => data && viewDetail(data?.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        allowEdit && {
          img: images.icons.icEdit,
          function: () => data && editDetail(data?.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
          action: ActionTypeEnum.VIEW,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => data && viewDetail(data?.id, true),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Green,
        },
      ]?.filter((item) => item);
    },
    [editDetail, userInfo, viewDetail],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          let actions = renderActions(data);

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
        field: 'refId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'rofRefId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['ROF Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'entityType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Company,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'department',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Department,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'leadInspectorName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Lead inspector name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'globalStatus',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Global status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'totalNumberOfCar',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Total number of CAR'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalNumberOfClosedCar',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
            'Total number of closed CAR'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalNumberOfCap',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Total number of CAP'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalNumberOfAcceptedCap',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
            'Total number of accepted CAP'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalNumberOfDeniedCap',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
            'Total number of denied CAP'
          ],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],

    [dynamicLabels, isMultiColumnFilter, renderActions],
  );

  const handleGetTemplate = (templateId: string) => {
    dispatch(getTemplateDetailActions.request({ templateId }));
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
        module: MODULE_TEMPLATE.inspectionFollowUp,
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

  const extensionOptions: ExtensionOption[] = [
    {
      label: TEXT_ACTION_TEMPLATE.saveTemplate,
      icon: images.icons.agGrid.icAGSave,
      onClick: () => {
        if (listTemplate?.data?.length > 0) {
          dispatch(
            updateTemplateActions.request({
              id: templateDetail.id,
              module: MODULE_TEMPLATE.inspectionFollowUp,
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
        setColDef(DEFAULT_COL_DEF);
        gridApi?.setFilterModel(null);
        setIsMultiColumnFilter(false);
      },
    },
    {
      label: TEXT_ACTION_TEMPLATE.excel,
      icon: images.icons.agGrid.icAGExcel,
      onClick: () =>
        gridApi?.exportDataAsExcel({
          fileName: 'Inspection follow up.xlsx',
        }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({
          fileName: 'Inspection follow up.csv',
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

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.INSPECTION_FOLLOW_UP}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
        )}
      />

      <RangePickerFilter
        disable={loading}
        valueDateRange={dateFilter}
        dynamicLabels={dynamicLabels}
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
        totalItem={listInspectionFollowUp?.data?.length || 0}
        templateID={templateID}
        handleSetTemplateID={handleGetTemplate}
        handleDeleteTemplate={handleDeleteTemplate}
        onFilterChanged={(event: FilterChangedEvent) => {
          const filterModel = event.api.getFilterModel();
          setCurrentFilterModel(filterModel);
        }}
        onPaginationChanged={(event: PaginationChangedEvent) => {
          const pageNumber = event.api.paginationGetCurrentPage();
          setPage(pageNumber);
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
              toggle={() => setOpenTemplate((p) => !p)}
              handleSave={handleSaveTemplate}
              templates={listTemplate?.data || []}
            />
            <ModalList
              data={listTemplate?.data || []}
              isOpen={modalOpen}
              toggle={setModalOpen}
              templateModule={MODULE_TEMPLATE.inspectionFollowUp}
            />
          </>
        }
      />
    </div>
  );
};

export default InspectionFollowUpContainer;
