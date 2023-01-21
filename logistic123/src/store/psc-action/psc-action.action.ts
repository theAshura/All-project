import {
  GetPscActionResponse,
  CreatePscActionParams,
  UpdatePscActionParams,
  PscActionDetailResponse,
} from 'models/api/psc-action/psc-action.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeletePscAction {
  id: string;
  isDetail?: boolean;
  getListPscAction: () => void;
}

export const getListPscActions = createAsyncAction(
  `@pscAction/GET_LIST_PSC_ACTION_ACTIONS`,
  `@pscAction/GET_LIST_PSC_ACTION_ACTIONS_SUCCESS`,
  `@pscAction/GET_LIST_PSC_ACTION_ACTIONS_FAIL`,
)<CommonApiParam, GetPscActionResponse, void>();

export const deletePscActions = createAsyncAction(
  `@pscAction/DELETE_PSC_ACTION_ACTIONS`,
  `@pscAction/DELETE_PSC_ACTION_ACTIONS_SUCCESS`,
  `@pscAction/DELETE_PSC_ACTION_ACTIONS_FAIL`,
)<ParamsDeletePscAction, CommonApiParam, void>();

export const createPscActions = createAsyncAction(
  `@pscAction/CREATE_PSC_ACTION_ACTIONS`,
  `@pscAction/CREATE_PSC_ACTION_ACTIONS_SUCCESS`,
  `@pscAction/CREATE_PSC_ACTION_ACTIONS_FAIL`,
)<CreatePscActionParams, void, ErrorField[]>();

export const updatePscActions = createAsyncAction(
  `@pscAction/UPDATE_PSC_ACTION_ACTIONS`,
  `@pscAction/UPDATE_PSC_ACTION_ACTIONS_SUCCESS`,
  `@pscAction/UPDATE_PSC_ACTION_ACTIONS_FAIL`,
)<UpdatePscActionParams, void, ErrorField[]>();

export const getPscActionDetailActions = createAsyncAction(
  `@pscAction/GET_PSC_ACTION_DETAIL_ACTIONS`,
  `@pscAction/GET_PSC_ACTION_DETAIL_ACTIONS_SUCCESS`,
  `@pscAction/GET_PSC_ACTION_DETAIL_ACTIONS_FAIL`,
)<string, PscActionDetailResponse, void>();

export const clearPscActionReducer = createAction(
  `@pscAction/CLEAR_PSC_ACTION_REDUCER`,
)<void>();

export const clearPscActionErrorsReducer = createAction(
  `@pscAction/CLEAR_PSC_ACTION_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@pscAction/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
