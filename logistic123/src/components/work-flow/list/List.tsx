import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DATA_SPACE,
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { WorkflowConfigType } from 'constants/components/workflow-config.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { WORK_FLOW_FIELDS_LIST } from 'constants/dynamic/work-flow.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { Action } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteWorkFlowActions,
  getListWorkFlowActions,
} from 'store/work-flow/work-flow.action';

interface ListWorkFlowProp {
  tab: string;
}

export default function ListWorkFlow(props: ListWorkFlowProp) {
  const dispatch = useDispatch();
  const { tab } = props;
  const { loading, listWorkFlows, params, dataFilter } = useSelector(
    (state) => state.workFlow,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const viewDetail = useCallback((id?: string) => {
    history.push(AppRouteConst.getWorkFlowById(id));
  }, []);
  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getWorkFlowById(id)}?edit`);
  }, []);

  const dataTable = useMemo(
    () =>
      listWorkFlows?.data?.map((item, index) => ({
        id: item?.id || DATA_SPACE,
        version: item.version || DATA_SPACE,
        status: item?.status || DATA_SPACE,
        description: item?.description || DATA_SPACE,
        company: item?.company?.name || DATA_SPACE,
        createdUserId: item?.createdUserId,
      })) || [],
    [listWorkFlows],
  );
  const templateTab = useMemo(() => {
    switch (tab) {
      case WorkflowConfigType.Planning:
        return MODULE_TEMPLATE.workflowPlanningTab;
      case WorkflowConfigType.AuditChecklist:
        return MODULE_TEMPLATE.workflowAuditChecklistTab;
      case WorkflowConfigType.ReportFinding:
        return MODULE_TEMPLATE.workflowReportFindingTab;
      case WorkflowConfigType.InternalAuditReport:
        return MODULE_TEMPLATE.workflowInternalAuditReportTab;
      case WorkflowConfigType.CarCap:
        return MODULE_TEMPLATE.workflowCARCAPTab;
      case WorkflowConfigType.SelfAssessment:
        return MODULE_TEMPLATE.workflowSelfAssessmentTab;
      default:
        return tab;
    }
  }, [tab]);

  const fileNameExport = useMemo(() => {
    switch (tab) {
      case WorkflowConfigType.Planning:
        return 'Workflow Planning';
      case WorkflowConfigType.AuditChecklist:
        return 'Workflow Inspection Checklist Template';
      case WorkflowConfigType.ReportFinding:
        return 'Workflow Reports of Finding';
      case WorkflowConfigType.InternalAuditReport:
        return 'Workflow Inspection Report';
      case WorkflowConfigType.CarCap:
        return 'Workflow CAR/CAP';
      case WorkflowConfigType.SelfAssessment:
        return 'Workflow Self Assessment';
      default:
        return tab;
    }
  }, [tab]);

  const handleGetList = useCallback(() => {
    dispatch(
      getListWorkFlowActions.request({
        pageSize: -1,
        workflowType: tab?.replaceAll('-', ' '),
        tabKey: tab,
      }),
    );
  }, [dispatch, tab]);

  const handleDeleteCharterOwner = useCallback(
    (id: string) => {
      dispatch(
        deleteWorkFlowActions.request({
          id,
          handleSuccess: () => handleGetList(),
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
    modulePage: ModulePage.List,
  });

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_LIST['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_LIST[
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
        onPressButtonRight: () => handleDeleteCharterOwner(id),
      });
    },
    [dynamicLabels, handleDeleteCharterOwner],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_LIST.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => viewDetail(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
          ];

          if (userInfo?.id === data?.createdUserId) {
            actions = [
              ...actions,
              {
                img: images.icons.icEdit,
                function: () => editDetail(data?.id),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
                action: ActionTypeEnum.UPDATE,
              },
              {
                img: images.icons.icRemove,
                function: () => handleDelete(data.id),
                feature: Features.CONFIGURATION,
                subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
              },
            ];
          }
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                // styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'version',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_LIST['Version number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_LIST.Status,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'description',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_LIST.Description,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'company',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_LIST['Created by company'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo?.id,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  // render
  return (
    <div>
      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        columnDefs={columnDefs}
        dataFilter={dataFilter}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        moduleTemplate={templateTab}
        dataTable={dataTable}
        fileName={fileNameExport}
        height="calc(100vh - 183px)"
        getList={handleGetList}
        hasRangePicker={false}
      />
    </div>
  );
}
