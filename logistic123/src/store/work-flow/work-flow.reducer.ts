import { WorkFlowState } from 'models/store/work-flow/work-flow.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsWorkFlowReducer,
  clearWorkFlowReducer,
  createWorkFlowActions,
  deleteWorkFlowActions,
  getListAuditorsActions,
  getListWorkFlowActions,
  getWorkFlowActiveUserPermissionActions,
  getWorkFlowPermissionStepActions,
  getWorkFlowDetailActions,
  updateParamsActions,
  updateWorkFlowActions,
} from './work-flow.action';

const INITIAL_STATE: WorkFlowState = {
  loading: false,
  disable: false,
  listWorkFlows: null,
  workFlowDetail: null,
  workFlowActiveUserPermission: [],
  workFlowPermissionStep: [],
  auditors: [],
  errorList: [],
  params: { isLeftMenu: false },
};

const WorkFlowReducer = createReducer<WorkFlowState>(INITIAL_STATE)
  .handleAction(getListWorkFlowActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListWorkFlowActions.success, (state, { payload }) => ({
    ...state,
    listWorkFlows: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getListWorkFlowActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteWorkFlowActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteWorkFlowActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deleteWorkFlowActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createWorkFlowActions.request, (state) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createWorkFlowActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createWorkFlowActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getWorkFlowDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getWorkFlowDetailActions.success, (state, { payload }) => ({
    ...state,
    workFlowDetail: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getWorkFlowDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateWorkFlowActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateWorkFlowActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateWorkFlowActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))

  .handleAction(getWorkFlowActiveUserPermissionActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getWorkFlowActiveUserPermissionActions.success,
    (state, { payload }) => ({
      ...state,
      workFlowActiveUserPermission: payload,
      loading: false,
    }),
  )

  .handleAction(getWorkFlowActiveUserPermissionActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListAuditorsActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getListAuditorsActions.success, (state, { payload }) => ({
    ...state,
    auditors: payload,
    loading: false,
  }))

  .handleAction(getListAuditorsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearWorkFlowReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearParamsWorkFlowReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }))
  .handleAction(getWorkFlowPermissionStepActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getWorkFlowPermissionStepActions.success,
    (state, { payload }) => ({
      ...state,
      workFlowPermissionStep: payload,
      loading: false,
    }),
  )

  .handleAction(getWorkFlowPermissionStepActions.failure, (state) => ({
    ...state,
    loading: false,
  }));

export default WorkFlowReducer;
