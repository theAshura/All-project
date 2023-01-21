import { createReducer } from 'typesafe-actions';
import { PlanDrawingStoreModel } from '../utils/model';
import {
  getListPlanDrawingActions,
  updateParamsActions,
  deletePlanDrawingActions,
  updatePlanDrawingActions,
  createPlanDrawingActions,
  getPlanDrawingDetailActions,
  clearPlanDrawingReducer,
  clearPlanDrawingErrorsReducer,
  clearPlanDrawingParamsReducer,
  checkExitCodeAction,
} from './action';

const INITIAL_STATE: PlanDrawingStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listPlanDrawings: undefined,
  planDrawingDetail: null,
  errorList: undefined,
};

const PlanDrawingReducer = createReducer<PlanDrawingStoreModel>(INITIAL_STATE)
  .handleAction(getListPlanDrawingActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListPlanDrawingActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listPlanDrawings: payload,
  }))
  .handleAction(getListPlanDrawingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deletePlanDrawingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deletePlanDrawingActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deletePlanDrawingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updatePlanDrawingActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updatePlanDrawingActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updatePlanDrawingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createPlanDrawingActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createPlanDrawingActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createPlanDrawingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getPlanDrawingDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getPlanDrawingDetailActions.success, (state, { payload }) => ({
    ...state,
    PlanDrawingDetail: payload,
    loading: false,
  }))
  .handleAction(getPlanDrawingDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearPlanDrawingErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearPlanDrawingParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(checkExitCodeAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(checkExitCodeAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    isExistField: payload,
  }))
  .handleAction(checkExitCodeAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearPlanDrawingReducer, () => ({
    ...INITIAL_STATE,
  }));

export default PlanDrawingReducer;
