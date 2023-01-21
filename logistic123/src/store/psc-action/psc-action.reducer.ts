import { PscActionStoreModel } from 'models/store/psc-action/psc-action.model';
import { createReducer } from 'typesafe-actions';
import {
  getListPscActions,
  deletePscActions,
  updatePscActions,
  createPscActions,
  getPscActionDetailActions,
  clearPscActionReducer,
  updateParamsActions,
  clearPscActionErrorsReducer,
} from './psc-action.action';

const INITIAL_STATE: PscActionStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listPscActions: undefined,
  pscActionDetail: null,
  errorList: undefined,
};

const pscActionReducer = createReducer<PscActionStoreModel>(INITIAL_STATE)
  .handleAction(getListPscActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListPscActions.success, (state, { payload }) => ({
    ...state,
    listPscActions: payload,
    loading: false,
  }))
  .handleAction(getListPscActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deletePscActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deletePscActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deletePscActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updatePscActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updatePscActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updatePscActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createPscActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createPscActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createPscActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getPscActionDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getPscActionDetailActions.success, (state, { payload }) => ({
    ...state,
    pscActionDetail: payload,
    loading: false,
  }))
  .handleAction(getPscActionDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearPscActionErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearPscActionReducer, () => ({
    ...INITIAL_STATE,
  }));

export default pscActionReducer;
