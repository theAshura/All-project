import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import cx from 'classnames';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import { AuditWorkspaceStatus, CommonQuery } from 'constants/common.const';
import moment from 'moment';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListAuditInspectionWorkspaceActions,
  setDataFilterAction,
} from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import upperFirst from 'lodash/upperFirst';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { dateStringComparator } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  clearTemplateReducer,
  createTemplateActions,
  deleteTemplateActions,
  getListTemplateActions,
  getTemplateDetailActions,
  updateTemplateActions,
} from 'store/template/template.action';
import {
  DATE_DEFAULT,
  DEFAULT_COL_DEF,
  DATA_SPACE,
  MODULE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  TYPE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  GridApi,
  PaginationChangedEvent,
  GridReadyEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import { convertStatus } from '../helpers/convertStatus.helper';
import styles from '../../list-common.module.scss';

const AuditInspectionWorkspaceContainer = () => {
  const dispatch = useDispatch();
  const { loading, listAuditInspectionWorkspaces, params, dataFilter } =
    useSelector((state) => state.auditInspectionWorkspace);

  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionWorkspace,
    modulePage: ModulePage.List,
  });
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);
  const [page, setPage] = useState(dataFilter?.page > 0 ? dataFilter?.page : 0);
  const [pageSize, setPageSize] = useState(dataFilter?.pageSize || 20);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [titleModal, setTitleModal] = useState('');
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const totalPage = gridApi?.paginationGetTotalPages();

  const el = document.getElementById('ag-grid-table');
  const el2 = document.getElementById('ag-grid-table-theme');

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
          AppRouteConst.getAuditInspectionWorkspaceById(id),
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
        history.push(AppRouteConst.getAuditInspectionWorkspaceById(id));
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
        `${AppRouteConst.getAuditInspectionWorkspaceById(id)}${
          CommonQuery.EDIT
        }`,
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
    const { handleSuccess, ...other } = params;
    let newParams = handleFilterParams(other);
    if (handleSuccess) {
      newParams = { ...newParams, handleSuccess };
    }
    dispatch(
      getListAuditInspectionWorkspaceActions.request({
        ...newParams,
        isRefreshLoading: true,
        pageSize: -1,
      }),
    );
  };

  useEffect(() => {
    if (params?.isLeftMenu) {
      setDateFilter(DATE_DEFAULT);
      setTypeRange(TYPE_CUSTOM_RANGE);
      setPageSize(20);
      setPage(0);
      handleGetList({
        createdAtFrom: DATE_DEFAULT[0].toISOString(),
        createdAtTo: DATE_DEFAULT[1].toISOString(),
        handleSuccess: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.auditInspectionWorkspace,
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
              content: MODULE_TEMPLATE.auditInspectionWorkspace,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListAuditInspectionWorkspaceActions.success({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateDetail]);

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

      if (dataFilter?.columnsAGGrid) {
        gridColumnApi?.applyColumnState({
          state: dataFilter.columnsAGGrid,
          applyOrder: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter, gridApi, totalPage]);

  const dataTable = useMemo(
    () =>
      listAuditInspectionWorkspaces?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        refNo: item.refNo || DATA_SPACE,
        auditNo: item?.planningRequest?.auditNo || DATA_SPACE,
        fleetName: item?.vessel?.fleet?.name || DATA_SPACE,
        vesselName: item?.vessel?.name || DATA_SPACE,
        vesselTypeName: item?.vessel?.vesselType?.name || DATA_SPACE,
        status: convertStatus(item.status),
        globalStatus: item?.planningRequest?.globalStatus || DATA_SPACE,
        vesselCountryFlag: item?.vessel?.countryFlag || DATA_SPACE,
        createdAt: item?.createdAt
          ? moment(item?.createdAt).local().format('DD/MM/YYYY HH:mm')
          : '',
        createdUser: item?.createdUser?.username || DATA_SPACE,
        updatedAt:
          (item?.updatedUser?.username &&
            moment(item?.updatedAt).local().format('DD/MM/YYYY HH:mm')) ||
          DATA_SPACE,
        updatedUser: item?.updatedUser?.username || DATA_SPACE,
        switchStatus: upperFirst(item.switchStatus),
        auditors: item?.auditors || DATA_SPACE,
        entityType: item?.entityType || DATA_SPACE,
        company: item?.planningRequest?.auditCompany?.name || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        department:
          item?.planningRequest?.departments?.map((i) => i.name).join(', ') ||
          DATA_SPACE,
        companyObject: item?.company,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createAtOriginal: item?.createdAt,
      })) || [],
    [listAuditInspectionWorkspaces?.data],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Action,
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
          const isCurrentDoc = checkDocHolderChartererVesselOwner(
            { ...data, createdAt: data?.createAtOriginal },
            userInfo,
          );

          const isCompany = userInfo?.mainCompanyId === data?.companyObject?.id;

          const allowEdit =
            data?.status !== AuditWorkspaceStatus.SUBMITTED &&
            data?.auditors?.includes(userInfo?.id) &&
            isCompany &&
            isCurrentDoc;

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => data && viewDetail(data?.id),
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            allowEdit && {
              img: images.icons.icEdit,
              function: () => data && editDetail(data?.id),
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'me-1',
            },
            {
              img: images.icons.table.icNewTab,
              function: () => data && viewDetail(data?.id, true),
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.PLANNING_AND_REQUEST,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Green,
            },
          ]?.filter((item) => item);

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
        field: 'refNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Plan ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fleetName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Fleet name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselTypeName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Status,
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
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Global status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'vesselCountryFlag',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Flag,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Updated date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'switchStatus',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Switch status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'entityType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Company,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'department',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Department,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, userInfo, viewDetail, editDetail],
  );

  const extensionOptions: ExtensionOption[] = [
    {
      label: TEXT_ACTION_TEMPLATE.saveTemplate,
      icon: images.icons.agGrid.icAGSave,
      onClick: () => {
        if (listTemplate?.data?.length > 0) {
          dispatch(
            updateTemplateActions.request({
              id: templateDetail.id,
              module: MODULE_TEMPLATE.auditInspectionWorkspace,
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
          fileName: 'Inspection Workspace.xlsx',
        }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({
          fileName: 'Inspection Workspace.csv',
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
        module: MODULE_TEMPLATE.auditInspectionWorkspace,
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
              content: MODULE_TEMPLATE.auditInspectionWorkspace,
            }),
          );
        },
      }),
    );
  };

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.AUDIT_INSPECTION_WORKSPACE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionInspectionWorkspace,
        )}
      />

      <div>
        <RangePickerFilter
          disable={loading}
          dynamicLabels={dynamicLabels}
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
      </div>
      <AGGridTable
        loading={loading}
        isFullScreen={isFullScreen}
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
        totalItem={listAuditInspectionWorkspaces?.totalItem}
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
          if (selectedRows[0]?.id?.length > 0) viewDetail(selectedRows[0].id);
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
              templateModule={MODULE_TEMPLATE.auditInspectionWorkspace}
            />
          </>
        }
      />
    </div>
  );
};

export default AuditInspectionWorkspaceContainer;
