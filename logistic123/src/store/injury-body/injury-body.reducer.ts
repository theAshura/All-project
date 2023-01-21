import { InjuryBodyStoreModel } from 'models/store/injury-body/injury-body.model';
import { createReducer } from 'typesafe-actions';
import {
  getListInjuryBodyActions,
  updateParamsActions,
  deleteInjuryBodyActions,
  updateInjuryBodyActions,
  createInjuryBodyActions,
  getInjuryBodyDetailActions,
  clearInjuryBodyReducer,
  clearInjuryBodyErrorsReducer,
  clearInjuryBodyParamsReducer,
} from './injury-body.action';

const INITIAL_STATE: InjuryBodyStoreModel = {
  loading: true,
  params: { isLeftMenu: false },
  listInjuryBody: undefined,
  InjuryBodyDetail: null,
  errorList: undefined,
};

const fleetReducer = createReducer<InjuryBodyStoreModel>(INITIAL_STATE)
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

  .handleAction(deleteInjuryBodyActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteInjuryBodyActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteInjuryBodyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateInjuryBodyActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateInjuryBodyActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateInjuryBodyActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createInjuryBodyActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createInjuryBodyActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
    errorList: [],
  }))
  .handleAction(createInjuryBodyActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getInjuryBodyDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getInjuryBodyDetailActions.success, (state, { payload }) => ({
    ...state,
    InjuryBodyDetail: payload,
    loading: false,
  }))
  .handleAction(getInjuryBodyDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearInjuryBodyErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearInjuryBodyParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearInjuryBodyReducer, () => ({
    ...INITIAL_STATE,
  }));

export default fleetReducer;
