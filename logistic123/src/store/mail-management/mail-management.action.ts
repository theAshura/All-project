import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  NewMailManagement,
  MailType,
  ListMailManagementResponse,
  MailManagementDetail,
} from 'models/api/mail-management/mail-management.model';

export const getListMailManagementActions = createAsyncAction(
  `@mailManagement/GET_LIST_MAIL_MANAGEMENT_ACTIONS`,
  `@mailManagement/GET_LIST_MAIL_MANAGEMENT_ACTIONS_SUCCESS`,
  `@mailManagement/GET_LIST_MAIL_MANAGEMENT_ACTIONS_FAIL`,
)<CommonApiParam, ListMailManagementResponse, void>();

export const deleteMailManagementActions = createAsyncAction(
  `@mailManagement/DELETE_MAIL_MANAGEMENT_ACTIONS`,
  `@mailManagement/DELETE_MAIL_MANAGEMENT_ACTIONS_SUCCESS`,
  `@mailManagement/DELETE_MAIL_MANAGEMENT_ACTIONS_FAIL`,
)<CommonApiParam, CommonApiParam, void>();

export const createMailManagementActions = createAsyncAction(
  `@mailManagement/CREATE_MAIL_MANAGEMENT_ACTIONS`,
  `@mailManagement/CREATE_MAIL_MANAGEMENT_ACTIONS_SUCCESS`,
  `@mailManagement/CREATE_MAIL_MANAGEMENT_ACTIONS_FAIL`,
)<NewMailManagement, void, ErrorField[]>();

export const getMailTypesActions = createAsyncAction(
  `@mailManagement/GET_MAIL_TYPES_ACTIONS`,
  `@mailManagement/GET_MAIL_TYPES_ACTIONS_SUCCESS`,
  `@mailManagement/GET_MAIL_TYPES_ACTIONS_FAIL`,
)<CommonApiParam, MailType[], void>();

export const updateMailManagementActions = createAsyncAction(
  `@mailManagement/UPDATE_MAIL_MANAGEMENT_ACTIONS`,
  `@mailManagement/UPDATE_MAIL_MANAGEMENT_ACTIONS_SUCCESS`,
  `@mailManagement/UPDATE_MAIL_MANAGEMENT_ACTIONS_FAIL`,
)<NewMailManagement, void, ErrorField[]>();

export const getMailManagementDetailActions = createAsyncAction(
  `@mailManagement/GET_MAIL_MANAGEMENT_DETAIL_ACTIONS`,
  `@mailManagement/GET_MAIL_MANAGEMENT_DETAIL_ACTIONS_SUCCESS`,
  `@mailManagement/GET_MAIL_MANAGEMENT_DETAIL_ACTIONS_FAIL`,
)<string, MailManagementDetail, void>();

export const clearMailManagementReducer = createAction(
  `@mailManagement/CLEAR_MAIL_MANAGEMENT_REDUCER`,
)<void>();

export const clearMailManagementErrorsReducer = createAction(
  `@mailManagement/CLEAR_MAIL_MANAGEMENT_ERRORS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@mailManagement/SET_DATA_FILTER`,
)<CommonApiParam>();

export const updateParamsActions = createAction(
  '@mailManagement/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
