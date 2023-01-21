import {
  GetSmsResponse,
  CreateSmsParams,
  UpdateSmsParams,
  SmsDetailResponse,
} from 'models/api/sms/sms.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteSms {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListSmsActions = createAsyncAction(
  `@sms/GET_LIST_SMS_ACTIONS`,
  `@sms/GET_LIST_SMS_ACTIONS_SUCCESS`,
  `@sms/GET_LIST_SMS_ACTIONS_FAIL`,
)<CommonApiParam, GetSmsResponse, void>();

export const createSmsActions = createAsyncAction(
  `@sms/CREATE_SMS_ACTIONS`,
  `@sms/CREATE_SMS_ACTIONS_SUCCESS`,
  `@sms/CREATE_SMS_ACTIONS_FAIL`,
)<CreateSmsParams, void, ErrorField[]>();

export const deleteSmsActions = createAsyncAction(
  `@sms/DELETE_SMS_ACTIONS`,
  `@sms/DELETE_SMS_ACTIONS_SUCCESS`,
  `@sms/DELETE_SMS_ACTIONS_FAIL`,
)<ParamsDeleteSms, CommonApiParam, void>();

export const updateSmsActions = createAsyncAction(
  `@sms/UPDATE_SMS_ACTIONS`,
  `@sms/UPDATE_SMS_ACTIONS_SUCCESS`,
  `@sms/UPDATE_SMS_ACTIONS_FAIL`,
)<UpdateSmsParams, void, ErrorField[]>();

export const getSmsDetailActions = createAsyncAction(
  `@sms/GET_SMS_DETAIL_ACTIONS`,
  `@sms/GET_SMS_DETAIL_ACTIONS_SUCCESS`,
  `@sms/GET_SMS_DETAIL_ACTIONS_FAIL`,
)<string, SmsDetailResponse, void>();

export const clearSmsReducer = createAction(`@sms/CLEAR_SMS_REDUCER`)<void>();

export const clearSmsErrorsReducer = createAction(
  `@sms/CLEAR_SMS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@sms/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearSmsParamsReducer = createAction(
  `@sms/CLEAR_SMS_PARAMS_REDUCER`,
)<void>();
export const clearSmsDetailReducer = createAction(
  `@sms/CLEAR_SMS_DETAIL_REDUCER`,
)<void>();

export const setDataFilterAction =
  createAction(`@sms/SET_DATA_FILTER`)<CommonApiParam>();
