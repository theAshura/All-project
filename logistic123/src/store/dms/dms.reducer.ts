import { DMSStoreModel } from 'models/store/dms/dms.model';
import { createReducer } from 'typesafe-actions';
import {
  clearDMSErrorsReducer,
  clearDMSReducer,
  createDMSActions,
  deleteDMSActions,
  downloadFileActions,
  getDMSDetailActions,
  getListDMSActions,
  getListFileActions,
  updateParamsActions,
  updateDMSActions,
} from './dms.action';

const INITIAL_STATE: DMSStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listDMSs: undefined,
  DMSDetail: null,
  errorList: undefined,
  fileList: [],
};

const DMSReducer = createReducer<DMSStoreModel>(INITIAL_STATE)
  .handleAction(getListDMSActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListDMSActions.success, (state, { payload }) => ({
    ...state,
    listDMSs: payload,
    loading: false,
  }))
  .handleAction(getListDMSActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteDMSActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(deleteDMSActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteDMSActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateDMSActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateDMSActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateDMSActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createDMSActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createDMSActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createDMSActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getDMSDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getDMSDetailActions.success, (state, { payload }) => ({
    ...state,
    DMSDetail: payload,
    loading: false,
  }))
  .handleAction(getDMSDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListFileActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getListFileActions.success, (state, { payload }) => ({
    ...state,
    fileList: payload,
    loading: false,
  }))
  .handleAction(getListFileActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(downloadFileActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(downloadFileActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(downloadFileActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearDMSErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearDMSReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }));

export default DMSReducer;
