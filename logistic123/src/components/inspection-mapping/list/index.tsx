import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import { CommonQuery } from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';

import { InspectionMapping } from 'models/api/inspection-mapping/inspection-mapping.model';
import {
  deleteInspectionMappingActions,
  getListInspectionMappingActions,
  setDataFilterAction,
} from 'store/inspection-mapping/inspection-mapping.action';
import useEffectOnce from 'hoc/useEffectOnce';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
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
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  DATA_SPACE,
  TYPE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import HeaderPage from 'components/common/header-page/HeaderPage';
import upperFirst from 'lodash/upperFirst';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import { formatDateTime, dateStringComparator } from 'helpers/utils.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { INSPECTION_MAPPING_LIST_DYNAMIC_LABELS } from 'constants/dynamic/inspectionMapping.const';
import styles from '../../list-common.module.scss';

const InspectionMappingContainer = () => {
  const dispatch = useDispatch();

  const { loading, listInspectionMappings, params, dataFilter } = useSelector(
    (state) => state.inspectionMapping,
  );
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const [page, setPage] = useState(params?.page || 1);
  const [pageSize, setPageSize] = useState(
    params?.pageSize && params?.pageSize !== -1 ? params?.pageSize : 20,
  );
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [titleModal, setTitleModal] = useState('');
  const [openTemplate, setOpenTemplate] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [templateID, setTemplateID] = useState(null);
  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );

  const totalPage = gridApi?.paginationGetTotalPages();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
    modulePage: ModulePage.List,
  });

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
          AppRouteConst.getInspectionMappingById(id),
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
        history.push(AppRouteConst.getInspectionMappingById(id));
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
    history.push(
      `${AppRouteConst.getInspectionMappingById(id)}${CommonQuery.EDIT}`,
    );
  }, []);

  const handleGetList = (params?: CommonApiParam) => {
    const newParams = handleFilterParams(params);
    dispatch(
      getListInspectionMappingActions.request({ ...newParams, pageSize: -1 }),
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

      if (dataFilter?.columnsAGGrid) {
        gridColumnApi?.applyColumnState({
          state: dataFilter.columnsAGGrid,
          applyOrder: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter, gridApi, totalPage]);

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
              content: MODULE_TEMPLATE.inspectionMapping,
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
              content: MODULE_TEMPLATE.inspectionMapping,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListInspectionMappingActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
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

  const handleDeleteInspectionMapping = (id: string) => {
    dispatch(
      deleteInspectionMappingActions.request({
        id,
        getListInspectionMapping: () => {
          handleGetList({
            createdAtFrom: dateFilter[0].toISOString(),
            createdAtTo: dateFilter[1].toISOString(),
          });
        },
      }),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id: string) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Confirmation?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_LIST_DYNAMIC_LABELS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_LIST_DYNAMIC_LABELS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFields,
        INSPECTION_MAPPING_LIST_DYNAMIC_LABELS.Delete,
      ),
      onPressButtonRight: () => handleDeleteInspectionMapping(id),
    });
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
              module: MODULE_TEMPLATE.inspectionMapping,
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
          fileName: `${renderDynamicModuleLabel(
            listModuleDynamicLabels,
            DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
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
            DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
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

  const checkWorkflow = useCallback(
    (item: InspectionMapping): Action[] => {
      const isCompany = userInfo?.mainCompanyId === item?.company?.id;
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTION_MAPPING,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        isCompany && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTION_MAPPING,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        isCompany && {
          img: images.icons.icRemove,
          function: () => handleDelete(item?.id),
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTION_MAPPING,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => viewDetail(item?.id, true),
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.INSPECTION_MAPPING,
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
      listInspectionMappings?.data?.map((item) => ({
        id: item.id || DATA_SPACE,
        scope: upperFirst(item?.scope),
        auditType: item?.auditType?.name || DATA_SPACE,
        auditPeriod: item?.auditPeriod || DATA_SPACE,
        // shipNoYes: item?.applicableShip ? 'Yes' : 'No',
        // shoreNoYes: item?.applicableShore ? 'Yes' : 'No',
        // shoreApprovalRequired: item?.shoreApprovalRequired ? 'Yes' : 'No',
        natureFinding:
          item?.natureFindings[0]?.natureFinding?.name || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        createdAt: formatDateTime(item?.createdAt),
        createdUser: item?.createdUser?.username || DATA_SPACE,
        updatedAt:
          (item.updatedUser?.username && formatDateTime(item?.updatedAt)) ||
          DATA_SPACE,
        updatedUser: item?.updatedUser?.username || DATA_SPACE,
        status: item?.status || DATA_SPACE,
        company: item?.company,
      })) || [],
    [listInspectionMappings?.data],
  );
  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS.Action,
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
        field: 'scope',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS.Scope,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditType',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditPeriod',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Inspection period (in days)'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'natureFinding',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Mark primary'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Created date'],
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
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Updated date'],
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
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS.Status,
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
          INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Created by company'],
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
              content: MODULE_TEMPLATE.inspectionMapping,
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
        module: MODULE_TEMPLATE.inspectionMapping,
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
        breadCrumb={BREAD_CRUMB.INSPECTION_MAPPING}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.INSPECTION_MAPPING, // fix after
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() =>
                  history.push(AppRouteConst.INSPECTION_MAPPING_CREATE)
                }
                disabled={loading}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {renderDynamicLabel(
                  dynamicFields,
                  INSPECTION_MAPPING_LIST_DYNAMIC_LABELS['Create New'],
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
        totalItem={listInspectionMappings?.totalItem}
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
              templateModule={MODULE_TEMPLATE.inspectionMapping}
            />
          </>
        }
        dynamicLabels={dynamicFields}
      />
    </div>
  );
};

export default InspectionMappingContainer;
