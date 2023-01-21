import { CDIStoreModel } from 'models/store/cdi/cdi.model';
import { createReducer } from 'typesafe-actions';
import {
  getListCDIActions,
  deleteCDIActions,
  updateCDIActions,
  createCDIActions,
  getCDIDetailActions,
  clearCDIReducer,
  updateParamsActions,
  clearCDIErrorsReducer,
} from './cdi.action';

const INITIAL_STATE: CDIStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listCDIs: undefined,
  CDIDetail: null,
  errorList: undefined,
};

const CDIReducer = createReducer<CDIStoreModel>(INITIAL_STATE)
  .handleAction(getListCDIActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListCDIActions.success, (state, { payload }) => ({
    ...state,
    listCDIs: payload,
    loading: false,
  }))
  .handleAction(getListCDIActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteCDIActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCDIActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteCDIActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateCDIActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateCDIActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCDIActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createCDIActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createCDIActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createCDIActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getCDIDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCDIDetailActions.success, (state, { payload }) => ({
    ...state,
    CDIDetail: payload,
    loading: false,
  }))
  .handleAction(getCDIDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCDIErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearCDIReducer, () => ({
    ...INITIAL_STATE,
  }));

export default CDIReducer;
