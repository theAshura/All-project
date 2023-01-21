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
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DATA_SPACE,
  DATE_DEFAULT,
  DEFAULT_COL_DEF,
  DEFAULT_COL_DEF_TYPE_FLEX,
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
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteMailManagementActions,
  getListMailManagementActions,
  setDataFilterAction,
} from 'store/mail-management/mail-management.action';
import {
  clearTemplateReducer,
  createTemplateActions,
  deleteTemplateActions,
  getListTemplateActions,
  getTemplateDetailActions,
  updateTemplateActions,
} from 'store/template/template.action';
import { MENTION_TIME, MENTIONS, CommonQuery } from 'constants/common.const';
import { converterMentionsHtmlToString } from 'helpers/mentions.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS } from 'constants/dynamic/mailTemplate.const';
import styles from '../../list-common.module.scss';

const MailManagementContainer = () => {
  const dispatch = useDispatch();

  const { loading, listMailManagement, params, dataFilter } = useSelector(
    (state) => state.mailManagement,
  );
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);

  const [pageSize, setPageSize] = useState(dataFilter?.pageSize || 20);
  const [page, setPage] = useState(dataFilter?.page > 0 ? dataFilter?.page : 0);

  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [titleModal, setTitleModal] = useState('');
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [colDef, setColDef] = useState(
    window.innerWidth < 1450 ? DEFAULT_COL_DEF : DEFAULT_COL_DEF_TYPE_FLEX,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const totalPage = gridApi?.paginationGetTotalPages();
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
    modulePage: ModulePage.List,
  });

  const el = document.getElementById('ag-grid-table');
  const el2 = document.getElementById('ag-grid-table-theme');

  const onFullScreenChange = useCallback(
    (event) => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
        el2.style.height = 'calc(100% - 36px)';
      } else {
        setIsFullScreen(false);
        el2.style.height = '100%';
      }
    },
    [el2?.style],
  );

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
          AppRouteConst.getMailManagementById(id),
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
        history.push(AppRouteConst.getMailManagementById(id), 'view');
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
        `${AppRouteConst.getMailManagementById(id)}${CommonQuery.EDIT}`,
        'edit',
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

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListMailManagementActions.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (listTemplate?.data?.length === 0) {
      gridColumnApi?.resetColumnState();
      setColDef(
        window.innerWidth < 1450 ? DEFAULT_COL_DEF : DEFAULT_COL_DEF_TYPE_FLEX,
      );
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
              content: MODULE_TEMPLATE.mailManagement,
            }),
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.isLeftMenu]);

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
              content: MODULE_TEMPLATE.mailManagement,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListMailManagementActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
      // el.removeEventListener('fullscreenchange', onFullScreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteMailManagement = useCallback(
    (id: string) => {
      dispatch(
        deleteMailManagementActions.request({
          id,
          handleSuccess: () => {
            handleGetList({
              createdAtFrom: dateFilter[0].toISOString(),
              createdAtTo: dateFilter[1].toISOString(),
            });
          },
        }),
      );
    },
    [dateFilter, dispatch, handleGetList],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS.Delete,
        ),
        onPressButtonRight: () => handleDeleteMailManagement(id),
      });
    },
    [dynamicFields, handleDeleteMailManagement],
  );

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

  const handleSaveTemplate = useCallback(
    (templateName: string) => {
      dispatch(
        createTemplateActions.request({
          module: MODULE_TEMPLATE.mailManagement,
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
    },
    [
      currentFilterModel,
      dispatch,
      gridColumnApi,
      templateDetail?.type,
      titleModal,
    ],
  );

  const handleGetTemplate = useCallback(
    (templateId: string) => {
      dispatch(getTemplateDetailActions.request({ templateId }));
    },
    [dispatch],
  );

  const handleDeleteTemplate = (templateId: string) => {
    dispatch(
      deleteTemplateActions.request({
        ids: [templateId],
        getList: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.mailManagement,
            }),
          );
        },
      }),
    );
  };

  const extensionOptions: ExtensionOption[] = useMemo(
    () =>
      [
        {
          label: TEXT_ACTION_TEMPLATE.saveTemplate,
          icon: images.icons.agGrid.icAGSave,
          onClick: () => {
            if (listTemplate?.data?.length > 0) {
              dispatch(
                updateTemplateActions.request({
                  id: templateDetail?.id,
                  module: MODULE_TEMPLATE.mailManagement,
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
            setColDef(
              window.innerWidth < 1450
                ? DEFAULT_COL_DEF
                : DEFAULT_COL_DEF_TYPE_FLEX,
            );
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
                DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
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
                DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
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
      ]?.filter((item) => item),
    [
      colDef,
      currentFilterModel,
      dispatch,
      el,
      gridApi,
      gridColumnApi,
      isFullScreen,
      listModuleDynamicLabels,
      listTemplate?.data?.length,
      onFullScreenChange,
      templateDetail?.id,
      templateDetail?.name,
      templateDetail?.type,
    ],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS.Action,
        ),
        filter: false,
        enableRowGroup: false,
        sortable: false,
        minWidth: 125,
        maxWidth: 125,
        lockPosition: true,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;

          const isCompany = userInfo?.mainCompanyId === data?.company?.id;

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => data && viewDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.MAIL_MANAGEMENT,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            isCompany && {
              img: images.icons.icEdit,
              function: () => data && editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.MAIL_MANAGEMENT,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'me-1',
            },
          ];
          const isCreator = userInfo?.id === data?.createdUserId;
          if (isCreator && isCompany) {
            actions = [
              ...actions,

              {
                img: images.icons.icRemove,
                function: () => data && handleDelete(data?.id),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.MAIL_MANAGEMENT,
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
              function: () => data && viewDetail(data?.id, true),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.MAIL_MANAGEMENT,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Green,
            },
          ];
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
        field: 'mailTemplateCode',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS['Mail template code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS['Mail template name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'mailType',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS['Mail type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },

      {
        field: 'to',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS.To,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'subject',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS.Subject,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicFields,
          MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicFields,
      isMultiColumnFilter,
      userInfo?.mainCompanyId,
      userInfo?.id,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  const dataTable = useMemo(
    () =>
      listMailManagement?.data?.map((item) => ({
        id: item?.id || DATA_SPACE,
        name: item?.name || DATA_SPACE,
        mailTemplateCode: item?.code || DATA_SPACE,
        mailType: item.mailType?.name || DATA_SPACE,
        status: item.status || DATA_SPACE,
        to: item?.to?.join(', ') || DATA_SPACE,
        subject:
          converterMentionsHtmlToString(
            item?.sub,
            MENTIONS.concat(MENTION_TIME),
          ) || DATA_SPACE,

        createdUserId: item?.createdUserId,
        createCompanyName: item?.company?.name || DATA_SPACE,
        company: item?.company,
      })) || [],
    [listMailManagement?.data],
  );
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.MAIL_MANAGEMENT}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.MAIL_MANAGEMENT,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() =>
                  history.push(AppRouteConst.MAIL_MANAGEMENT_CREATE)
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
                  MAIL_TEMPLATE_DYNAMIC_LIST_FIELDS['Create New'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <AGGridTable
        isFullScreen={isFullScreen}
        loading={loading}
        extensionOptions={extensionOptions}
        onGridReady={onGridReady}
        height="calc(100vh - 137px)"
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
        totalItem={listMailManagement?.totalItem}
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
          // eslint-disable-next-line no-unused-expressions
          selectedRows[0]?.id?.length > 0 && viewDetail(selectedRows[0].id);
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
              templateModule={MODULE_TEMPLATE.auditTimeTable}
            />
          </>
        }
        dynamicLabels={dynamicFields}
      />
    </div>
  );
};

export default MailManagementContainer;
