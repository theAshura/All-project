import { createReducer } from 'typesafe-actions';
import { TransferTypeStoreModel } from '../utils/model';
import {
  getListTransferTypeActions,
  updateParamsActions,
  deleteTransferTypeActions,
  updateTransferTypeActions,
  createTransferTypeActions,
  getTransferTypeDetailActions,
  clearTransferTypeReducer,
  clearTransferTypeErrorsReducer,
  clearTransferTypeParamsReducer,
  checkExitCodeAction,
} from './action';

const INITIAL_STATE: TransferTypeStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listTransferTypes: undefined,
  transferTypeDetail: null,
  errorList: undefined,
};

const transferTypeReducer = createReducer<TransferTypeStoreModel>(INITIAL_STATE)
  .handleAction(getListTransferTypeActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListTransferTypeActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listTransferTypes: payload,
  }))
  .handleAction(getListTransferTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteTransferTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteTransferTypeActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteTransferTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateTransferTypeActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateTransferTypeActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateTransferTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createTransferTypeActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createTransferTypeActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createTransferTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getTransferTypeDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getTransferTypeDetailActions.success, (state, { payload }) => ({
    ...state,
    transferTypeDetail: payload,
    loading: false,
  }))
  .handleAction(getTransferTypeDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearTransferTypeErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearTransferTypeParamsReducer, (state) => ({
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

  .handleAction(clearTransferTypeReducer, () => ({
    ...INITIAL_STATE,
  }));

export default transferTypeReducer;
