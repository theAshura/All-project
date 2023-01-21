import { ShoreRankState } from 'models/store/shore-rank/shore-rank.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsShoreRankReducer,
  clearShoreRankReducer,
  createShoreRankActions,
  deleteShoreRankActions,
  getListShoreRankActions,
  getShoreRankDetailActions,
  updateShoreRankActions,
  updateParamsActions,
} from './shore-rank.action';

const INITIAL_STATE: ShoreRankState = {
  loading: false,
  disable: false,
  listShoreRank: null,
  errorList: [],
  shoreRankDetail: null,
  params: { isLeftMenu: false },
};

const ShoreRankReducer = createReducer<ShoreRankState>(INITIAL_STATE)
  .handleAction(getListShoreRankActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListShoreRankActions.success, (state, { payload }) => ({
    ...state,
    listShoreRank: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getListShoreRankActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteShoreRankActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteShoreRankActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deleteShoreRankActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createShoreRankActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createShoreRankActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createShoreRankActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getShoreRankDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getShoreRankDetailActions.success, (state, { payload }) => ({
    ...state,
    shoreRankDetail: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getShoreRankDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateShoreRankActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateShoreRankActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateShoreRankActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(clearShoreRankReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearParamsShoreRankReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }));

export default ShoreRankReducer;
