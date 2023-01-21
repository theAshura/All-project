import {
  GetAuditTimeTablesResponse,
  CreateAuditTimeTableParams,
  UpdateAuditTimeTableParams,
  AuditTimeTableDetailResponse,
  DateCalendarResponse,
} from 'models/api/audit-time-table/audit-time-table.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteAuditTimeTable {
  id: string;
  isDetail?: boolean;
  getListAuditTimeTable: () => void;
}

export const getListAuditTimeTableActions = createAsyncAction(
  `@auditTimeTable/GET_LIST_AUDIT_TIME_TABLE_ACTIONS`,
  `@auditTimeTable/GET_LIST_AUDIT_TIME_TABLE_ACTIONS_SUCCESS`,
  `@auditTimeTable/GET_LIST_AUDIT_TIME_TABLE_ACTIONS_FAIL`,
)<CommonApiParam, GetAuditTimeTablesResponse, void>();

export const getDataCalendarActions = createAsyncAction(
  `@auditTimeTable/GET_DATA_CALENDAR_ACTIONS`,
  `@auditTimeTable/GET_DATA_CALENDAR_ACTIONS_SUCCESS`,
  `@auditTimeTable/GET_DATA_CALENDAR_ACTIONS_FAIL`,
)<CommonApiParam, DateCalendarResponse[], void>();

export const deleteAuditTimeTableActions = createAsyncAction(
  `@auditTimeTable/DELETE_AUDIT_TIME_TABLE_ACTIONS`,
  `@auditTimeTable/DELETE_AUDIT_TIME_TABLE_ACTIONS_SUCCESS`,
  `@auditTimeTable/DELETE_AUDIT_TIME_TABLE_ACTIONS_FAIL`,
)<ParamsDeleteAuditTimeTable, CommonApiParam, void>();

export const createAuditTimeTableActions = createAsyncAction(
  `@auditTimeTable/CREATE_AUDIT_TIME_TABLE_ACTIONS`,
  `@auditTimeTable/CREATE_AUDIT_TIME_TABLE_ACTIONS_SUCCESS`,
  `@auditTimeTable/CREATE_AUDIT_TIME_TABLE_ACTIONS_FAIL`,
)<CreateAuditTimeTableParams, void, ErrorField[]>();

export const updateAuditTimeTableActions = createAsyncAction(
  `@auditTimeTable/UPDATE_AUDIT_TIME_TABLE_ACTIONS`,
  `@auditTimeTable/UPDATE_AUDIT_TIME_TABLE_ACTIONS_SUCCESS`,
  `@auditTimeTable/UPDATE_AUDIT_TIME_TABLE_ACTIONS_FAIL`,
)<UpdateAuditTimeTableParams, void, ErrorField[]>();

export const getAuditTimeTableDetailActions = createAsyncAction(
  `@auditTimeTable/GET_AUDIT_TIME_TABLE_DETAIL_ACTIONS`,
  `@auditTimeTable/GET_AUDIT_TIME_TABLE_DETAIL_ACTIONS_SUCCESS`,
  `@auditTimeTable/GET_AUDIT_TIME_TABLE_DETAIL_ACTIONS_FAIL`,
)<string, AuditTimeTableDetailResponse, void>();

export const submitAuditTimeTableActions = createAsyncAction(
  `@auditTimeTable/SUBMIT_AUDIT_TIME_TABLE`,
  `@auditTimeTable/SUBMIT_AUDIT_TIME_TABLE_SUCCESS`,
  `@auditTimeTable/SUBMIT_AUDIT_TIME_TABLE_FAIL`,
)<string, void, void>();

export const recallActions = createAsyncAction(
  `@auditTimeTable/RECALL`,
  `@auditTimeTable/RECALL_SUCCESS`,
  `@auditTimeTable/RECALL_FAIL`,
)<{ id: string; handleSuccess?: () => void }, void, void>();

export const closeOutActions = createAsyncAction(
  `@auditTimeTable/CLOSE_OUT`,
  `@auditTimeTable/CLOSE_OUT_SUCCESS`,
  `@auditTimeTable/CLOSE_OUT_FAIL`,
)<{ id: string; handleSuccess?: () => void; remark?: string }, void, void>();

export const clearAuditTimeTableReducer = createAction(
  `@auditTimeTable/CLEAR_AUDIT_TIME_TABLE_REDUCER`,
)<boolean | void>();

export const clearAuditTimeTableErrorsReducer = createAction(
  `@auditTimeTable/CLEAR_AUDIT_TIME_TABLE_ERRORS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@auditTimeTable/SET_DATA_FILTER`,
)<CommonApiParam>();

export const updateParamsActions = createAction(
  '@auditTimeTable/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
