import { FocusRequestStoreModel } from 'models/store/focus-request/focus-request.model';
import { createReducer } from 'typesafe-actions';
import {
  getListFocusRequestActions,
  updateParamsActions,
  deleteFocusRequestActions,
  updateFocusRequestActions,
  createFocusRequestActions,
  getFocusRequestDetailActions,
  clearFocusRequestReducer,
  clearFocusRequestErrorsReducer,
  clearFocusRequestParamsReducer,
} from './focus-request.action';

const INITIAL_STATE: FocusRequestStoreModel = {
  loading: true,
  params: { isLeftMenu: false },
  listFocusRequests: undefined,
  FocusRequestDetail: null,
  errorList: undefined,
};

const fleetReducer = createReducer<FocusRequestStoreModel>(INITIAL_STATE)
  .handleAction(getListFocusRequestActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListFocusRequestActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listFocusRequests: payload,
  }))
  .handleAction(getListFocusRequestActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteFocusRequestActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteFocusRequestActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteFocusRequestActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateFocusRequestActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateFocusRequestActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateFocusRequestActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createFocusRequestActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createFocusRequestActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createFocusRequestActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getFocusRequestDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getFocusRequestDetailActions.success, (state, { payload }) => ({
    ...state,
    FocusRequestDetail: payload,
    loading: false,
  }))
  .handleAction(getFocusRequestDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearFocusRequestErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearFocusRequestParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearFocusRequestReducer, () => ({
    ...INITIAL_STATE,
  }));

export default fleetReducer;
