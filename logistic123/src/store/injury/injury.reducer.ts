import { InjuryStoreModel } from 'models/store/injury/injury.model';
import { createReducer } from 'typesafe-actions';
import {
  createInjuryActions,
  clearInjuryReducer,
  clearInjuryErrorsReducer,
  clearInjuryParamsReducer,
  getListInjuryActions,
  deleteInjuryActions,
  updateInjuryActions,
  getInjuryDetailActions,
  getListInjuryMasterActions,
  getListInjuryBodyActions,
} from './injury.action';

const INITIAL_STATE: InjuryStoreModel = {
  loading: true,
  loadingCompany: false,
  disable: false,
  params: { isLeftMenu: false },
  errorList: undefined,
  dataFilter: null,
  listInjury: undefined,
  listInjuryMaster: undefined,
  listInjuryBody: undefined,
  injuryDetail: null,
};

const injuryReducer = createReducer<InjuryStoreModel>(INITIAL_STATE)
  .handleAction(getListInjuryActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListInjuryActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listInjury: payload,
  }))
  .handleAction(getListInjuryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getListInjuryMasterActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListInjuryMasterActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listInjuryMaster: payload,
  }))
  .handleAction(getListInjuryMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getListInjuryBodyActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListInjuryBodyActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listInjuryBody: payload,
  }))
  .handleAction(getListInjuryBodyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createInjuryActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createInjuryActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createInjuryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))
  .handleAction(deleteInjuryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteInjuryActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteInjuryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateInjuryActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateInjuryActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateInjuryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))
  .handleAction(getInjuryDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getInjuryDetailActions.success, (state, { payload }) => ({
    ...state,
    injuryDetail: payload,
    loading: false,
  }))
  .handleAction(getInjuryDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearInjuryErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearInjuryParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearInjuryReducer, (state) => ({
    ...INITIAL_STATE,
  }));

export default injuryReducer;
