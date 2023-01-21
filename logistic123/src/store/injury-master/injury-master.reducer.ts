import { InjuryMasterStoreModel } from 'models/store/injury-master/injury-master.model';
import { createReducer } from 'typesafe-actions';
import {
  getListInjuryMasterActions,
  updateParamsActions,
  deleteInjuryMasterActions,
  updateInjuryMasterActions,
  createInjuryMasterActions,
  getInjuryMasterDetailActions,
  clearInjuryMasterReducer,
  clearInjuryMasterErrorsReducer,
  clearInjuryMasterParamsReducer,
} from './injury-master.action';

const INITIAL_STATE: InjuryMasterStoreModel = {
  loading: true,
  params: { isLeftMenu: false },
  listInjuryMasters: undefined,
  InjuryMasterDetail: null,
  errorList: undefined,
};

const fleetReducer = createReducer<InjuryMasterStoreModel>(INITIAL_STATE)
  .handleAction(getListInjuryMasterActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListInjuryMasterActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listInjuryMasters: payload,
  }))
  .handleAction(getListInjuryMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteInjuryMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteInjuryMasterActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteInjuryMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateInjuryMasterActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateInjuryMasterActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateInjuryMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createInjuryMasterActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createInjuryMasterActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createInjuryMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getInjuryMasterDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getInjuryMasterDetailActions.success, (state, { payload }) => ({
    ...state,
    InjuryMasterDetail: payload,
    loading: false,
  }))
  .handleAction(getInjuryMasterDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearInjuryMasterErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearInjuryMasterParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearInjuryMasterReducer, () => ({
    ...INITIAL_STATE,
  }));

export default fleetReducer;
