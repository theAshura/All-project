import {
  CreateReportTemplateParams,
  GetReportTemplatesResponse,
  GetVersionReportTemplateParam,
  GetVersionReportTemplateResponse,
  ReportTemplateDetailResponse,
  UpdateReportTemplateParams,
} from 'models/api/report-template/report-template.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteReportTemplate {
  id: string;
  isDetail?: boolean;
  getListReportTemplate: () => void;
}

export const getListReportTemplateActions = createAsyncAction(
  `@ReportTemplate/GET_LIST_REPORT_TEMPLATE_ACTIONS`,
  `@ReportTemplate/GET_LIST_REPORT_TEMPLATE_ACTIONS_SUCCESS`,
  `@ReportTemplate/GET_LIST_REPORT_TEMPLATE_ACTIONS_FAIL`,
)<CommonApiParam, GetReportTemplatesResponse, void>();

export const getVersionNumberActions = createAsyncAction(
  `@ReportTemplate/GET_VERSION_NUMBER_ACTIONS`,
  `@ReportTemplate/GET_VERSION_NUMBER_ACTIONS_SUCCESS`,
  `@ReportTemplate/GET_VERSION_NUMBER_ACTIONS_FAIL`,
)<GetVersionReportTemplateParam, GetVersionReportTemplateResponse, void>();

export const deleteReportTemplateActions = createAsyncAction(
  `@ReportTemplate/DELETE_REPORT_TEMPLATE_ACTIONS`,
  `@ReportTemplate/DELETE_REPORT_TEMPLATE_ACTIONS_SUCCESS`,
  `@ReportTemplate/DELETE_REPORT_TEMPLATE_ACTIONS_FAIL`,
)<ParamsDeleteReportTemplate, void, void>();

export const createReportTemplateActions = createAsyncAction(
  `@ReportTemplate/CREATE_REPORT_TEMPLATE_ACTIONS`,
  `@ReportTemplate/CREATE_REPORT_TEMPLATE_ACTIONS_SUCCESS`,
  `@ReportTemplate/CREATE_REPORT_TEMPLATE_ACTIONS_FAIL`,
)<CreateReportTemplateParams, void, ErrorField[]>();

export const updateReportTemplateActions = createAsyncAction(
  `@ReportTemplate/UPDATE_REPORT_TEMPLATE_ACTIONS`,
  `@ReportTemplate/UPDATE_REPORT_TEMPLATE_ACTIONS_SUCCESS`,
  `@ReportTemplate/UPDATE_REPORT_TEMPLATE_ACTIONS_FAIL`,
)<UpdateReportTemplateParams, void, ErrorField[]>();

export const getReportTemplateDetailActions = createAsyncAction(
  `@ReportTemplate/GET_REPORT_TEMPLATE_DETAIL_ACTIONS`,
  `@ReportTemplate/GET_REPORT_TEMPLATE_DETAIL_ACTIONS_SUCCESS`,
  `@ReportTemplate/GET_REPORT_TEMPLATE_DETAIL_ACTIONS_FAIL`,
)<string, ReportTemplateDetailResponse, void>();

export const clearReportTemplateReducer = createAction(
  `@ReportTemplate/CLEAR_REPORT_TEMPLATE_REDUCER`,
)<void | boolean>();

export const clearReportTemplateErrorsReducer = createAction(
  `@ReportTemplate/CLEAR_REPORT_TEMPLATE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@ReportTemplate/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@reportOfFinding/SET_DATA_FILTER`,
)<CommonApiParam>();
