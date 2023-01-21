import {
  GetAuditInspectionWorkspacesResponse,
  AuditInspectionWorkspaceDetailResponse,
  AuditInspectionChecklistResponse,
  FillChecklist,
  GetFillChecklistParams,
  UpdateFillChecklistParams,
  ListAIWFindingSummaryResponse,
  UpdateFindingSummary,
  SubmitWorkspaceParams,
  RemarkParam,
  ListRemarkResponse,
  InspectionWorkSpaceSummaryResponse,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface GetDetailParams {
  id: string;
  afterGetDetail?: () => void;
}

export const getListAuditInspectionWorkspaceActions = createAsyncAction(
  `@AuditInspectionWorkspace/GET_LIST_AUDIT_INSPECTION_WORKSPACE_ACTIONS`,
  `@AuditInspectionWorkspace/GET_LIST_AUDIT_INSPECTION_WORKSPACE_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/GET_LIST_AUDIT_INSPECTION_WORKSPACE_ACTIONS_FAIL`,
)<CommonApiParam, GetAuditInspectionWorkspacesResponse, void>();

export const getAuditInspectionWorkspaceDetailActions = createAsyncAction(
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_DETAIL_ACTIONS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_DETAIL_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_DETAIL_ACTIONS_FAIL`,
)<string, AuditInspectionWorkspaceDetailResponse, void>();

export const getAuditWorkspaceSummaryActions = createAsyncAction(
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_SUMMARY_ACTIONS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_SUMMARY_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_SUMMARY_ACTIONS_FAIL`,
)<GetDetailParams, ListAIWFindingSummaryResponse, void>();

export const getAuditWorkspaceChecklistActions = createAsyncAction(
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_ACTIONS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_ACTIONS_FAIL`,
)<GetDetailParams, AuditInspectionChecklistResponse[], void>();

export const getAuditWorkspaceChecklistDetailActions = createAsyncAction(
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/GET_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS_FAIL`,
)<GetFillChecklistParams, FillChecklist[], void>();

export const updateAuditWorkspaceChecklistDetailActions = createAsyncAction(
  `@AuditInspectionWorkspace/UPDATE_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS`,
  `@AuditInspectionWorkspace/UPDATE_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/UPDATE_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS_FAIL`,
)<UpdateFillChecklistParams, void, void>();

export const updateAuditWorkspaceFindingSummaryActions = createAsyncAction(
  `@AuditInspectionWorkspace/UPDATE_AUDIT_INSPECTION_WORKSPACE_FINDING_SUMMARY_ACTIONS`,
  `@AuditInspectionWorkspace/UPDATE_AUDIT_INSPECTION_WORKSPACE_FINDING_SUMMARY_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/UPDATE_AUDIT_INSPECTION_WORKSPACE_FINDING_SUMMARY_ACTIONS_FAIL`,
)<UpdateFindingSummary, void, void>();

export const submitAuditWorkspaceChecklistDetailActions = createAsyncAction(
  `@AuditInspectionWorkspace/SUBMIT_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS`,
  `@AuditInspectionWorkspace/SUBMIT_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/SUBMIT_AUDIT_INSPECTION_WORKSPACE_CHECKLIST_DETAIL_ACTIONS_FAIL`,
)<UpdateFillChecklistParams, void, void>();

export const submitAuditWorkspaceActions = createAsyncAction(
  `@AuditInspectionWorkspace/SUBMIT_AUDIT_INSPECTION_WORKSPACE_ACTIONS`,
  `@AuditInspectionWorkspace/SUBMIT_AUDIT_INSPECTION_WORKSPACE_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/SUBMIT_AUDIT_INSPECTION_WORKSPACE_ACTIONS_FAIL`,
)<SubmitWorkspaceParams, void, void>();

export const createRemarkActions = createAsyncAction(
  `@AuditInspectionWorkspace/CREATE_REMARK_ACTIONS`,
  `@AuditInspectionWorkspace/CREATE_REMARK_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/CREATE_REMARK_ACTIONS_FAIL`,
)<RemarkParam, void, void>();

export const updateRemarkActions = createAsyncAction(
  `@AuditInspectionWorkspace/UPDATE_REMARK_ACTIONS`,
  `@AuditInspectionWorkspace/UPDATE_REMARK_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/UPDATE_REMARK_ACTIONS_FAIL`,
)<RemarkParam, void, void>();

export const getRemarksActions = createAsyncAction(
  `@AuditInspectionWorkspace/GET_REMARKS_ACTIONS`,
  `@AuditInspectionWorkspace/GET_REMARKS_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/GET_REMARKS_ACTIONS_FAIL`,
)<CommonApiParam, ListRemarkResponse, void>();

export const deleteRemarkActions = createAsyncAction(
  `@AuditInspectionWorkspace/DELETE_REMARK_ACTIONS`,
  `@AuditInspectionWorkspace/DELETE_REMARK_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/DELETE_REMARK_ACTIONS_FAIL`,
)<CommonApiParam, void, void>();

export const updateMasterChiefActions = createAsyncAction(
  `@AuditInspectionWorkspace/UPDATE_MASTER_ACTIONS`,
  `@AuditInspectionWorkspace/UPDATE_MASTER_ACTIONS_SUCCESS`,
  `@AuditInspectionWorkspace/UPDATE_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, void, void>();

export const clearAuditInspectionWorkspaceReducer = createAction(
  `@AuditInspectionWorkspace/CLEAR_AUDIT_INSPECTION_WORKSPACE_REDUCER`,
)<boolean | void>();

export const clearAuditInspectionWorkspaceErrorsReducer = createAction(
  `@AuditInspectionWorkspace/CLEAR_AUDIT_INSPECTION_WORKSPACE_ERRORS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@AuditInspectionWorkspace/SET_DATA_FILTER`,
)<CommonApiParam>();

export const updateParamsActions = createAction(
  '@AuditInspectionWorkspace/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const getInspectionWorkspaceSummaryAction = createAsyncAction(
  `@AuditInspectionWorkspace/GET_INSPECTION_WORKSPACE_SUMMARY_ACTION`,
  `@AuditInspectionWorkspace/GET_INSPECTION_WORKSPACE_SUMMARY_ACTION_SUCCESS`,
  `@AuditInspectionWorkspace/GET_INSPECTION_WORKSPACE_SUMMARY_ACTION_FAIL`,
)<string, InspectionWorkSpaceSummaryResponse, void>();

export const getAnalyticalReportPerformanceAction = createAsyncAction(
  `@AuditInspectionWorkspace/GET_ANALYTICAL_REPORT_PERFORMANCE_ACTION`,
  `@AuditInspectionWorkspace/GET_ANALYTICAL_REPORT_PERFORMANCE_ACTION_SUCCESS`,
  `@AuditInspectionWorkspace/GET_ANALYTICAL_REPORT_PERFORMANCE_ACTION_FAIL`,
)<string, any, void>();

export const getAnalyticalReportDetailMainSubcategoryWiseAction =
  createAsyncAction(
    `@AuditInspectionWorkspace/GET_ANALYTICAL_REPORT_DETAIL_MAIN_SUBCATEGORY_WISE_ACTION`,
    `@AuditInspectionWorkspace/GET_ANALYTICAL_REPORT_DETAIL_MAIN_SUBCATEGORY_WISE_ACTION_SUCCESS`,
    `@AuditInspectionWorkspace/GET_ANALYTICAL_REPORT_DETAIL_MAIN_SUBCATEGORY_WISE_ACTION_FAIL`,
  )<string, any, void>();
