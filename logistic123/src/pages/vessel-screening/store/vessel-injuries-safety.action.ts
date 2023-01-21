import {
  InjuriesSafetyRequests,
  GetVesselScreeningInjuriesSafetyResponse,
  UpdateInjuriesSafetyRequestParams,
} from 'pages/vessel-screening/utils/models/injuries-safety.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const clearVesselInjuriesSafetyReducer = createAction(
  `@VesselScreening/CLEAR_INJURIES_SAFETY_REDUCER`,
)<void | boolean>();

export const clearVesselInjuriesSafetyErrorsReducer = createAction(
  `@VesselScreening/CLEAR_INJURIES_SAFETY_ERRORS_REDUCER`,
)<void>();

export const updateInjuriesSafetyParamsActions = createAction(
  `@VesselScreening/UPDATE_INJURIES_SAFETY_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setInjuriesSafetyDataFilterAction = createAction(
  `@VesselScreening/SET_INJURIES_SAFETY_DATA_FILTER`,
)<CommonApiParam>();

export const getListVesselScreeningInjuriesSafetyActions = createAsyncAction(
  `@VesselScreening/GET_LIST_INJURIES_SAFETY_ACTIONS`,
  `@VesselScreening/GET_LIST_INJURIES_SAFETY_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_INJURIES_SAFETY_ACTIONS_FAIL`,
)<CommonApiParam, GetVesselScreeningInjuriesSafetyResponse, void>();

export const getInjuriesSafetyRequestDetailActions = createAsyncAction(
  `@VesselScreening/GET_INJURIES_SAFETY_REQUEST_DETAIL_ACTIONS`,
  `@VesselScreening/GET_INJURIES_SAFETY_REQUEST_DETAIL_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_INJURIES_SAFETY_REQUEST_DETAIL_ACTIONS_FAIL`,
)<CommonApiParam, InjuriesSafetyRequests, void>();

export const updateInjuriesSafetyRequestActions = createAsyncAction(
  `@VesselScreening/UPDATE_INJURIES_SAFETY_ACTIONS`,
  `@VesselScreening/UPDATE_INJURIES_SAFETY_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_INJURIES_SAFETY_ACTIONS_FAIL`,
)<UpdateInjuriesSafetyRequestParams, void, ErrorField[]>();
