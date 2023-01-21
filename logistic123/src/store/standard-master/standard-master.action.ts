import {
  GetStandardMastersResponse,
  CreateStandardMasterParams,
  UpdateStandardMasterParams,
  StandardMasterDetailResponse,
} from 'models/api/standard-master/standard-master.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteStandardMaster {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListStandardMasterActions = createAsyncAction(
  `@standardMaster/GET_LIST_STANDARD_MASTER_ACTIONS`,
  `@standardMaster/GET_LIST_STANDARD_MASTER_ACTIONS_SUCCESS`,
  `@standardMaster/GET_LIST_STANDARD_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, GetStandardMastersResponse, void>();

export const deleteStandardMasterActions = createAsyncAction(
  `@standardMaster/DELETE_STANDARD_MASTER_ACTIONS`,
  `@standardMaster/DELETE_STANDARD_MASTER_ACTIONS_SUCCESS`,
  `@standardMaster/DELETE_STANDARD_MASTER_ACTIONS_FAIL`,
)<ParamsDeleteStandardMaster, CommonApiParam, void>();

export const createStandardMasterActions = createAsyncAction(
  `@standardMaster/CREATE_STANDARD_MASTER_ACTIONS`,
  `@standardMaster/CREATE_STANDARD_MASTER_ACTIONS_SUCCESS`,
  `@standardMaster/CREATE_STANDARD_MASTER_ACTIONS_FAIL`,
)<CreateStandardMasterParams, void, ErrorField[]>();

export const updateStandardMasterActions = createAsyncAction(
  `@standardMaster/UPDATE_STANDARD_MASTER_ACTIONS`,
  `@standardMaster/UPDATE_STANDARD_MASTER_ACTIONS_SUCCESS`,
  `@standardMaster/UPDATE_STANDARD_MASTER_ACTIONS_FAIL`,
)<UpdateStandardMasterParams, void, ErrorField[]>();

export const getStandardMasterDetailActions = createAsyncAction(
  `@standardMaster/GET_STANDARD_MASTER_DETAIL_ACTIONS`,
  `@standardMaster/GET_STANDARD_MASTER_DETAIL_ACTIONS_SUCCESS`,
  `@standardMaster/GET_STANDARD_MASTER_DETAIL_ACTIONS_FAIL`,
)<string, StandardMasterDetailResponse, void>();

export const clearStandardMasterReducer = createAction(
  `@standardMaster/CLEAR_STANDARD_MASTER_REDUCER`,
)<void>();

export const clearStandardMasterErrorsReducer = createAction(
  `@standardMaster/CLEAR_STANDARD_MASTER_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@standardMaster/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@standardMaster/SET_DATA_FILTER`,
)<CommonApiParam>();
