import {
  GetShipRanksResponse,
  CreateShipRankParams,
  UpdateShipRankParams,
  ShipRankDetailResponse,
} from 'models/api/ship-rank/ship-rank.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getList: () => void;
}

export const getListShipRankActions = createAsyncAction(
  `@ShipRank/GET_LIST_SHIP_RANK_ACTIONS`,
  `@ShipRank/GET_LIST_SHIP_RANK_ACTIONS_SUCCESS`,
  `@ShipRank/GET_LIST_SHIP_RANK_ACTIONS_FAIL`,
)<CommonApiParam, GetShipRanksResponse, void>();

export const deleteShipRankActions = createAsyncAction(
  `@ShipRank/DELETE_SHIP_RANK_ACTIONS`,
  `@ShipRank/DELETE_SHIP_RANK_ACTIONS_SUCCESS`,
  `@ShipRank/DELETE_SHIP_RANK_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createShipRankActions = createAsyncAction(
  `@ShipRank/CREATE_SHIP_RANK_ACTIONS`,
  `@ShipRank/CREATE_SHIP_RANK_ACTIONS_SUCCESS`,
  `@ShipRank/CREATE_SHIP_RANK_ACTIONS_FAIL`,
)<CreateShipRankParams, void, ErrorField[]>();

export const updateShipRankActions = createAsyncAction(
  `@ShipRank/UPDATE_SHIP_RANK_ACTIONS`,
  `@ShipRank/UPDATE_SHIP_RANK_ACTIONS_SUCCESS`,
  `@ShipRank/UPDATE_SHIP_RANK_ACTIONS_FAIL`,
)<UpdateShipRankParams, void, ErrorField[]>();

export const getShipRankDetailActions = createAsyncAction(
  `@ShipRank/GET_CHARTER_OWNER_DETAIL_ACTIONS`,
  `@ShipRank/GET_CHARTER_OWNER_DETAIL_ACTIONS_SUCCESS`,
  `@ShipRank/GET_CHARTER_OWNER_DETAIL_ACTIONS_FAIL`,
)<string, ShipRankDetailResponse, void>();

export const clearShipRankReducer = createAction(
  `@ShipRank/CLEAR_CHARTER_OWNER_REDUCER`,
)<void>();

export const clearShipRankErrorsReducer = createAction(
  `@ShipRank/CLEAR_CHARTER_OWNER_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@ShipRank/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
