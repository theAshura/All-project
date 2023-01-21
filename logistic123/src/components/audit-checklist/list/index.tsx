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
import useEffectOnce from 'hoc/useEffectOnce';
import cx from 'classnames';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { ItemStatus } from 'components/common/step-line/lineStepCP';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import ButtonActionRow, {
  ButtonTypeRow,
} from 'components/common/table/row/ButtonActionRow';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  ActivePermission,
  CommonQuery,
  WorkFlowType,
} from 'constants/common.const';
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
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { AuditCheckList } from 'models/api/audit-checklist/audit-checklist.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAuditCheckListAction,
  getListAuditCheckListAction,
  setDataFilterAction,
  undoSubmitAuditCheckListAction,
} from 'store/audit-checklist/audit-checklist.action';
import { clearDMSReducer } from 'store/dms/dms.action';
import CustomModalInside from 'components/ui/modal/custom-modal-inside/CustomModalInside';
import {
  clearTemplateReducer,
  createTemplateActions,
  deleteTemplateActions,
  getListTemplateActions,
  getTemplateDetailActions,
  updateTemplateActions,
} from 'store/template/template.action';
import { clearUserManagementReducer } from 'store/user/user.action';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import styles from '../../list-common.module.scss';

const AuditCheckListsContainer = () => {
  const dispatch = useDispatch();
  const { loading, listAuditCheckList, params, dataFilter } = useSelector(
    (state) => state.auditCheckList,
  );
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const [page, setPage] = useState(dataFilter?.page > 0 ? dataFilter?.page : 0);
  const [pageSize, setPageSize] = useState(dataFilter?.pageSize || 20);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [businessRule, setBusinessRule] = useState('');
  const [idItemRow, setIdItemRow] = useState('');

  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [titleModal, setTitleModal] = useState('');
  const [currentFilterModel, setCurrentFilterModel] = useState<any>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
    modulePage: ModulePage.List,
  });

  const el = document.getElementById('ag-grid-table');
  const el2 = document.getElementById('ag-grid-table-theme');

  const totalPage = gridApi?.paginationGetTotalPages();

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
          AppRouteConst.auditCheckListDetail(id),
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
        history.push(AppRouteConst.auditCheckListDetail(id));
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

  const editDetail = useCallback((id?: string) => {
    history.push(
      `${AppRouteConst.auditCheckListDetail(id)}${CommonQuery.EDIT}`,
    );
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListAuditCheckListAction.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

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
        gridApi?.paginationGoToPage(0);
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
              content: MODULE_TEMPLATE.inspectionChecklistTemplate,
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
              content: MODULE_TEMPLATE.inspectionChecklistTemplate,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListAuditCheckListAction.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
  });

  useEffectOnce(() => {
    dispatch(clearDMSReducer());
    dispatch(clearUserManagementReducer());
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.AUDIT_CHECKLIST,
        isRefreshLoading: false,
      }),
    );
  });

  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
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
              module: MODULE_TEMPLATE.inspectionChecklistTemplate,
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
            DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
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
            DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
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

  const renderStatus = useCallback(
    (item) => {
      if (item.status === 'Submitted' && userInfo?.id === item?.createdUserId) {
        if (item?.reviewInProgress) {
          return 'Revoke';
        }
        return 'Recall';
      }
      return '';
    },
    [userInfo?.id],
  );

  const dataTable = useMemo(
    () =>
      listAuditCheckList?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        code: item.code || DATA_SPACE,
        name: item.name || DATA_SPACE,
        createdUserId: item.createdUserId || DATA_SPACE,
        revisionNumber: item.revisionNumber || DATA_SPACE,
        auditEntity: item?.auditEntity || DATA_SPACE,
        revisionDate: formatDateTime(item.revisionDate),
        status: item.status === 'Rejected' ? 'Reassigned' : item.status,
        chkType: item.chkType || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        createdAt: formatDateTime(item.createdAt),
        createdUserName: item.createdUser?.username || DATA_SPACE,
        updatedAt: formatDateTime(item.updatedAt),
        updatedUser:
          (item.updatedAt && item.createdUser?.username) || DATA_SPACE,
        revokeRecall: renderStatus(item),
        company: item?.company,
        userAssignments: item?.userAssignments,
      })) || [],
    [listAuditCheckList?.data, renderStatus],
  );

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
        module: MODULE_TEMPLATE.inspectionChecklistTemplate,
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
              content: MODULE_TEMPLATE.inspectionChecklistTemplate,
            }),
          );
        },
      }),
    );
  };

  const handleDeleteAuditCheckList = useCallback(
    (id: string) => {
      dispatch(
        deleteAuditCheckListAction.request({
          id,
          getListAuditCheckList: () => {
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

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Delete,
        ),
        onPressButtonRight: () => handleDeleteAuditCheckList(id),
      });
    },
    [dynamicFields, handleDeleteAuditCheckList],
  );

  const handleActionRow = (data: AuditCheckList) => {
    setIsOpenConfirm(true);
    setIdItemRow(data.id);
    if (data?.status === 'Submitted' && data?.reviewInProgress) {
      setBusinessRule('Revoke');
    }
    if (data?.status === 'Submitted' && !data?.reviewInProgress) {
      setBusinessRule('Recall');
    }
  };
  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Action,
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
          const approverAssignmentPermission = checkAssignmentPermission(
            userInfo?.id,
            ActivePermission.APPROVER,
            data?.userAssignments,
          );

          const reviewerAssignmentPermission = checkAssignmentPermission(
            userInfo?.id,
            ActivePermission.REVIEWER,
            data?.userAssignments,
          );

          const isCreator = userInfo?.id === data?.createdUserId;
          const caseDraft = data?.status === ItemStatus.DRAFT && isCreator;
          const caseReview =
            data?.status === ItemStatus.REVIEWED &&
            workFlowActiveUserPermission.includes(ActivePermission.APPROVER) &&
            approverAssignmentPermission;

          const caseApprover =
            data?.status === ItemStatus.APPROVED &&
            workFlowActiveUserPermission.includes(ActivePermission.APPROVER) &&
            approverAssignmentPermission;

          const caseSubmitted =
            data?.status === ItemStatus.SUBMITTED &&
            workFlowActiveUserPermission.includes(ActivePermission.REVIEWER) &&
            reviewerAssignmentPermission;
          const caseReject = data?.status === 'Reassigned' && isCreator;

          const allowRemove = isCreator && data?.status === ItemStatus.DRAFT;

          const allowEdit =
            caseSubmitted ||
            caseDraft ||
            caseReject ||
            caseReview ||
            caseApprover;

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUDIT_CHECKLIST,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            allowEdit && {
              img: images.icons.icEdit,
              function: () => editDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUDIT_CHECKLIST,
              action: ActionTypeEnum.EXECUTE,
              cssClass: 'me-1',
            },
            allowRemove && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.AUDIT_CHECKLIST,
              action: ActionTypeEnum.EXECUTE,
              buttonType: ButtonType.Orange,
              cssClass: 'me-1',
            },
          ].filter((item) => !!item);

          actions.push({
            img: images.icons.table.icNewTab,
            function: () => viewDetail(data?.id, true),
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.AUDIT_CHECKLIST,
            action: ActionTypeEnum.VIEW,
            buttonType: ButtonType.Green,
          });
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
        field: 'code',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Checklist code'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Checklist name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'revisionNumber',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Revision number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditEntity',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'revisionDate',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Revision date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },

      {
        field: 'chkType',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Checklist type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUserName',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Created by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Updated date'],
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
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Updated by user'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'revokeRecall',
        headerName: renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Revoke/ Recall'],
        ),
        filter: false,
        enableRowGroup: false,
        cellRendererFramework: ({ item }) => (
          <div>
            {item?.status === 'Submitted' &&
            userInfo?.id === item?.createdUserId ? (
              <div className="d-flex align-items-center justify-content-between height__action-row">
                <ButtonActionRow
                  typeButton={
                    item?.reviewInProgress
                      ? ButtonTypeRow.OutlineGreen
                      : ButtonTypeRow.OutlinePrimary
                  }
                  handleClick={() => handleActionRow(item)}
                >
                  {item.reviewInProgress ? 'Revoke' : 'Recall'}
                </ButtonActionRow>
              </div>
            ) : (
              <div> </div>
            )}
          </div>
        ),
      },
    ],
    [
      dynamicFields,
      isMultiColumnFilter,
      userInfo?.id,
      workFlowActiveUserPermission,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  const renderConfirm = () => (
    <div>
      {businessRule === 'Revoke' && (
        <p>
          {renderDynamicLabel(
            dynamicFields,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS[
              'On revoking, the task gets open to any user in this stage. Do you want to proceed?'
            ],
          )}
        </p>
      )}

      {businessRule === 'Recall' && (
        <p>
          {renderDynamicLabel(
            dynamicFields,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS[
              'On recall, your submitted task will be reverted to you if no one has claimed yet. Do you want to proceed?'
            ],
          )}
        </p>
      )}

      <div className="d-flex w-50 mx-auto mt-4">
        <Button
          className={cx('w-100 me-4')}
          buttonType={ButtonType.CancelOutline}
          onClick={() => {
            setIsOpenConfirm(false);
            setBusinessRule('');
          }}
        >
          No
        </Button>
        <Button
          onClick={() => {
            dispatch(
              undoSubmitAuditCheckListAction.request({
                id: idItemRow,
                type: businessRule,
                requestSuccess: () => {
                  handleGetList({
                    createdAtFrom: dateFilter[0].toISOString(),
                    createdAtTo: dateFilter[1].toISOString(),
                  });
                  setIsOpenConfirm(false);
                  setBusinessRule('');
                },
              }),
            );
          }}
          buttonType={ButtonType.Primary}
          className={cx('w-100 ms-4')}
        >
          {renderDynamicLabel(
            dynamicFields,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Yes,
          )}
        </Button>
      </div>
    </div>
  );
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.AUDIT_CHECKLIST}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
        )}
      >
        {workFlowActiveUserPermission.includes(ActivePermission.CREATOR) && (
          <Button
            onClick={() => history.push(AppRouteConst.AUDIT_CHECKLIST_CREATE)}
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
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Create New'],
            )}
          </Button>
        )}
      </HeaderPage>

      <div>
        <RangePickerFilter
          disable={loading}
          valueDateRange={dateFilter}
          dynamicLabels={dynamicFields}
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
        totalItem={listAuditCheckList?.totalItem}
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
              dynamicLabels={dynamicFields}
            />
            <CustomModalInside
              isOpen={isOpenConfirm}
              title={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Confirmation,
              )}
              toggle={() => setIsOpenConfirm((prev) => !prev)}
              content={renderConfirm()}
              modalClassName={styles.wrapConfirmModal}
            />
            <ModalList
              data={listTemplate?.data || []}
              isOpen={modalOpen}
              toggle={setModalOpen}
              dynamicLabels={dynamicFields}
              templateModule={MODULE_TEMPLATE.inspectionChecklistTemplate}
            />
          </>
        }
      />
    </div>
  );
};

export default AuditCheckListsContainer;
