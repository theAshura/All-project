import { RankMasterState } from 'models/store/rank-master/rank-master.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsRankMasterReducer,
  clearRankMasterErrorsReducer,
  clearRankMasterReducer,
  createRankMasterActions,
  deleteRankMasterActions,
  getListRankMasterActions,
  getRankMasterDetailActions,
  updateRankMasterActions,
  updateParamsActions,
} from './rank-master.action';

const INITIAL_STATE: RankMasterState = {
  loading: false,
  disable: false,
  listRankMaster: null,
  rankMasterDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const RankMasterReducer = createReducer<RankMasterState>(INITIAL_STATE)
  .handleAction(getListRankMasterActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListRankMasterActions.success, (state, { payload }) => ({
    ...state,
    listRankMaster: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getListRankMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteRankMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteRankMasterActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deleteRankMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createRankMasterActions.request, (state) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createRankMasterActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createRankMasterActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getRankMasterDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getRankMasterDetailActions.success, (state, { payload }) => ({
    ...state,
    rankMasterDetail: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getRankMasterDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateRankMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateRankMasterActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateRankMasterActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(clearRankMasterReducer, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(clearParamsRankMasterReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))
  .handleAction(clearRankMasterErrorsReducer, (state) => ({
    ...state,
    errorList: [],
  }));

export default RankMasterReducer;
