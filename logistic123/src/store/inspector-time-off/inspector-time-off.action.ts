import {
  GetInspectorTimeOffsResponse,
  CreateInspectorTimeOffParams,
  UpdateInspectorTimeOffParams,
  InspectorTimeOffDetailResponse,
} from 'models/api/inspector-time-off/inspector-time-off.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteInspectorTimeOff {
  id: string;
  isDetail?: boolean;
  getListInspectorTimeOff: () => void;
}

export const getListInspectorTimeOffActions = createAsyncAction(
  `@inspectorTimeOff/GET_LIST_INSPECTOR_TIME_OFF_ACTIONS`,
  `@inspectorTimeOff/GET_LIST_INSPECTOR_TIME_OFF_ACTIONS_SUCCESS`,
  `@inspectorTimeOff/GET_LIST_INSPECTOR_TIME_OFF_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectorTimeOffsResponse, void>();

export const deleteInspectorTimeOffActions = createAsyncAction(
  `@inspectorTimeOff/DELETE_INSPECTOR_TIME_OFF_ACTIONS`,
  `@inspectorTimeOff/DELETE_INSPECTOR_TIME_OFF_ACTIONS_SUCCESS`,
  `@inspectorTimeOff/DELETE_INSPECTOR_TIME_OFF_ACTIONS_FAIL`,
)<ParamsDeleteInspectorTimeOff, CommonApiParam, void>();

export const createInspectorTimeOffActions = createAsyncAction(
  `@inspectorTimeOff/CREATE_INSPECTOR_TIME_OFF_ACTIONS`,
  `@inspectorTimeOff/CREATE_INSPECTOR_TIME_OFF_ACTIONS_SUCCESS`,
  `@inspectorTimeOff/CREATE_INSPECTOR_TIME_OFF_ACTIONS_FAIL`,
)<CreateInspectorTimeOffParams, void, ErrorField[]>();

export const updateInspectorTimeOffActions = createAsyncAction(
  `@inspectorTimeOff/UPDATE_INSPECTOR_TIME_OFF_ACTIONS`,
  `@inspectorTimeOff/UPDATE_INSPECTOR_TIME_OFF_ACTIONS_SUCCESS`,
  `@inspectorTimeOff/UPDATE_INSPECTOR_TIME_OFF_ACTIONS_FAIL`,
)<UpdateInspectorTimeOffParams, void, ErrorField[]>();

export const getInspectorTimeOffDetailActions = createAsyncAction(
  `@inspectorTimeOff/GET_INSPECTOR_TIME_OFF_DETAIL_ACTIONS`,
  `@inspectorTimeOff/GET_INSPECTOR_TIME_OFF_DETAIL_ACTIONS_SUCCESS`,
  `@inspectorTimeOff/GET_INSPECTOR_TIME_OFF_DETAIL_ACTIONS_FAIL`,
)<string, InspectorTimeOffDetailResponse, void>();

export const clearInspectorTimeOffReducer = createAction(
  `@inspectorTimeOff/CLEAR_INSPECTOR_TIME_OFF_REDUCER`,
)<void>();

export const clearInspectorTimeOffErrorsReducer = createAction(
  `@inspectorTimeOff/CLEAR_INSPECTOR_TIME_OFF_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@inspectorTimeOff/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearInspectorTimeOffParamsReducer = createAction(
  `@inspectorTimeOff/CLEAR_INSPECTOR_TIME_OFF_PARAMS_REDUCER`,
)<void>();
