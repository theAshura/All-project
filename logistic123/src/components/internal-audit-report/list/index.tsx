import { useCallback, useEffect, useState, useMemo } from 'react';
import useEffectOnce from 'hoc/useEffectOnce';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { ButtonType } from 'components/ui/button/Button';
import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  PaginationChangedEvent,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  DATA_SPACE,
  TYPE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import {
  getListTemplateActions,
  deleteTemplateActions,
  createTemplateActions,
  updateTemplateActions,
  getTemplateDetailActions,
  clearTemplateReducer,
} from 'store/template/template.action';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import {
  CommonQuery,
  ActivePermission,
  IARReviewPermission,
  WorkFlowType,
} from 'constants/common.const';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDataFilterAction,
  getListInternalAuditReportActions,
} from 'store/internal-audit-report/internal-audit-report.action';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import cx from 'classnames';
import { dateStringComparator } from 'helpers/utils.helper';
import moment from 'moment';
import { Action, CommonApiParam } from 'models/common.model';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import { handleFilterParams } from 'helpers/filterParams.helper';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_LIST } from 'constants/dynamic/inspection-report.const';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
// import { checkReviewStatus } from '../forms/helpers/helpers';
import { InternalAuditReportStatus } from '../details';
import styles from '../../list-common.module.scss';

