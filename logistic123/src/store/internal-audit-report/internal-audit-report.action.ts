import {
  GetInternalAuditReportsResponse,
  // CreateInternalAuditReportParams,
  UpdateInternalAuditReportParams,
  InternalAuditReportDetailResponse,
} from 'models/api/internal-audit-report/internal-audit-report.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteInternalAuditReport {
  id: string;
  isDetail?: boolean;
  getListInternalAuditReport: () => void;
}

export const getListInternalAuditReportActions = createAsyncAction(
  `@internalAuditReport/GET_LIST_INTERNAL_AUDIT_REPORT_ACTIONS`,
  `@internalAuditReport/GET_LIST_INTERNAL_AUDIT_REPORT_ACTIONS_SUCCESS`,
  `@internalAuditReport/GET_LIST_INTERNAL_AUDIT_REPORT_ACTIONS_FAIL`,
)<CommonApiParam, GetInternalAuditReportsResponse, void>();

export const deleteInternalAuditReportActions = createAsyncAction(
  `@internalAuditReport/DELETE_INTERNAL_AUDIT_REPORT_ACTIONS`,
  `@internalAuditReport/DELETE_INTERNAL_AUDIT_REPORT_ACTIONS_SUCCESS`,
  `@internalAuditReport/DELETE_INTERNAL_AUDIT_REPORT_ACTIONS_FAIL`,
)<ParamsDeleteInternalAuditReport, CommonApiParam, void>();

// export const createInternalAuditReportActions = createAsyncAction(
//   `@internalAuditReport/CREATE_INTERNAL_AUDIT_REPORT_ACTIONS`,
//   `@internalAuditReport/CREATE_INTERNAL_AUDIT_REPORT_ACTIONS_SUCCESS`,
//   `@internalAuditReport/CREATE_INTERNAL_AUDIT_REPORT_ACTIONS_FAIL`,
// )<CreateInternalAuditReportParams, void, ErrorField[]>();

export const updateInternalAuditReportActions = createAsyncAction(
  `@internalAuditReport/UPDATE_INTERNAL_AUDIT_REPORT_ACTIONS`,
  `@internalAuditReport/UPDATE_INTERNAL_AUDIT_REPORT_ACTIONS_SUCCESS`,
  `@internalAuditReport/UPDATE_INTERNAL_AUDIT_REPORT_ACTIONS_FAIL`,
)<UpdateInternalAuditReportParams, void, ErrorField[]>();

export const getInternalAuditReportDetailActions = createAsyncAction(
  `@internalAuditReport/GET_INTERNAL_AUDIT_REPORT_DETAIL_ACTIONS`,
  `@internalAuditReport/GET_INTERNAL_AUDIT_REPORT_DETAIL_ACTIONS_SUCCESS`,
  `@internalAuditReport/GET_INTERNAL_AUDIT_REPORT_DETAIL_ACTIONS_FAIL`,
)<string, InternalAuditReportDetailResponse, void>();

export const clearInternalAuditReportReducer = createAction(
  `@internalAuditReport/CLEAR_INTERNAL_AUDIT_REPORT_REDUCER`,
)<boolean | void>();

export const clearInternalAuditReportDetail = createAction(
  `@internalAuditReport/CLEAR_INTERNAL_AUDIT_DETAIL`,
)<void>();

export const clearInternalAuditReportErrorsReducer = createAction(
  `@internalAuditReport/CLEAR_INTERNAL_AUDIT_REPORT_ERRORS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@reportOfFinding/SET_DATA_FILTER`,
)<CommonApiParam>();

export const updateParamsActions = createAction(
  '@internalAuditReport/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const getListInspectionFollowUpActions = createAsyncAction(
  `@internalAuditReport/GET_LIST_INSPECTION_FOLLOW_UP_ACTIONS`,
  `@internalAuditReport/GET_LIST_INSPECTION_FOLLOW_UP_ACTIONS_SUCCESS`,
  `@internalAuditReport/GET_LIST_INSPECTION_FOLLOW_UP_ACTIONS_FAIL`,
)<CommonApiParam, GetInternalAuditReportsResponse, void>();

export const getInspectionFollowUpDetailActions = createAsyncAction(
  `@internalAuditReport/GET_INSPECTION_FOLLOW_DETAIL_ACTIONS`,
  `@internalAuditReport/GET_INSPECTION_FOLLOW_DETAIL_ACTIONS_SUCCESS`,
  `@internalAuditReport/GET_INSPECTION_FOLLOW_DETAIL_ACTIONS_FAIL`,
)<string, InternalAuditReportDetailResponse, void>();
