import {
  ListPlanningAndRequestResponse,
  PlanningAndRequest,
  UpdatePlanningAndRequestParams,
  GetPARByAuditorsParams,
} from 'models/api/planning-and-request/planning-and-request.model';
import { AvatarType, CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeletePlanningAndRequest {
  id: string;
  isDetail?: boolean;
  getListPlanningAndRequest: () => void;
}

export const getListPlanningAndRequestActions = createAsyncAction(
  `@planningAndRequest/GET_LIST_PLANNING_AND_REQUEST_ACTIONS`,
  `@planningAndRequest/GET_LIST_PLANNING_AND_REQUEST_ACTIONS_SUCCESS`,
  `@planningAndRequest/GET_LIST_PLANNING_AND_REQUEST_ACTIONS_FAIL`,
)<CommonApiParam, ListPlanningAndRequestResponse, void>();

export const deletePlanningAndRequestActions = createAsyncAction(
  `@planningAndRequest/DELETE_PLANNING_AND_REQUEST_ACTIONS`,
  `@planningAndRequest/DELETE_PLANNING_AND_REQUEST_ACTIONS_SUCCESS`,
  `@planningAndRequest/DELETE_PLANNING_AND_REQUEST_ACTIONS_FAIL`,
)<ParamsDeletePlanningAndRequest, CommonApiParam, void>();

export const createPlanningAndRequestActions = createAsyncAction(
  `@planningAndRequest/CREATE_PLANNING_AND_REQUEST_ACTIONS`,
  `@planningAndRequest/CREATE_PLANNING_AND_REQUEST_ACTIONS_SUCCESS`,
  `@planningAndRequest/CREATE_PLANNING_AND_REQUEST_ACTIONS_FAIL`,
)<PlanningAndRequest, void, ErrorField[]>();

export const updatePlanningAndRequestActions = createAsyncAction(
  `@planningAndRequest/UPDATE_PLANNING_AND_REQUEST_ACTIONS`,
  `@planningAndRequest/UPDATE_PLANNING_AND_REQUEST_ACTIONS_SUCCESS`,
  `@planningAndRequest/UPDATE_PLANNING_AND_REQUEST_ACTIONS_FAIL`,
)<UpdatePlanningAndRequestParams, void, ErrorField[]>();

export const getPlanningAndRequestDetailActions = createAsyncAction(
  `@planningAndRequest/GET_PLANNING_AND_REQUEST_DETAIL_ACTIONS`,
  `@planningAndRequest/GET_PLANNING_AND_REQUEST_DETAIL_ACTIONS_SUCCESS`,
  `@planningAndRequest/GET_PLANNING_AND_REQUEST_DETAIL_ACTIONS_FAIL`,
)<string, PlanningAndRequest, void>();

export const uploadFileActions = createAsyncAction(
  `@planningAndRequest/UPLOAD_FILE_ACTIONS`,
  `@planningAndRequest/UPLOAD_FILE_ACTIONS_SUCCESS`,
  `@planningAndRequest/UPLOAD_FILE_ACTIONS_FAIL`,
)<FormData, AvatarType, void>();

export const getTotalUnplannedPlanningActions = createAsyncAction(
  `@planningAndRequest/GET_TOTAL_PLANNING_ACTIONS`,
  `@planningAndRequest/GET_TOTAL_PLANNING_ACTIONS_SUCCESS`,
  `@planningAndRequest/GET_TOTAL_PLANNING_ACTIONS_FAIL`,
)<void, number, void>();

export const clearPlanningAndRequestReducer = createAction(
  `@planningAndRequest/CLEAR_PLANNING_AND_REQUEST_REDUCER`,
)<boolean | void>();

export const clearPlanningAndRequestErrorsReducer = createAction(
  `@planningAndRequest/CLEAR_PLANNING_AND_REQUEST_ERRORS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@planningAndRequest/SET_DATA_FILTER`,
)<CommonApiParam>();

export const updateParamsActions = createAction(
  '@planningAndRequest/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const getPlanningAndRequestGroupByAuditorsAction = createAsyncAction(
  `@planningAndRequest/GET_PLANNING_AND_REQUEST_GROUP_BY_AUDITORS_ACTION`,
  `@planningAndRequest/GET_PLANNING_AND_REQUEST_GROUP_BY_AUDITORS_ACTION_SUCCESS`,
  `@planningAndRequest/GET_PLANNING_AND_REQUEST_GROUP_BY_AUDITORS_ACTION_FAIL`,
)<GetPARByAuditorsParams, ListPlanningAndRequestResponse, void>();

export const getListPlanningRequestAuditLogAction = createAsyncAction(
  `@planningAndRequest/GET_LIST_PLANNING_REQUEST_AUDIT_LOG_ACTION`,
  `@planningAndRequest/GET_LIST_PLANNING_REQUEST_AUDIT_LOG_ACTION_SUCCESS`,
  `@planningAndRequest/GET_LIST_PLANNING_REQUEST_AUDIT_LOG_ACTION_FAIL`,
)<CommonApiParam, any, void>();
