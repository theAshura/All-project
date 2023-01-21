import { FeatureConfigStoreModel } from 'models/store/feature-config/feature-config.model';
import { createReducer } from 'typesafe-actions';
import {
  getListFeatureConfigActions,
  deleteFeatureConfigActions,
  updateFeatureConfigActions,
  createFeatureConfigActions,
  getFeatureConfigDetailActions,
  clearFeatureConfigReducer,
  updateParamsActions,
  clearFeatureConfigErrorsReducer,
} from './feature-config.action';

const INITIAL_STATE: FeatureConfigStoreModel = {
  loading: true,
  params: { isLeftMenu: false },
  listFeatureConfigs: undefined,
  auditTypeDetail: null,
  errorList: undefined,
};

const auditTypeReducer = createReducer<FeatureConfigStoreModel>(INITIAL_STATE)
  .handleAction(getListFeatureConfigActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListFeatureConfigActions.success, (state, { payload }) => ({
    ...state,
    listFeatureConfigs: payload,
    loading: false,
  }))
  .handleAction(getListFeatureConfigActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteFeatureConfigActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteFeatureConfigActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteFeatureConfigActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateFeatureConfigActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateFeatureConfigActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateFeatureConfigActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createFeatureConfigActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createFeatureConfigActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createFeatureConfigActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getFeatureConfigDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getFeatureConfigDetailActions.success,
    (state, { payload }) => ({
      ...state,
      auditTypeDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getFeatureConfigDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearFeatureConfigErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearFeatureConfigReducer, () => ({
    ...INITIAL_STATE,
  }));

export default auditTypeReducer;
