import {
  GeneralReportParams,
  PendingActionParams,
  SailReportingGeneralReportResponse,
  SailReportingLatestRecordsUpdateResponse,
  SailReportingPendingActionResponse,
} from 'models/api/summary-sail-reporting/summary-sail-reporting.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const getSailReportingGeneralReportActions = createAsyncAction(
  `@SailReporting/GET_SAIL_REPORTING_GENERAL_REPORT_ACTIONS`,
  `@SailReporting/GET_SAIL_REPORTING_GENERAL_REPORT_ACTIONS_SUCCESS`,
  `@SailReporting/GET_SAIL_REPORTING_GENERAL_REPORT_ACTIONS_FAIL`,
)<GeneralReportParams, SailReportingGeneralReportResponse, void>();

export const getSailReportingLatestRecordsUpdateActions = createAsyncAction(
  `@SailReporting/GET_SAIL_REPORTING_LASTEST_RECORDS_UPDATE_ACTIONS`,
  `@SailReporting/GET_SAIL_REPORTING_LASTEST_RECORDS_UPDATE_ACTIONS_SUCCESS`,
  `@SailReporting/GET_SAIL_REPORTING_LASTEST_RECORDS_UPDATE_ACTIONS_FAIL`,
)<string, SailReportingLatestRecordsUpdateResponse, void>();

export const getSailReportingPendingActions = createAsyncAction(
  `@SailReporting/GET_SAIL_REPORTING_PENDING_ACTIONS`,
  `@SailReporting/GET_SAIL_REPORTING_PENDING_ACTIONS_SUCCESS`,
  `@SailReporting/GET_SAIL_REPORTING_PENDING_ACTIONS_FAIL`,
)<PendingActionParams, SailReportingPendingActionResponse, void>();

export const clearSailReportingGeneralReportReducer = createAction(
  `@SailReporting/CLEAR_SAIL_REPORTING_GENERAL_REPORT_REDUCER`,
)<void>();
