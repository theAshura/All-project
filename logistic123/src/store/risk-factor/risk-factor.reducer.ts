import { RiskFactorStoreModel } from 'models/store/risk-factor/risk-factor.model';
import { createReducer } from 'typesafe-actions';
import {
  clearRiskFactorErrorsReducer,
  clearRiskFactorReducer,
  createRiskFactorActions,
  deleteRiskFactorActions,
  getListRiskFactorActions,
  getListRiskFactorByMainIdActions,
  getRiskFactorDetailActions,
  updateParamsActions,
  updateRiskFactorActions,
} from './risk-factor.action';

const INITIAL_STATE: RiskFactorStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listRiskFactor: undefined,
  riskFactorDetail: null,
  errorList: undefined,
};

const riskFactorReducer = createReducer<RiskFactorStoreModel>(INITIAL_STATE)
  .handleAction(getListRiskFactorActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListRiskFactorActions.success, (state, { payload }) => ({
    ...state,
    listRiskFactor: payload,
    loading: false,
  }))
  .handleAction(getListRiskFactorActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(
    getListRiskFactorByMainIdActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListRiskFactorByMainIdActions.success,
    (state, { payload }) => ({
      ...state,
      listRiskFactor: {
        data: payload,
        page: 1,
        pageSize: payload?.length,
        totalPage: 1,
        totalItem: payload?.length,
      },
      loading: false,
    }),
  )
  .handleAction(getListRiskFactorByMainIdActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteRiskFactorActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteRiskFactorActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteRiskFactorActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateRiskFactorActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateRiskFactorActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateRiskFactorActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createRiskFactorActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createRiskFactorActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createRiskFactorActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getRiskFactorDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getRiskFactorDetailActions.success, (state, { payload }) => ({
    ...state,
    riskFactorDetail: payload,
    loading: false,
  }))
  .handleAction(getRiskFactorDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearRiskFactorErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearRiskFactorReducer, () => ({
    ...INITIAL_STATE,
  }));

export default riskFactorReducer;
