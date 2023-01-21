import {
  ListShoreRankResponse,
  ShoreRank,
  UpdateShoreRankParams,
} from 'models/api/shore-rank/shore-rank.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListShoreRank: () => void;
}

export const getListShoreRankActions = createAsyncAction(
  `@shoreRank/GET_LIST_SHORE_RANK_ACTIONS`,
  `@shoreRank/GET_LIST_SHORE_RANK_ACTIONS_SUCCESS`,
  `@shoreRank/GET_LIST_SHORE_RANK_ACTIONS_FAIL`,
)<CommonApiParam, ListShoreRankResponse, void>();

export const deleteShoreRankActions = createAsyncAction(
  `@shoreRank/DELETE_SHORE_RANK_ACTIONS`,
  `@shoreRank/DELETE_SHORE_RANK_ACTIONS_SUCCESS`,
  `@shoreRank/DELETE_SHORE_RANK_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createShoreRankActions = createAsyncAction(
  `@shoreRank/CREATE_SHORE_RANK_ACTIONS`,
  `@shoreRank/CREATE_SHORE_RANK_ACTIONS_SUCCESS`,
  `@shoreRank/CREATE_SHORE_RANK_ACTIONS_FAIL`,
)<ShoreRank, void, ErrorField[]>();

export const updateShoreRankActions = createAsyncAction(
  `@shoreRank/UPDATE_SHORE_RANK_ACTIONS`,
  `@shoreRank/UPDATE_SHORE_RANK_ACTIONS_SUCCESS`,
  `@shoreRank/UPDATE_SHORE_RANK_ACTIONS_FAIL`,
)<UpdateShoreRankParams, void, ErrorField[]>();

export const getShoreRankDetailActions = createAsyncAction(
  `@shoreRank/GET_SHORE_RANK_ACTIONS`,
  `@shoreRank/GET_SHORE_RANK_ACTIONS_SUCCESS`,
  `@shoreRank/GET_SHORE_RANK_ACTIONS_FAIL`,
)<string, ShoreRank, void>();

export const clearShoreRankReducer = createAction(
  `@shoreRank/CLEAR_SHORE_RANK_REDUCER`,
)<void>();

export const clearParamsShoreRankReducer = createAction(
  `@shoreRank/CLEAR_PARAMS_SHORE_RANK_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@shoreRank/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
