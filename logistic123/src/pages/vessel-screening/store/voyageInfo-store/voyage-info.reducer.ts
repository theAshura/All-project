import { VoyageInfoStoreModel } from 'pages/vessel-screening/utils/models/voyage-info.model';
import { createReducer } from 'typesafe-actions';

import {
  getListVoyageInfoActions,
  getVoyageInfoDetailActions,
} from './voyage-info.action';

const INITIAL_STATE: VoyageInfoStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  listVoyageInfo: undefined,
  voyageInfoDetail: null,
};

const VoyageInfoReducer = createReducer<VoyageInfoStoreModel>(INITIAL_STATE)
  .handleAction(getListVoyageInfoActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListVoyageInfoActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listVoyageInfo: payload,
  }))
  .handleAction(getListVoyageInfoActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getVoyageInfoDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getVoyageInfoDetailActions.success, (state, { payload }) => ({
    ...state,
    voyageInfoDetail: payload,
    loading: false,
  }))
  .handleAction(getVoyageInfoDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }));

export default VoyageInfoReducer;
