import {
  ListRankMasterResponse,
  RankMaster,
  UpdateRankMasterParams,
} from 'models/api/rank-master/rank-master.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListRankMaster: () => void;
}

export const getListRankMasterActions = createAsyncAction(
  `@rank/GET_LIST_RankMaster_ACTIONS`,
  `@rank/GET_LIST_RankMaster_ACTIONS_SUCCESS`,
  `@rank/GET_LIST_RankMaster_ACTIONS_FAIL`,
)<CommonApiParam, ListRankMasterResponse, void>();

export const deleteRankMasterActions = createAsyncAction(
  `@rank/DELETE_RankMaster_ACTIONS`,
  `@rank/DELETE_RankMaster_ACTIONS_SUCCESS`,
  `@rank/DELETE_RankMaster_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createRankMasterActions = createAsyncAction(
  `@rank/CREATE_RankMaster_ACTIONS`,
  `@rank/CREATE_RankMaster_ACTIONS_SUCCESS`,
  `@rank/CREATE_RankMaster_ACTIONS_FAIL`,
)<RankMaster, void, ErrorField[]>();

export const updateRankMasterActions = createAsyncAction(
  `@rank/UPDATE_RankMaster_ACTIONS`,
  `@rank/UPDATE_RankMaster_ACTIONS_SUCCESS`,
  `@rank/UPDATE_RankMaster_ACTIONS_FAIL`,
)<UpdateRankMasterParams, void, ErrorField[]>();

export const getRankMasterDetailActions = createAsyncAction(
  `@rank/GET_RankMaster_ACTIONS`,
  `@rank/GET_RankMaster_ACTIONS_SUCCESS`,
  `@rank/GET_RankMaster_ACTIONS_FAIL`,
)<RankMaster, RankMaster, void>();

export const clearRankMasterReducer = createAction(
  `@rank/CLEAR_RankMaster_REDUCER`,
)<void>();

export const clearParamsRankMasterReducer = createAction(
  `@rank/CLEAR_PARAMS_RankMaster_REDUCER`,
)<void>();

export const clearRankMasterErrorsReducer = createAction(
  `@rank/CLEAR_ERRORS_RankMaster_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@rank/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
