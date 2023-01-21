import { useCallback, useEffect, useState, useMemo, lazy } from 'react';
import images from 'assets/images/images';
import cx from 'classnames';
import { ButtonType } from 'components/ui/button/Button';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { ActivePermission } from 'constants/common.const';
import {
  ColDef,
  ColumnApi,
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
  PaginationChangedEvent,
} from 'ag-grid-community';
import moment from 'moment';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import {
  dateStringComparator,
  populateStatus,
  compareStatus,
} from 'helpers/utils.helper';
import { Action, CommonApiParam, UserAssignments } from 'models/common.model';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import { clearDMSReducer } from 'store/dms/dms.action';
import {
  deletePlanningAndRequestActions,
  getListPlanningAndRequestActions,
  setDataFilterAction,
} from 'store/planning-and-request/planning-and-request.action';
import { clearUserManagementReducer } from 'store/user/user.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { LIST_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import {
  getListTemplateActions,
  deleteTemplateActions,
  createTemplateActions,
  updateTemplateActions,
  getTemplateDetailActions,
} from 'store/template/template.action';
import { PLANNING_STATUES } from 'constants/planning-and-request.const';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  DATA_SPACE,
  TYPE_TEMPLATE,
  TEXT_ACTION_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../list.module.scss';
import { checkDocHolderChartererVesselOwner } from '../forms/planning-and-request.helps';

const ModalList = lazy(
  () => import('components/common/ag-grid/modal-list/ModalList'),
);

interface IPlanningList {
  tab: string;
}

export const DATE_DEFAULT = [
  moment().subtract(6, 'months').startOf('day'),
  moment().add(6, 'months').endOf('day'),
];