const InternalAuditReportContainer = () => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: ModulePage.List,
  });
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dispatch = useDispatch();
  const { loading, listInternalAuditReports, params, dataFilter } = useSelector(
    (state) => state.internalAuditReport,
  );
  const { workFlowActiveUserPermission } = useSelector(
    (store) => store.workFlow,
  );
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );

  const { userInfo } = useSelector((state) => state.authenticate);
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
          AppRouteConst.getInternalAuditReportById(id),
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
        history.push(AppRouteConst.getInternalAuditReportById(id));
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
        `${AppRouteConst.getInternalAuditReportById(id)}${CommonQuery.EDIT}`,
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
      getListInternalAuditReportActions.request({
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
    // return () => {
    //   el.removeEventListener('fullscreenchange', onFullScreenChange);
    // };
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
              content: MODULE_TEMPLATE.internalAuditReport,
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
              content: MODULE_TEMPLATE.internalAuditReport,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListInternalAuditReportActions.success({
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

  const dataTable = useMemo(
    () =>
      listInternalAuditReports?.data?.map((item, index) => ({
        id: item?.internalAuditReport_id || DATA_SPACE,
        refId: item?.internalAuditReport_refId || DATA_SPACE,
        auditRefId: item?.prRefId || DATA_SPACE,
        internalAuditReport_entityType:
          item?.internalAuditReport_entityType || DATA_SPACE,
        fleetName: item?.fleetName || DATA_SPACE,
        vesselName: item?.vesselName || DATA_SPACE,
        vesselType: item?.vesselTypeName || DATA_SPACE,
        flag: item?.countryFlag || DATA_SPACE,
        auditCompanyName: item?.auditCompanyName || DATA_SPACE,
        createCompanyName: item?.company_name || DATA_SPACE,
        departments:
          item?.departments?.map((i) => i.name).join(', ') || DATA_SPACE,
        leadAuditor: item?.leadAuditorName || DATA_SPACE,
        totalNoFindings: item?.totalFindings || DATA_SPACE,
        totalNoNc: item?.totalNonConformity || DATA_SPACE,
        totalNoOBS: item?.totalObservation || DATA_SPACE,
        auditFromDate: item?.actualFrom
          ? moment.utc(item?.actualFrom).local().format('DD/MM/YYYY')
          : DATA_SPACE,
        auditToDate: item?.actualTo
          ? moment.utc(item?.actualTo).local().format('DD/MM/YYYY')
          : DATA_SPACE,
        auditNo: item?.prAuditNo || DATA_SPACE,
        SNo: item?.internalAuditReport_serialNumber || DATA_SPACE,
        statusOri: item?.internalAuditReport_status
          ?.replace('_', '')
          ?.replace(' ', ''),
        status:
          item?.internalAuditReport_status === 'closeout'
            ? 'Close out'
            : item?.internalAuditReport_status?.replace('_', ' '),
        globalStatus: item?.planningRequest_globalStatus || DATA_SPACE,
        totalNoOpenNC: item?.totalOpenNC,
        totalNoClosedNC: item?.totalCloseNC,
        totalNoOpenOBS: item?.totalOpenOBS,
        totalNoClosedOBS: item?.totalCloseOBS,
        isPicItem: item?.picIdList?.some((i) => i === userInfo?.id),
        company_id: item?.company_id,
        userAssignments: item?.userAssignments,
        vesselDocHolders: item?.vesselDocHolders || [],
        vesselCharterers: item?.vesselCharterers || [],
        vesselOwners: item?.vesselOwners || [],
        createdAt: item?.internalAuditReport_createdAt,
      })),
    [listInternalAuditReports?.data, userInfo?.id],
  );
  const compareStatus = useCallback(
    (status1, status2) =>
      status1?.replace('_', '')?.replace(' ', '') ===
      status2?.replace('_', '')?.replace(' ', ''),
    [],
  );

  const hasEdit = useCallback(
    (item: any) => {
      const workFollowItem = [];
      item?.userAssignments?.forEach((itemDetail) => {
        if (!workFollowItem?.includes(itemDetail?.permission)) {
          workFollowItem.push(itemDetail?.permission);
        }
      });

      const isCurrentDocChartererVesselOwner =
        checkDocHolderChartererVesselOwner(
          {
            vesselDocHolders: item?.vesselDocHolders,
            vesselCharterers: item?.vesselCharterers,
            vesselOwners: item?.vesselOwners,
            createdAt: item?.createdAt,
            entityType: item?.internalAuditReport_entityType,
          },
          userInfo,
        );

      const hasPermissionCreator = workFlowActiveUserPermission?.includes(
        ActivePermission.CREATOR,
      );
      const hasPermissionApprover = workFlowActiveUserPermission?.includes(
        ActivePermission.APPROVER,
      );
      const hasPermissionReview2 = workFlowActiveUserPermission?.includes(
        IARReviewPermission.REVIEWER_2,
      );
      const hasPermissionReview3 = workFlowActiveUserPermission?.includes(
        IARReviewPermission.REVIEWER_3,
      );
      const hasPermissionReview4 = workFlowActiveUserPermission?.includes(
        IARReviewPermission.REVIEWER_4,
      );
      const hasPermissionReview5 = workFlowActiveUserPermission?.includes(
        IARReviewPermission.REVIEWER_5,
      );

      const reviewer1AssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_1,
        item?.userAssignments,
      );
      const reviewer2AssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_2,
        item?.userAssignments,
      );
      const reviewer3AssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_3,
        item?.userAssignments,
      );
      const reviewer4AssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_4,
        item?.userAssignments,
      );
      const reviewer5AssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        IARReviewPermission.REVIEWER_5,
        item?.userAssignments,
      );

      const approverAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.APPROVER,
        item?.userAssignments,
      );

      // const closeOutAssignmentPermission = checkAssignmentPermission(
      //   userInfo?.id,
      //   ActivePermission.CLOSE_OUT,
      //   item?.userAssignments,
      // );

      const hasReview2IARDetail = workFollowItem?.includes(
        IARReviewPermission.REVIEWER_2,
      );
      const hasReview3IARDetail = workFollowItem?.includes(
        IARReviewPermission.REVIEWER_3,
      );
      const hasReview4IARDetail = workFollowItem?.includes(
        IARReviewPermission.REVIEWER_4,
      );
      const hasReview5IARDetail = workFollowItem?.includes(
        IARReviewPermission.REVIEWER_5,
      );

      const draftEditCase =
        compareStatus(InternalAuditReportStatus.DRAFT, item?.statusOri) &&
        (hasPermissionCreator || item?.isPicItem);

      const submittedCase =
        item?.statusOri === InternalAuditReportStatus.SUBMITTED &&
        (reviewer1AssignmentPermission || item.isPicItem);

      const reviewer1Case =
        compareStatus(item?.statusOri, InternalAuditReportStatus.REVIEWED_1) &&
        ((reviewer2AssignmentPermission && hasReview2IARDetail) ||
          (reviewer3AssignmentPermission &&
            hasReview3IARDetail &&
            !hasReview2IARDetail) ||
          (reviewer4AssignmentPermission &&
            hasReview4IARDetail &&
            !hasReview2IARDetail &&
            !hasReview3IARDetail) ||
          (reviewer5AssignmentPermission &&
            hasReview5IARDetail &&
            !hasReview2IARDetail &&
            !hasReview3IARDetail &&
            !hasReview4IARDetail) ||
          item.isPicItem ||
          (hasPermissionApprover &&
            !hasPermissionReview2 &&
            !hasPermissionReview3 &&
            !hasPermissionReview4 &&
            !hasPermissionReview5));
      const reviewer2Case =
        compareStatus(item?.statusOri, InternalAuditReportStatus.REVIEWED_2) &&
        ((reviewer3AssignmentPermission && hasReview3IARDetail) ||
          (reviewer4AssignmentPermission &&
            hasReview4IARDetail &&
            !hasReview3IARDetail) ||
          (reviewer5AssignmentPermission &&
            hasReview5IARDetail &&
            !hasReview3IARDetail &&
            !hasReview4IARDetail) ||
          item.isPicItem ||
          (hasPermissionApprover &&
            !hasPermissionReview3 &&
            !hasPermissionReview4 &&
            !hasPermissionReview5));
      const reviewer3Case =
        compareStatus(item?.statusOri, InternalAuditReportStatus.REVIEWED_3) &&
        ((reviewer4AssignmentPermission && hasReview4IARDetail) ||
          (reviewer5AssignmentPermission &&
            hasReview5IARDetail &&
            !hasReview4IARDetail) ||
          item.isPicItem ||
          (hasPermissionApprover &&
            !hasPermissionReview4 &&
            !hasPermissionReview5));
      const reviewer4Case =
        compareStatus(item?.statusOri, InternalAuditReportStatus.REVIEWED_4) &&
        ((reviewer5AssignmentPermission && hasReview5IARDetail) ||
          item.isPicItem ||
          (hasPermissionApprover && !hasPermissionReview5));
      const reviewer5Case =
        compareStatus(item?.statusOri, InternalAuditReportStatus.REVIEWED_5) &&
        (approverAssignmentPermission || item.isPicItem);

      const approverEditCase =
        item?.statusOri === InternalAuditReportStatus.APPROVED &&
        approverAssignmentPermission;

      const reassignEditCase =
        InternalAuditReportStatus.REASSIGNED === item?.statusOri &&
        hasPermissionCreator;

      if (
        (draftEditCase ||
          submittedCase ||
          reviewer1Case ||
          reviewer2Case ||
          reviewer3Case ||
          reviewer4Case ||
          reviewer5Case ||
          approverEditCase ||
          reassignEditCase) &&
        isCurrentDocChartererVesselOwner
      ) {
        return true;
      }
      return false;
    },
    [userInfo, workFlowActiveUserPermission, compareStatus],
  );

  const handleDeleteTemplate = (templateId: string) => {
    dispatch(
      deleteTemplateActions.request({
        ids: [templateId],
        getList: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.internalAuditReport,
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

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST.Action,
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

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => data && viewDetail(data?.id),
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            hasEdit(data) && {
              img: images.icons.icEdit,
              function: () => data && editDetail(params?.data?.id),
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
              action: ActionTypeEnum.EXECUTE,
              cssClass: 'me-1',
            },
            {
              img: images.icons.table.icNewTab,
              function: () => data && viewDetail(data?.id, true),
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
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
        field: 'refId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditRefId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Inspection Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'internalAuditReport_entityType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fleetName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Fleet name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'flag',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST.Flag,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditCompanyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST.Company,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'departments',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST.Department,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'leadAuditor',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Lead inspector'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalNoFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Total.No.Findings'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'totalNoNc',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Total.No.NC'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'totalNoOBS',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Total.No.OBS'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'auditFromDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Inspection from date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'auditToDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Inspection to date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'auditNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Inspection S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'SNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST.Status,
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
          INSPECTION_REPORT_FIELDS_LIST['Global status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },

      {
        field: 'totalNoOpenNC',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Total.No open NC'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'totalNoClosedNC',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Total.No closed NC'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'totalNoOpenOBS',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Total.No open OBS'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'totalNoClosedOBS',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Total.No closed OBS'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],

    [dynamicLabels, isMultiColumnFilter, hasEdit, viewDetail, editDetail],
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
        module: MODULE_TEMPLATE.internalAuditReport,
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
              module: MODULE_TEMPLATE.internalAuditReport,
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
          fileName: 'Inspection Report.xlsx',
        }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({
          fileName: 'Inspection Report.csv',
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
        breadCrumb={BREAD_CRUMB.INTERNAL_AUDIT_REPORT}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionInspectionReport,
        )}
      />
      <div>
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
      </div>
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
        totalItem={listInternalAuditReports?.data?.length || 0}
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
              templateModule={MODULE_TEMPLATE.internalAuditReport}
            />
          </>
        }
      />
    </div>
  );
};

export default InternalAuditReportContainer;
