import {
  GetInjuryResponse,
  CreateInjuryParams,
  UpdateInjuryParams,
  InjuryDetailResponse,
  GetInjuryMasterResponse,
  GetInjuryBodyResponse,
} from 'models/api/injury/injury.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteInjury {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListInjuryActions = createAsyncAction(
  `@injury/GET_LIST_INJURY_ACTIONS`,
  `@injury/GET_LIST_INJURY_ACTIONS_SUCCESS`,
  `@injury/GET_LIST_INJURY_ACTIONS_FAIL`,
)<CommonApiParam, GetInjuryResponse, void>();

export const getListInjuryMasterActions = createAsyncAction(
  `@injury/GET_LIST_INJURY_MASTER_ACTIONS`,
  `@injury/GET_LIST_INJURY_MASTER_ACTIONS_SUCCESS`,
  `@injury/GET_LIST_INJURY_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, GetInjuryMasterResponse, void>();

export const getListInjuryBodyActions = createAsyncAction(
  `@injury/GET_LIST_INJURY_BODY_ACTIONS`,
  `@injury/GET_LIST_INJURY_BODY_ACTIONS_SUCCESS`,
  `@injury/GET_LIST_INJURY_BODY_ACTIONS_FAIL`,
)<CommonApiParam, GetInjuryBodyResponse, void>();

export const createInjuryActions = createAsyncAction(
  `@injury/CREATE_INJURY_ACTIONS`,
  `@injury/CREATE_INJURY_ACTIONS_SUCCESS`,
  `@injury/CREATE_INJURY_ACTIONS_FAIL`,
)<CreateInjuryParams, void, ErrorField[]>();

export const deleteInjuryActions = createAsyncAction(
  `@injury/DELETE_INJURY_ACTIONS`,
  `@injury/DELETE_INJURY_ACTIONS_SUCCESS`,
  `@injury/DELETE_INJURY_ACTIONS_FAIL`,
)<ParamsDeleteInjury, CommonApiParam, void>();

export const updateInjuryActions = createAsyncAction(
  `@injury/UPDATE_INJURY_ACTIONS`,
  `@injury/UPDATE_INJURY_ACTIONS_SUCCESS`,
  `@injury/UPDATE_INJURY_ACTIONS_FAIL`,
)<UpdateInjuryParams, void, ErrorField[]>();

export const getInjuryDetailActions = createAsyncAction(
  `@injury/GET_INJURY_DETAIL_ACTIONS`,
  `@injury/GET_INJURY_DETAIL_ACTIONS_SUCCESS`,
  `@injury/GET_INJURY_DETAIL_ACTIONS_FAIL`,
)<string, InjuryDetailResponse, void>();

export const clearInjuryReducer = createAction(
  `@injury/CLEAR_INJURY_REDUCER`,
)<void>();

export const clearInjuryErrorsReducer = createAction(
  `@injury/CLEAR_INJURY_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@injury/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearInjuryParamsReducer = createAction(
  `@injury/CLEAR_INJURY_PARAMS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@injury/SET_DATA_FILTER`,
)<CommonApiParam>();
