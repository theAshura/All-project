import {
  GetInjuryMastersResponse,
  CreateInjuryMasterParams,
  UpdateInjuryMasterParams,
  InjuryMasterDetailResponse,
} from 'models/api/injury-master/injury-master.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteInjuryMaster {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListInjuryMasterActions = createAsyncAction(
  `@InjuryMaster/GET_LIST_INJURY_BODY_ACTIONS`,
  `@InjuryMaster/GET_LIST_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryMaster/GET_LIST_INJURY_BODY_ACTIONS_FAIL`,
)<CommonApiParam, GetInjuryMastersResponse, void>();

export const deleteInjuryMasterActions = createAsyncAction(
  `@InjuryMaster/DELETE_INJURY_BODY_ACTIONS`,
  `@InjuryMaster/DELETE_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryMaster/DELETE_INJURY_BODY_ACTIONS_FAIL`,
)<ParamsDeleteInjuryMaster, CommonApiParam, void>();

export const createInjuryMasterActions = createAsyncAction(
  `@InjuryMaster/CREATE_INJURY_BODY_ACTIONS`,
  `@InjuryMaster/CREATE_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryMaster/CREATE_INJURY_BODY_ACTIONS_FAIL`,
)<CreateInjuryMasterParams, void, ErrorField[]>();

export const updateInjuryMasterActions = createAsyncAction(
  `@InjuryMaster/UPDATE_INJURY_BODY_ACTIONS`,
  `@InjuryMaster/UPDATE_INJURY_BODY_ACTIONS_SUCCESS`,
  `@InjuryMaster/UPDATE_INJURY_BODY_ACTIONS_FAIL`,
)<UpdateInjuryMasterParams, void, ErrorField[]>();

export const getInjuryMasterDetailActions = createAsyncAction(
  `@InjuryMaster/GET_INJURY_BODY_DETAIL_ACTIONS`,
  `@InjuryMaster/GET_INJURY_BODY_DETAIL_ACTIONS_SUCCESS`,
  `@InjuryMaster/GET_INJURY_BODY_DETAIL_ACTIONS_FAIL`,
)<string, InjuryMasterDetailResponse, void>();

export const clearInjuryMasterReducer = createAction(
  `@InjuryMaster/CLEAR_INJURY_BODY_REDUCER`,
)<void>();

export const clearInjuryMasterErrorsReducer = createAction(
  `@InjuryMaster/CLEAR_INJURY_BODY_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@InjuryMaster/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearInjuryMasterParamsReducer = createAction(
  `@InjuryMaster/CLEAR_INJURY_BODY_PARAMS_REDUCER`,
)<void>();
