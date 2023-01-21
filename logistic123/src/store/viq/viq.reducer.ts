import { VIQStoreModel } from 'models/store/viq/viq.model';
import { createReducer } from 'typesafe-actions';
import {
  getListVIQActions,
  deleteVIQActions,
  updateVIQActions,
  createVIQActions,
  getListPotentialRiskActions,
  getVIQDetailActions,
  clearVIQReducer,
  updateParamsActions,
  clearVIQErrorsReducer,
} from './viq.action';

const INITIAL_STATE: VIQStoreModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },

  potentialRisk: undefined,
  listVIQs: undefined,
  VIQDetail: undefined,
  errorList: undefined,
};

const VIQReducer = createReducer<VIQStoreModel>(INITIAL_STATE)
  .handleAction(getListVIQActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListVIQActions.success, (state, { payload }) => ({
    ...state,
    listVIQs: payload,
    loading: false,
  }))
  .handleAction(getListVIQActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListPotentialRiskActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getListPotentialRiskActions.success, (state, { payload }) => ({
    ...state,
    potentialRisk: payload,
    loading: false,
  }))
  .handleAction(getListPotentialRiskActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  // viq

  .handleAction(createVIQActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createVIQActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createVIQActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(updateVIQActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateVIQActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateVIQActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(deleteVIQActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteVIQActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteVIQActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  // detail

  .handleAction(getVIQDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getVIQDetailActions.success, (state, { payload }) => ({
    ...state,
    VIQDetail: payload,
    loading: false,
  }))
  .handleAction(getVIQDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearVIQErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearVIQReducer, () => ({
    ...INITIAL_STATE,
  }));

export default VIQReducer;
