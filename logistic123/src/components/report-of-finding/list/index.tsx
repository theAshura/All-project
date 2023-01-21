import { updateReportOfFindingRecallStatusActionsApi } from 'api/report-of-finding.api';
import images from 'assets/images/images';
import cx from 'classnames';
import ButtonActionRow, {
  ButtonTypeRow,
} from 'components/common/table/row/ButtonActionRow';
import Button, { ButtonType } from 'components/ui/button/Button';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import {
  ActivePermission,
  CommonQuery,
  WorkFlowType,
} from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import HeaderPage from 'components/common/header-page/HeaderPage';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { dateStringComparator } from 'helpers/utils.helper';
import { ReportOfFinding } from 'models/api/report-of-finding/report-of-finding.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getListReportOfFindingActions,
  setDataFilterAction,
} from 'store/report-of-finding/report-of-finding.action';
import { ExtensionOption } from 'components/common/ag-grid/ActionTable';
import lowerCase from 'lodash/lowerCase';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import AGGridTable from 'components/common/ag-grid/AGGridTable';
import {
  ColumnApi,
  FilterChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
  PaginationChangedEvent,
} from 'ag-grid-community';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import TemplateModal from 'components/common/ag-grid/TemplateModal';
import moment from 'moment';
import CustomModalInside from 'components/ui/modal/custom-modal-inside/CustomModalInside';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import {
  getListTemplateActions,
  deleteTemplateActions,
  createTemplateActions,
  updateTemplateActions,
  getTemplateDetailActions,
  clearTemplateReducer,
} from 'store/template/template.action';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
  TYPE_TEMPLATE,
  DATA_SPACE,
  TEXT_ACTION_TEMPLATE,
  DATE_DEFAULT,
} from 'constants/components/ag-grid.const';
import ModalList from 'components/common/ag-grid/modal-list/ModalList';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import styles from '../../list-common.module.scss';

