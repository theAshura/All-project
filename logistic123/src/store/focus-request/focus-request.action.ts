import {
  GetFocusRequestsResponse,
  CreateFocusRequestParams,
  UpdateFocusRequestParams,
  FocusRequestDetailResponse,
} from 'models/api/focus-request/focus-request.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteFocusRequest {
  id: string;
  isDetail?: boolean;
  getListFocusRequest: () => void;
}

export const getListFocusRequestActions = createAsyncAction(
  `@focus-request/GET_LIST_FOCUS_REQUEST_ACTIONS`,
  `@focus-request/GET_LIST_FOCUS_REQUEST_ACTIONS_SUCCESS`,
  `@focus-request/GET_LIST_FOCUS_REQUEST_ACTIONS_FAIL`,
)<CommonApiParam, GetFocusRequestsResponse, void>();

export const deleteFocusRequestActions = createAsyncAction(
  `@focus-request/DELETE_FOCUS_REQUEST_ACTIONS`,
  `@focus-request/DELETE_FOCUS_REQUEST_ACTIONS_SUCCESS`,
  `@focus-request/DELETE_FOCUS_REQUEST_ACTIONS_FAIL`,
)<ParamsDeleteFocusRequest, CommonApiParam, void>();

export const createFocusRequestActions = createAsyncAction(
  `@focus-request/CREATE_FOCUS_REQUEST_ACTIONS`,
  `@focus-request/CREATE_FOCUS_REQUEST_ACTIONS_SUCCESS`,
  `@focus-request/CREATE_FOCUS_REQUEST_ACTIONS_FAIL`,
)<CreateFocusRequestParams, void, ErrorField[]>();

export const updateFocusRequestActions = createAsyncAction(
  `@focus-request/UPDATE_FOCUS_REQUEST_ACTIONS`,
  `@focus-request/UPDATE_FOCUS_REQUEST_ACTIONS_SUCCESS`,
  `@focus-request/UPDATE_FOCUS_REQUEST_ACTIONS_FAIL`,
)<UpdateFocusRequestParams, void, ErrorField[]>();

export const getFocusRequestDetailActions = createAsyncAction(
  `@focus-request/GET_FOCUS_REQUEST_DETAIL_ACTIONS`,
  `@focus-request/GET_FOCUS_REQUEST_DETAIL_ACTIONS_SUCCESS`,
  `@focus-request/GET_FOCUS_REQUEST_DETAIL_ACTIONS_FAIL`,
)<string, FocusRequestDetailResponse, void>();

export const clearFocusRequestReducer = createAction(
  `@focus-request/CLEAR_FOCUS_REQUEST_REDUCER`,
)<void>();

export const clearFocusRequestErrorsReducer = createAction(
  `@focus-request/CLEAR_FOCUS_REQUEST_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@focus-request/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearFocusRequestParamsReducer = createAction(
  `@focus-request/CLEAR_FOCUS_REQUEST_PARAMS_REDUCER`,
)<void>();
