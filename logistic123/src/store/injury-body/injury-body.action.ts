import {
  GetInjuryBodyResponse,
  CreateInjuryBodyParams,
  UpdateInjuryBodyParams,
  InjuryBodyDetailResponse,
} from 'models/api/injury-body/injury-body.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteInjuryBody {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListInjuryBodyActions = createAsyncAction(
  `@InjuryBody/GET_LIST_INJURY_BODY_ACTIONS`,
  `@InjuryBody/GET_LIST_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryBody/GET_LIST_INJURY_BODY_ACTIONS_FAIL`,
)<CommonApiParam, GetInjuryBodyResponse, void>();

export const deleteInjuryBodyActions = createAsyncAction(
  `@InjuryBody/DELETE_INJURY_BODY_ACTIONS`,
  `@InjuryBody/DELETE_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryBody/DELETE_INJURY_BODY_ACTIONS_FAIL`,
)<ParamsDeleteInjuryBody, CommonApiParam, void>();

export const createInjuryBodyActions = createAsyncAction(
  `@InjuryBody/CREATE_INJURY_BODY_ACTIONS`,
  `@InjuryBody/CREATE_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryBody/CREATE_INJURY_BODY_ACTIONS_FAIL`,
)<CreateInjuryBodyParams, void, ErrorField[]>();

export const updateInjuryBodyActions = createAsyncAction(
  `@InjuryBody/UPDATE_INJURY_BODY_ACTIONS`,
  `@InjuryBody/UPDATE_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryBody/UPDATE_INJURY_BODY_ACTIONS_FAIL`,
)<UpdateInjuryBodyParams, void, ErrorField[]>();

export const getInjuryBodyDetailActions = createAsyncAction(
  `@InjuryBody/GET_INJURY_BODY_DETAIL_ACTIONS`,
  `@InjuryBody/GET_INJURY_BODY_DETAIL_ACTIONS_SUCCESS`,
  `@InjuryBody/GET_INJURY_BODY_DETAIL_ACTIONS_FAIL`,
)<string, InjuryBodyDetailResponse, void>();

export const clearInjuryBodyReducer = createAction(
  `@InjuryBody/CLEAR_INJURY_BODY_REDUCER`,
)<void>();

export const clearInjuryBodyErrorsReducer = createAction(
  `@InjuryBody/CLEAR_INJURY_BODY_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@InjuryBody/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearInjuryBodyParamsReducer = createAction(
  `@InjuryBody/CLEAR_INJURY_BODY_PARAMS_REDUCER`,
)<void>();