export default function PlanningAndRequestList(props: IPlanningList) {
  const { tab } = props;
  const dispatch = useDispatch();
  const { loading, listPlanningAndRequest, params, dataFilter } = useSelector(
    (state) => state.planningAndRequest,
  );
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionPar,
    modulePage: ModulePage.List,
  });
  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const [pageSize, setPageSize] = useState(dataFilter?.pageSize || 20);
  const [page, setPage] = useState(dataFilter?.page || 0);
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
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);
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
          AppRouteConst.getPlanningAndRequestById(id),
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
        history.push(AppRouteConst.getPlanningAndRequestById(id));
      }
    },
    [
      handleSaveFilter,
      pageSize,
      page,
      gridColumnApi,
      currentFilterModel,
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
      history.push(`${AppRouteConst.getPlanningAndRequestById(id)}?edit`);
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

  const listPlanningAndRequestTable = useMemo(
    () =>
      listPlanningAndRequest?.data?.filter(
        (item) => item?.status !== 'Completed',
      ) || [],
    [listPlanningAndRequest],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { handleSuccess, ...other } = params;
      let newParams = handleFilterParams(other);
      if (handleSuccess) {
        newParams = { ...newParams, handleSuccess };
      }
      dispatch(
        getListPlanningAndRequestActions.request({
          ...newParams,
          pageSize: -1,
          tab,
        }),
      );
    },
    [dispatch, tab],
  );

  const handleDeletePlanningAndRequest = useCallback(
    (id: string) => {
      dispatch(
        deletePlanningAndRequestActions.request({
          id,
          getListPlanningAndRequest: () => {
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
    (id?: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Delete,
        ),
        onPressButtonRight: () => handleDeletePlanningAndRequest(id),
      });
    },
    [dynamicLabels, handleDeletePlanningAndRequest],
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
              content: MODULE_TEMPLATE.planningAndRequest,
            }),
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.isLeftMenu]);

  useEffectOnce(() => {
    // get role work flow
    dispatch(clearDMSReducer());
    dispatch(clearUserManagementReducer());

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
              content: MODULE_TEMPLATE.planningAndRequest,
            }),
          );
        },
      });
    }
  });

  useEffect(() => {
    gridApi?.paginationSetPageSize(Number(pageSize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const dataTable = useMemo(
    () =>
      listPlanningAndRequestTable?.map((item) => ({
        id: item?.id || DATA_SPACE,
        refId: item?.refId || DATA_SPACE,
        fleetName: item?.vessel?.fleetName || DATA_SPACE,
        entityType: item?.entityType || DATA_SPACE,
        inspectionType:
          item?.auditTypes
            ?.map((i) => i.name)
            ?.toString()
            ?.replace(',', ', ') || DATA_SPACE,
        visitType: item?.typeOfAudit || DATA_SPACE,
        dateOfLastInspection: item?.dateOfLastInspection
          ? moment(item?.dateOfLastInspection).local().format('DD/MM/YYYY')
          : DATA_SPACE,
        dueDate: item?.dueDate
          ? moment(item?.dueDate).local().format('DD/MM/YYYY')
          : DATA_SPACE,
        inspectionPlannedFromDate: item?.plannedFromDate
          ? moment(item?.plannedFromDate).local().format('DD/MM/YYYY')
          : DATA_SPACE,
        inspectionPlannedToDate: item?.plannedToDate
          ? moment(item?.plannedToDate).local().format('DD/MM/YYYY')
          : DATA_SPACE,
        leadInspectorName: item?.leadAuditor?.username || DATA_SPACE,
        nameOfInspector:
          item?.auditors
            ?.map((i) => i.username)
            ?.toString()
            ?.replace(',', ', ') || DATA_SPACE,
        fromPort: item?.fromPort?.name || DATA_SPACE,
        toPort: item?.toPort?.name || DATA_SPACE,
        eta: item?.toPortEstimatedTimeArrival
          ? moment(item?.toPortEstimatedTimeArrival)
              .local()
              .format('DD/MM/YYYY')
          : DATA_SPACE,
        etd: item?.toPortEstimatedTimeDeparture
          ? moment(item?.toPortEstimatedTimeDeparture)
              .local()
              .format('DD/MM/YYYY')
          : DATA_SPACE,
        vesselName: item?.vessel?.name || DATA_SPACE,
        vesselTypeName: item?.vessel?.vesselType?.name || DATA_SPACE,
        vesselCountryFlag: item?.vessel?.countryFlag || DATA_SPACE,
        auditCompany: item?.auditCompany?.name || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        department:
          item?.departments?.map((i) => i.name).join(', ') || DATA_SPACE,
        workingType: item?.workingType || DATA_SPACE,
        auditNo: item?.auditNo || DATA_SPACE,
        status: populateStatus(item?.status),
        globalStatus: item?.globalStatus || DATA_SPACE,
        isCreator: userInfo?.id === item?.createdUserId,
        isVesselOwner: !!item?.vessel?.owners?.find(
          (item) => item?.id === userInfo?.id,
        ),
        isLeadAuditor: userInfo?.id === item?.leadAuditorId,
        company: item?.company,
        userAssignments: item?.userAssignments,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      })) || [],
    [listPlanningAndRequestTable, userInfo],
  );

  const allowEditItem = useCallback(
    (data: {
      isCreator: any;
      isVesselOwner: any;
      isLeadAuditor: any;
      status: string;
      entityType: string;
      userAssignments: UserAssignments[];
    }) => {
      const approverAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.APPROVER,
        data?.userAssignments,
      );

      const auditorAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.AUDITOR,
        data?.userAssignments,
      );

      const ownerManagerAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.OWNER_MANAGER,
        data?.userAssignments,
      );
      const isCreator = data?.isCreator;

      const draftCase =
        data?.status?.toLowerCase() === PLANNING_STATUES.Draft && isCreator;
      const submittedCase =
        data?.status?.toLowerCase() === PLANNING_STATUES.Submitted &&
        (approverAssignmentPermission || isCreator);

      const reassignCase =
        data?.status?.toLowerCase() === PLANNING_STATUES.Reassigned &&
        isCreator;

      const approverCase =
        data?.status?.toLowerCase() === PLANNING_STATUES.Approved &&
        (auditorAssignmentPermission || isCreator);

      const acceptedCase =
        data?.status?.toLowerCase() === PLANNING_STATUES.Accepted &&
        (ownerManagerAssignmentPermission || isCreator);

      const auditorAcceptedCase =
        data?.status?.toLowerCase() === PLANNING_STATUES.Auditor_accepted &&
        (ownerManagerAssignmentPermission || isCreator);

      const plannedCase =
        compareStatus(data?.status, PLANNING_STATUES.Planned) &&
        ownerManagerAssignmentPermission;

      if (data?.status === PLANNING_STATUES.Completed) {
        return false;
      }
      if (draftCase) {
        return true;
      }
      if (submittedCase) {
        return true;
      }
      if (reassignCase) {
        return true;
      }
      if (auditorAcceptedCase || acceptedCase) {
        return true;
      }
      if (approverCase) {
        return true;
      }
      if (plannedCase) {
        return true;
      }

      return false;
    },
    [userInfo],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.Action,
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
          const isCreator = data?.isCreator;
          const isCurrentDoc = checkDocHolderChartererVesselOwner(
            data,
            userInfo,
          );

          const removePermission =
            data?.status?.toLowerCase() === PLANNING_STATUES.Draft &&
            isCreator &&
            isCurrentDoc;

          const editPermission = allowEditItem(data) && isCurrentDoc;

          let actions: Action[] =
            removePermission || editPermission
              ? [
                  {
                    img: images.icons.icViewDetail,
                    function: () => data && viewDetail(data?.id),
                    feature: Features.AUDIT_INSPECTION,
                    subFeature: SubFeatures.PLANNING_AND_REQUEST,
                    action: ActionTypeEnum.VIEW,
                    buttonType: ButtonType.Blue,
                    cssClass: 'me-1',
                  },
                  {
                    img: images.icons.icEdit,
                    function: () => data && editDetail(data?.id),
                    feature: Features.AUDIT_INSPECTION,
                    subFeature: SubFeatures.PLANNING_AND_REQUEST,
                    action: ActionTypeEnum.EXECUTE,
                    disable: !editPermission,
                    isHidden: !editPermission,
                    cssClass: 'me-1',
                  },
                  {
                    img: images.icons.icRemove,
                    function: () => data && handleDelete(data?.id),
                    disable: !removePermission,
                    feature: Features.AUDIT_INSPECTION,
                    subFeature: SubFeatures.PLANNING_AND_REQUEST,
                    action: ActionTypeEnum.EXECUTE,
                    buttonType: ButtonType.Orange,
                    cssClass: 'me-1',
                    isHidden: !removePermission,
                  },
                  {
                    img: images.icons.table.icNewTab,
                    function: () => data && viewDetail(data?.id, true),
                    feature: Features.AUDIT_INSPECTION,
                    subFeature: SubFeatures.PLANNING_AND_REQUEST,
                    action: ActionTypeEnum.VIEW,
                    buttonType: ButtonType.Green,
                  },
                ].filter((item) => !item.isHidden)
              : [
                  {
                    img: images.icons.icViewDetail,
                    function: () => data && viewDetail(data?.id),
                    feature: Features.AUDIT_INSPECTION,
                    subFeature: SubFeatures.PLANNING_AND_REQUEST,
                    action: ActionTypeEnum.VIEW,
                    buttonType: ButtonType.Blue,
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
        field: 'refId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'entityType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fleetName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Fleet name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselTypeName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselCountryFlag',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.Flag,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditCompany',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.Company,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'department',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.Department,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'workingType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Working type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'visitType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Visit type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dateOfLastInspection',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Date of last inspection'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'dueDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Due date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'inspectionPlannedFromDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Inspection planned from date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'inspectionPlannedToDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Inspection planned to date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'leadInspectorName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Lead inspector name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'nameOfInspector',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Name of inspector'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fromPort',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['From port'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'toPort',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['To port'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eta',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.ETA,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'etd',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.ETD,
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
          LIST_PLANNING_DYNAMIC_FIELDS['Inspection no'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Schedule status'],
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
          LIST_PLANNING_DYNAMIC_FIELDS['Global status'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'createCompanyName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo,
      allowEditItem,
      viewDetail,
      editDetail,
      handleDelete,
    ],
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
              module: MODULE_TEMPLATE.planningAndRequest,
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
      onClick: () => gridApi?.exportDataAsExcel({ fileName: 'Planning.xlsx' }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () => gridApi?.exportDataAsCsv({ fileName: 'Planning.csv' }),
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
        module: MODULE_TEMPLATE.planningAndRequest,
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
              content: MODULE_TEMPLATE.planningAndRequest,
            }),
          );
        },
      }),
    );
  };

  // render
  return (
    <div className={styles.container}>
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
      <div className={styles.wrapTable}>
        <AGGridTable
          isFullScreen={isFullScreen}
          loading={loading}
          extensionOptions={extensionOptions}
          onGridReady={onGridReady}
          height="calc(100vh - 232px)"
          rowData={dataTable}
          columnDefs={columnDefs}
          defaultColDef={colDef}
          templates={listTemplate?.data || []}
          pageSize={pageSize}
          setPageSize={(newPageSize: number) => {
            setPageSize(newPageSize);
            setPage(0);
            gridApi.paginationGoToPage(0);
          }}
          totalItem={listPlanningAndRequestTable?.length}
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
                loading={loading}
                isOpen={openTemplate}
                toggle={() => setOpenTemplate((p) => !p)}
                handleSave={handleSaveTemplate}
                templates={listTemplate?.data || []}
              />
              <ModalList
                data={listTemplate?.data || []}
                isOpen={modalOpen}
                toggle={setModalOpen}
                templateModule={MODULE_TEMPLATE.planningAndRequest}
              />
            </>
          }
        />
      </div>
    </div>
  );
}
