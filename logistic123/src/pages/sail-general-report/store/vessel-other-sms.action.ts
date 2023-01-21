import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetVesselScreeningOtherSMSResponse,
  OtherSMSRequests,
  UpdateOtherSMSRequestParams,
} from '../utils/models/other-sms.model';

export const clearVesselOtherSMSReducer = createAction(
  `@VesselScreening/CLEAR_OTHER-SMS_REDUCER`,
)<void | boolean>();

export const clearVesselOtherSMSErrorsReducer = createAction(
  `@VesselScreening/CLEAR_OTHER-SMS_ERRORS_REDUCER`,
)<void>();

export const updateOtherSMSParamsActions = createAction(
  `@VesselScreening/UPDATE_OTHER-SMS_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setOtherSMSDataFilterAction = createAction(
  `@VesselScreening/SET_OTHER-SMS_DATA_FILTER`,
)<CommonApiParam>();

export const getListVesselScreeningOtherSMSActions = createAsyncAction(
  `@VesselScreening/GET_LIST_OTHER-SMS_ACTIONS`,
  `@VesselScreening/GET_LIST_OTHER-SMS_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_OTHER-SMS_ACTIONS_FAIL`,
)<CommonApiParam, GetVesselScreeningOtherSMSResponse, void>();

export const getOtherSMSRequestDetailActions = createAsyncAction(
  `@VesselScreening/GET_OTHER-SMS_REQUEST_DETAIL_ACTIONS`,
  `@VesselScreening/GET_OTHER-SMS_REQUEST_DETAIL_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_OTHER-SMS_REQUEST_DETAIL_ACTIONS_FAIL`,
)<CommonApiParam, OtherSMSRequests, void>();

export const updateOtherSMSRequestActions = createAsyncAction(
  `@VesselScreening/UPDATE_OTHER-SMS_ACTIONS`,
  `@VesselScreening/UPDATE_OTHER-SMS_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_OTHER-SMS_ACTIONS_FAIL`,
)<UpdateOtherSMSRequestParams, void, ErrorField[]>();
