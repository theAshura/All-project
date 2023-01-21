import { createReducer } from 'typesafe-actions';
import { CrewGroupingStoreModel } from '../utils/model';
import {
  getListCrewGroupingActions,
  updateParamsActions,
  deleteCrewGroupingActions,
  updateCrewGroupingActions,
  createCrewGroupingActions,
  getCrewGroupingDetailActions,
  clearCrewGroupingReducer,
  clearCrewGroupingErrorsReducer,
  clearCrewGroupingParamsReducer,
  checkExitCodeAction,
} from './action';

const INITIAL_STATE: CrewGroupingStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listCrewGroupings: undefined,
  cargoDetail: null,
  errorList: undefined,
};

const CrewGroupingReducer = createReducer<CrewGroupingStoreModel>(INITIAL_STATE)
  .handleAction(getListCrewGroupingActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListCrewGroupingActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listCrewGroupings: payload,
  }))
  .handleAction(getListCrewGroupingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteCrewGroupingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCrewGroupingActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteCrewGroupingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateCrewGroupingActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateCrewGroupingActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCrewGroupingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createCrewGroupingActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createCrewGroupingActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createCrewGroupingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getCrewGroupingDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCrewGroupingDetailActions.success, (state, { payload }) => ({
    ...state,
    CrewGroupingDetail: payload,
    loading: false,
  }))
  .handleAction(getCrewGroupingDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCrewGroupingErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearCrewGroupingParamsReducer, (state) => ({
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

  .handleAction(clearCrewGroupingReducer, () => ({
    ...INITIAL_STATE,
  }));

export default CrewGroupingReducer;