export default function ReportOfFindingContainer() {
  const dispatch = useDispatch();
  const { loading, listReportOfFinding, params, dataFilter } = useSelector(
    (state) => state.reportOfFinding,
  );
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const { listTemplate, templateDetail } = useSelector(
    (state) => state.template,
  );
  const [pageSize, setPageSize] = useState(dataFilter?.pageSize || 20);
  const [isFirstSetDataFilter, setIsFirstSetDataFilter] = useState(true);

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
  const [colDef, setColDef] = useState(DEFAULT_COL_DEF);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [idItemRow, setIdItemRow] = useState('');
  const [reviewInProgress, setReviewInProgress] = useState(false);
  const [typeRange, setTypeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionReportOfFinding,
    modulePage: ModulePage.List,
  });

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
          AppRouteConst.getReportOfFindingById(id),
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
        history.push(AppRouteConst.getReportOfFindingById(id));
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
        `${AppRouteConst.getReportOfFindingById(id)}${CommonQuery.EDIT}`,
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
      const { handleSuccess, ...other } = params;
      let newParams = handleFilterParams(other);
      if (handleSuccess) {
        newParams = { ...newParams, handleSuccess };
      }
      dispatch(
        getListReportOfFindingActions.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  const renderConfirm = () => (
    <div>
      <p>
        On {reviewInProgress ? 'Revoke' : 'Recall'}, your submitted task will be
        reverted to you if no one has claimed yet. Do you want to proceed?
      </p>
      <div className="d-flex w-50 mx-auto mt-4">
        <Button
          className={cx('w-100 me-4')}
          buttonType={ButtonType.CancelOutline}
          onClick={() => {
            setIsOpenConfirm(false);
            // setBusinessRule('');
          }}
        >
          No
        </Button>
        <Button
          onClick={() => {
            updateReportOfFindingRecallStatusActionsApi(idItemRow).then(
              (result) => {
                handleGetList({
                  createdAtFrom: dateFilter[0].toISOString(),
                  createdAtTo: dateFilter[1].toISOString(),
                });
                setIsOpenConfirm(false);
              },
            );
          }}
          buttonType={ButtonType.Primary}
          className={cx('w-100 ms-4')}
        >
          Yes
        </Button>
      </div>
    </div>
  );

  const handleActionRow = (data: ReportOfFinding) => {
    setIsOpenConfirm(true);
    setIdItemRow(data.id);
    setReviewInProgress(data.reviewInProgress);
  };

  const checkWorkflow = useCallback(
    (dataItem: ReportOfFinding): Action[] => {
      const isCreator = dataItem?.createdUserId === userInfo?.id;
      const isCompany = userInfo?.mainCompanyId === dataItem?.company?.id;
      const isCurrentDoc = checkDocHolderChartererVesselOwner(
        {
          vesselDocHolders: dataItem?.vessel?.vesselDocHolders,
          vesselCharterers: dataItem?.vessel?.vesselCharterers,
          vesselOwners: dataItem?.vessel?.vesselOwners,
          createdAt: dataItem?.createdAtOrigin,
          entityType: dataItem?.entityType,
        },
        userInfo,
      );

      const reviewAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        dataItem?.userAssignments,
      );

      const closeOutAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.CLOSE_OUT,
        dataItem?.userAssignments,
      );
      const draftCase =
        dataItem?.status?.toLowerCase() === 'draft' &&
        workFlowActiveUserPermission?.includes(ActivePermission.CREATOR) &&
        isCompany;
      const submittedCase =
        dataItem?.status?.toLowerCase() === 'submitted' &&
        workFlowActiveUserPermission?.includes(ActivePermission.REVIEWER) &&
        isCompany &&
        reviewAssignmentPermission;
      const reviewCase =
        dataItem?.status?.toLowerCase() === 'reviewed' &&
        workFlowActiveUserPermission?.includes(ActivePermission.CLOSE_OUT) &&
        isCompany &&
        closeOutAssignmentPermission;
      const reassignCase =
        dataItem?.status?.toLowerCase() === 'reassigned' &&
        isCreator &&
        workFlowActiveUserPermission?.includes(ActivePermission.CREATOR);
      const closeOutCase =
        dataItem?.status?.toLowerCase() === 'close out' &&
        isCompany &&
        workFlowActiveUserPermission.includes(ActivePermission.CLOSE_OUT);

      const allowEdit =
        (draftCase ||
          submittedCase ||
          reviewCase ||
          reassignCase ||
          closeOutCase) &&
        isCurrentDoc;

      return [
        {
          img: images.icons.icViewDetail,
          function: () => dataItem && viewDetail(dataItem?.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        allowEdit && {
          img: images.icons.icEdit,
          function: () => dataItem && editDetail(dataItem?.id),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.EXECUTE,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => dataItem && viewDetail(dataItem?.id, true),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.PLANNING_AND_REQUEST,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Green,
        },
      ]?.filter((item) => item);
    },
    [editDetail, userInfo, viewDetail, workFlowActiveUserPermission],
  );

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
              content: MODULE_TEMPLATE.reportOfFindings,
            }),
          );
        },
      });
    }
  }, [dispatch, gridApi, handleGetList, params?.isLeftMenu]);

  useEffect(() => {
    if (params?.isLeftMenu === false) {
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
              content: MODULE_TEMPLATE.reportOfFindings,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListReportOfFindingActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
  }, [dataFilter?.dateFilter, dispatch, handleGetList, params?.isLeftMenu]);

  useEffect(() => {
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.REPORT_FINDING,
        isRefreshLoading: false,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (templateDetail && listTemplate?.data?.length > 0) {
      setTemplateID(templateDetail.id);
      if (!dataFilter || !isFirstSetDataFilter) {
        setPage(0);
        setPageSize(20);
        gridApi?.paginationGoToPage(0);
        const template = JSON.parse(templateDetail.template);
        if (template) {
          gridApi?.setFilterModel(template?.filterModel);
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
    if (listTemplate?.data?.length === 0) {
      gridColumnApi?.resetColumnState();
      setColDef(DEFAULT_COL_DEF);
      gridApi?.setFilterModel(null);
    }
  }, [gridApi, gridColumnApi, listTemplate]);

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
              content: MODULE_TEMPLATE.reportOfFindings,
            }),
          );
        },
      }),
    );
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
              module: MODULE_TEMPLATE.reportOfFindings,
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
        gridApi?.exportDataAsExcel({ fileName: 'Report of Findings.xlsx' }),
    },
    {
      label: TEXT_ACTION_TEMPLATE.CSV,
      icon: images.icons.agGrid.icAGCsv,
      onClick: () =>
        gridApi?.exportDataAsCsv({ fileName: 'Report of Findings.csv' }),
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

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Action,
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
        field: 'refId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'entityType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS.Entity,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fleetName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Fleet name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditCompany',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS.Company,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'department',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS.Department,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselFlag',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS.Flag,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditTypes',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'leadAuditorName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Lead inspection name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalFindings',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Total No.of findings'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'totalNonConformity',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Total No.of NC'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'totalObservation',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Total No.of observation'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agNumberColumnFilter',
        cellRenderer: 'cellRenderRight',
      },
      {
        field: 'planningRequestAuditNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspection S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'planningRequestRefId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspection Ref.ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'sNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Created date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderRight',
        comparator: dateStringComparator,
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS.Status,
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
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Global status'],
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
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'revokeRecall',
        headerName: renderDynamicLabel(
          dynamicLabels,
          LIST_REPORT_OF_FINDING_DYNAMIC_FIELDS['Revoke/ Recall'],
        ),
        filter: false,
        enableRowGroup: false,
        cellRendererFramework: (param) => {
          // eslint-disable-next-line react/destructuring-assignment
          const item = param?.data;
          const allowReCallRevoke =
            workFlowActiveUserPermission?.includes(ActivePermission.CREATOR) &&
            lowerCase(item?.status) === 'submitted';

          return allowReCallRevoke ? (
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
            <div />
          );
        },
      },
    ],
    [
      checkWorkflow,
      dynamicLabels,
      isMultiColumnFilter,
      workFlowActiveUserPermission,
    ],
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
        module: MODULE_TEMPLATE.reportOfFindings,
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

  const dataTable = useMemo(
    () =>
      listReportOfFinding?.data?.map((item) => ({
        id: item?.id || DATA_SPACE,
        refId: item?.refNo || DATA_SPACE,
        entityType: item?.entityType || DATA_SPACE,
        fleetName: item?.rofPlanningRequest?.fleetName || DATA_SPACE,
        vesselName: item?.rofPlanningRequest?.vesselName || DATA_SPACE,
        vesselType: item?.rofPlanningRequest?.vesselTypeName || DATA_SPACE,
        auditCompany: item?.rofPlanningRequest?.auditCompanyName || DATA_SPACE,
        createCompanyName: item?.company?.name || DATA_SPACE,
        department:
          item?.rofPlanningRequest?.departments
            ?.map((i) => i.name)
            .join(', ') || DATA_SPACE,
        vesselFlag: item?.rofPlanningRequest?.countryFlag || DATA_SPACE,
        auditTypes:
          item?.rofAuditTypes?.map((t) => t.auditTypeName).join(', ') ||
          DATA_SPACE,
        leadAuditorName:
          item?.rofUsers?.find((u) => u.relationship === 'leadAuditor')
            ?.username || DATA_SPACE,
        totalFindings: item?.totalFindings || DATA_SPACE,
        totalNonConformity: item?.totalNonConformity || DATA_SPACE,
        totalObservation: item?.totalObservation || DATA_SPACE,
        planningRequestAuditNo: item?.planningRequest?.auditNo || DATA_SPACE,
        planningRequestRefId: item?.planningRequest?.refId || DATA_SPACE,
        sNo: item?.sNo || DATA_SPACE,
        createdAt: item?.createdAt
          ? moment(item?.createdAt).local().format('DD/MM/YYYY HH:mm')
          : DATA_SPACE,
        status: item?.status,
        createdUserId: item?.createdUserId,
        globalStatus: item?.planningRequest?.globalStatus || DATA_SPACE,
        revokeRecall:
          // eslint-disable-next-line no-nested-ternary
          lowerCase(item?.status) === 'submitted'
            ? item?.reviewInProgress
              ? 'Revoke'
              : 'Recall'
            : '',
        reviewInProgress: item.reviewInProgress || '',
        company: item?.company,
        userAssignments: item?.userAssignments,
        vessel: item?.planningRequest?.vessel,
        createdAtOrigin: item?.createdAt,
      })) || [],
    [listReportOfFinding?.data],
  );

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  // render
  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.REPORT_OF_FINDING}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionReportOfFinding,
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
        onPaginationChanged={(event: PaginationChangedEvent) => {
          const pageNumber = event.api.paginationGetCurrentPage();
          setPage(pageNumber);
        }}
        totalItem={listReportOfFinding?.totalItem}
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
              toggle={() => setOpenTemplate((p) => !p)}
              handleSave={handleSaveTemplate}
              templates={listTemplate?.data || []}
              dynamicLabels={dynamicLabels}
            />
            <CustomModalInside
              isOpen={isOpenConfirm}
              title="Confirmation"
              toggle={() => setIsOpenConfirm((prev) => !prev)}
              content={renderConfirm()}
              w="500px"
            />
            <ModalList
              data={listTemplate?.data || []}
              isOpen={modalOpen}
              toggle={setModalOpen}
              dynamicLabels={dynamicLabels}
              templateModule={MODULE_TEMPLATE.reportOfFindings}
            />
          </>
        }
      />
    </div>
  );
}
