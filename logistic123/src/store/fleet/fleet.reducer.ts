import { FleetStoreModel } from 'models/store/fleet/fleet.model';
import { createReducer } from 'typesafe-actions';
import {
  getListFleetActions,
  getListCompanyActions,
  updateParamsActions,
  deleteFleetActions,
  updateFleetActions,
  createFleetActions,
  getFleetDetailActions,
  clearFleetReducer,
  clearFleetErrorsReducer,
  clearFleetParamsReducer,
} from './fleet.action';

const INITIAL_STATE: FleetStoreModel = {
  loading: true,
  loadingCompany: false,
  disable: false,
  params: { isLeftMenu: false },

  listCompany: undefined,
  listFleets: undefined,
  FleetDetail: null,
  errorList: undefined,
};

const fleetReducer = createReducer<FleetStoreModel>(INITIAL_STATE)
  .handleAction(getListFleetActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListFleetActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listFleets: payload,
  }))
  .handleAction(getListFleetActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getListCompanyActions.request, (state) => ({
    ...state,
    loadingCompany: true,
  }))
  .handleAction(getListCompanyActions.success, (state, { payload }) => ({
    ...state,
    loadingCompany: false,
    listCompany: payload,
  }))
  .handleAction(getListCompanyActions.failure, (state) => ({
    ...state,
    loadingCompany: false,
  }))
  .handleAction(deleteFleetActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteFleetActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteFleetActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateFleetActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateFleetActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateFleetActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createFleetActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createFleetActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createFleetActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getFleetDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getFleetDetailActions.success, (state, { payload }) => ({
    ...state,
    FleetDetail: payload,
    loading: false,
  }))
  .handleAction(getFleetDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearFleetErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearFleetParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearFleetReducer, () => ({
    ...INITIAL_STATE,
  }));

export default fleetReducer;
