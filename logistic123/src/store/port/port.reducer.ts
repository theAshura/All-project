import { PortState } from 'models/store/port/port.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsPortReducer,
  clearPortReducer,
  createPortActions,
  deletePortActions,
  getGMTActions,
  getListPortActions,
  getPortDetailActions,
  updatePortActions,
  updateParamsActions,
  getListPortStrongPreferenceActions,
} from './port.action';

const INITIAL_STATE: PortState = {
  loading: false,
  disable: false,
  listPort: null,
  listPortStringPreference: null,
  portDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
  GMTs: [],
};

const PortReducer = createReducer<PortState>(INITIAL_STATE)
  .handleAction(getListPortActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListPortActions.success, (state, { payload }) => ({
    ...state,
    listPort: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getListPortActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    getListPortStrongPreferenceActions.request,
    (state, { payload }) => ({
      ...state,
      params: payload,
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListPortStrongPreferenceActions.success,
    (state, { payload }) => ({
      ...state,
      listPortStringPreference: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getListPortStrongPreferenceActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deletePortActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deletePortActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deletePortActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createPortActions.request, (state) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createPortActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createPortActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getPortDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getPortDetailActions.success, (state, { payload }) => ({
    ...state,
    portDetail: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getPortDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updatePortActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updatePortActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updatePortActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getGMTActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getGMTActions.success, (state, { payload }) => ({
    ...state,
    GMTs: payload,
    loading: false,
  }))
  .handleAction(getGMTActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearPortReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(clearParamsPortReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }));

export default PortReducer;
