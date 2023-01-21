import {
  CreateReportOfFindingParams,
  ListReportOfFindingResponse,
  ReportOfFinding,
  UpdateReportOfFindingParams,
} from 'models/api/report-of-finding/report-of-finding.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteReportOfFinding {
  id: string;
  isDetail?: boolean;
  getListReportOfFinding: () => void;
}

export const getListReportOfFindingActions = createAsyncAction(
  `@reportOfFinding/GET_LIST_REPORT_OF_FINDING_ACTIONS`,
  `@reportOfFinding/GET_LIST_REPORT_OF_FINDING_ACTIONS_SUCCESS`,
  `@reportOfFinding/GET_LIST_REPORT_OF_FINDING_ACTIONS_FAIL`,
)<CommonApiParam, ListReportOfFindingResponse, void>();

export const deleteReportOfFindingActions = createAsyncAction(
  `@reportOfFinding/DELETE_REPORT_OF_FINDING_ACTIONS`,
  `@reportOfFinding/DELETE_REPORT_OF_FINDING_ACTIONS_SUCCESS`,
  `@reportOfFinding/DELETE_REPORT_OF_FINDING_ACTIONS_FAIL`,
)<ParamsDeleteReportOfFinding, CommonApiParam, void>();

export const createReportOfFindingActions = createAsyncAction(
  `@reportOfFinding/CREATE_REPORT_OF_FINDING_ACTIONS`,
  `@reportOfFinding/CREATE_REPORT_OF_FINDING_ACTIONS_SUCCESS`,
  `@reportOfFinding/CREATE_REPORT_OF_FINDING_ACTIONS_FAIL`,
)<CreateReportOfFindingParams, void, ErrorField[]>();

export const updateReportOfFindingActions = createAsyncAction(
  `@reportOfFinding/UPDATE_REPORT_OF_FINDING_ACTIONS`,
  `@reportOfFinding/UPDATE_REPORT_OF_FINDING_ACTIONS_SUCCESS`,
  `@reportOfFinding/UPDATE_REPORT_OF_FINDING_ACTIONS_FAIL`,
)<UpdateReportOfFindingParams, void, ErrorField[]>();

export const getReportOfFindingDetailActions = createAsyncAction(
  `@reportOfFinding/GET_REPORT_OF_FINDING_DETAIL_ACTIONS`,
  `@reportOfFinding/GET_REPORT_OF_FINDING_DETAIL_ACTIONS_SUCCESS`,
  `@reportOfFinding/GET_REPORT_OF_FINDING_DETAIL_ACTIONS_FAIL`,
)<string, ReportOfFinding, void>();

export const clearReportOfFindingReducer = createAction(
  `@reportOfFinding/CLEAR_REPORT_OF_FINDING_REDUCER`,
)<boolean | void>();

export const clearReportOfFindingErrorsReducer = createAction(
  `@reportOfFinding/CLEAR_REPORT_OF_FINDING_ERRORS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@reportOfFinding/SET_DATA_FILTER`,
)<CommonApiParam>();

export const updateParamsActions = createAction(
  '@reportOfFinding/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
