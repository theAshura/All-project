import {
  GetEventTypesResponse,
  GetCompanysParams,
  GetCompanysResponse,
  CreateEventTypeParams,
  UpdateEventTypeParams,
  EventTypeDetailResponse,
  CheckExitCodeParams,
  checkExitResponse,
} from 'models/api/event-type/event-type.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteEventType {
  id: string;
  isDetail?: boolean;
  getListEventType: () => void;
}

export const getListEventTypeActions = createAsyncAction(
  `@EventType/GET_LIST_EVENT_TYPE_ACTIONS`,
  `@EventType/GET_LIST_EVENT_TYPE_ACTIONS_SUCCESS`,
  `@EventType/GET_LIST_EVENT_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, GetEventTypesResponse, void>();

export const getListCompanyActions = createAsyncAction(
  `@EventType/GET_LIST_COMPANY_ACTIONS`,
  `@EventType/GET_LIST_COMPANY_ACTIONS_SUCCESS`,
  `@EventType/GET_LIST_COMPANY_ACTIONS_FAIL`,
)<GetCompanysParams, GetCompanysResponse, void>();

export const deleteEventTypeActions = createAsyncAction(
  `@EventType/DELETE_EVENT_TYPE_ACTIONS`,
  `@EventType/DELETE_EVENT_TYPE_ACTIONS_SUCCESS`,
  `@EventType/DELETE_EVENT_TYPE_ACTIONS_FAIL`,
)<ParamsDeleteEventType, CommonApiParam, void>();

export const createEventTypeActions = createAsyncAction(
  `@EventType/CREATE_EVENT_TYPE_ACTIONS`,
  `@EventType/CREATE_EVENT_TYPE_ACTIONS_SUCCESS`,
  `@EventType/CREATE_EVENT_TYPE_ACTIONS_FAIL`,
)<CreateEventTypeParams, void, ErrorField[]>();

export const checkExitCodeAction = createAsyncAction(
  `@EventType/CHECK_EXIT_CODE_ACTIONS`,
  `@EventType/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@EventType/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, checkExitResponse, void>();

export const updateEventTypeActions = createAsyncAction(
  `@EventType/UPDATE_EVENT_TYPE_ACTIONS`,
  `@EventType/UPDATE_EVENT_TYPE_ACTIONS_SUCCESS`,
  `@EventType/UPDATE_EVENT_TYPE_ACTIONS_FAIL`,
)<UpdateEventTypeParams, void, ErrorField[]>();

export const getEventTypeDetailActions = createAsyncAction(
  `@EventType/GET_EVENT_TYPE_DETAIL_ACTIONS`,
  `@EventType/GET_EVENT_TYPE_DETAIL_ACTIONS_SUCCESS`,
  `@EventType/GET_EVENT_TYPE_DETAIL_ACTIONS_FAIL`,
)<string, EventTypeDetailResponse, void>();

export const clearEventTypeReducer = createAction(
  `@EventType/CLEAR_EVENT_TYPE_REDUCER`,
)<void>();

export const clearEventTypeErrorsReducer = createAction(
  `@EventType/CLEAR_EVENT_TYPE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@EventType/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearEventTypeParamsReducer = createAction(
  `@EventType/CLEAR_EVENT_TYPE_PARAMS_REDUCER`,
)<void>();
