import { ShipRankStoreModel } from 'models/store/ship-rank/ship-rank.model';
import { createReducer } from 'typesafe-actions';
import {
  getListShipRankActions,
  deleteShipRankActions,
  updateShipRankActions,
  createShipRankActions,
  getShipRankDetailActions,
  clearShipRankReducer,
  updateParamsActions,
  clearShipRankErrorsReducer,
} from './ship-rank.action';

const INITIAL_STATE: ShipRankStoreModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },

  listShipRanks: undefined,
  ShipRankDetail: null,
  errorList: undefined,
};

const ShipRankReducer = createReducer<ShipRankStoreModel>(INITIAL_STATE)
  .handleAction(getListShipRankActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListShipRankActions.success, (state, { payload }) => ({
    ...state,
    listShipRanks: payload,
    loading: false,
  }))
  .handleAction(getListShipRankActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteShipRankActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteShipRankActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteShipRankActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateShipRankActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateShipRankActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateShipRankActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createShipRankActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createShipRankActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createShipRankActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getShipRankDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getShipRankDetailActions.success, (state, { payload }) => ({
    ...state,
    ShipRankDetail: payload,
    loading: false,
  }))
  .handleAction(getShipRankDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearShipRankErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearShipRankReducer, () => ({
    ...INITIAL_STATE,
  }));

export default ShipRankReducer;
