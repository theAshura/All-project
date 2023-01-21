import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  UpdateParams,
  CreateGeneralInfoBody,
  GetAuditCheckListResponse,
  CreateGeneralInfoResponse,
  GetAuditCheckListDetailResponse,
  GetROFFromIARResponsive,
  ReorderBody,
} from 'models/api/audit-checklist/audit-checklist.model';
import { Question } from 'models/store/audit-checklist/audit-checklist.model';
import {
  CommonMessageErrorResponse,
  CommonApiParam,
  CommonActionRequest,
} from 'models/common.model';

interface DeleteParams {
  id: string;
  isDetail?: boolean;
  getListAuditCheckList: () => void;
}

export const getListAuditCheckListAction = createAsyncAction(
  '@auditChecklist/GET_LIST_AUDIT_CHECKLIST_REQUEST',
  '@auditChecklist/GET_LIST_AUDIT_CHECKLIST_SUCCESS',
  '@auditChecklist/GET_LIST_AUDIT_CHECKLIST_FAILURE',
)<CommonApiParam, GetAuditCheckListResponse, void>();

export const getListROFFromIARAction = createAsyncAction(
  '@auditChecklist/GET_LIST_ROF_FROM_IAR_REQUEST',
  '@auditChecklist/GET_LIST_ROF_FROM_IAR_SUCCESS',
  '@auditChecklist/GET_LIST_ROF_FROM_IAR_FAILURE',
)<CommonApiParam, GetROFFromIARResponsive, void>();

export const deleteAuditCheckListAction = createAsyncAction(
  '@auditChecklist/DELETE_AUDIT_CHECKLIST_REQUEST',
  '@auditChecklist/DELETE_AUDIT_CHECKLIST_SUCCESS',
  '@auditChecklist/DELETE_AUDIT_CHECKLIST_FAILURE',
)<DeleteParams, CommonApiParam, void>();

export const acceptAuditCheckListAction = createAsyncAction(
  '@auditChecklist/ACCEPT_AUDIT_CHECKLIST_REQUEST',
  '@auditChecklist/ACCEPT_AUDIT_CHECKLIST_SUCCESS',
  '@auditChecklist/ACCEPT_AUDIT_CHECKLIST_FAILURE',
)<CommonActionRequest, void, void>();

export const undoSubmitAuditCheckListAction = createAsyncAction(
  '@auditChecklist/UNDO_SUBMIT_AUDIT_CHECKLIST_REQUEST',
  '@auditChecklist/UNDO_SUBMIT_AUDIT_CHECKLIST_SUCCESS',
  '@auditChecklist/UNDO_SUBMIT_AUDIT_CHECKLIST_FAILURE',
)<CommonActionRequest, void, void>();

export const cancelAuditCheckListAction = createAsyncAction(
  '@auditChecklist/CANCEL_AUDIT_CHECKLIST_REQUEST',
  '@auditChecklist/CANCEL_AUDIT_CHECKLIST_SUCCESS',
  '@auditChecklist/CANCEL_AUDIT_CHECKLIST_FAILURE',
)<CommonActionRequest, void, void>();

export const approveAuditCheckListAction = createAsyncAction(
  '@auditChecklist/APPROVE_AUDIT_CHECKLIST_REQUEST',
  '@auditChecklist/APPROVE_AUDIT_CHECKLIST_SUCCESS',
  '@auditChecklist/APPROVE_AUDIT_CHECKLIST_FAILURE',
)<CommonActionRequest, void, void>();

export const refreshChecklistDetailAction = createAsyncAction(
  '@auditChecklist/REFRESH_PAGE_CREATE_REQUEST',
  '@auditChecklist/REFRESH_PAGE_CREATE_SUCCESS',
  '@auditChecklist/REFRESH_PAGE_CREATE_FAILURE',
)<string, CreateGeneralInfoResponse, void>();

export const createGeneralInfoAction = createAsyncAction(
  '@auditChecklist/CREATE_GENERAL_INFO_REQUEST',
  '@auditChecklist/CREATE_GENERAL_INFO_SUCCESS',
  '@auditChecklist/CREATE_GENERAL_INFO_FAILURE',
)<
  CreateGeneralInfoBody,
  CreateGeneralInfoResponse,
  CommonMessageErrorResponse[]
>();

export const reorderQuestionList = createAsyncAction(
  '@auditChecklist/REORDER_QUESTION_LIST_REQUEST',
  '@auditChecklist/REORDER_QUESTION_LIST_SUCCESS',
  '@auditChecklist/REORDER_QUESTION_LIST_FAILURE',
)<ReorderBody, Question[] | void, CommonMessageErrorResponse[]>();

export const updateGeneralInfoAction = createAsyncAction(
  '@auditChecklist/UPDATE_GENERAL_INFO_REQUEST',
  '@auditChecklist/UPDATE_GENERAL_INFO_SUCCESS',
  '@auditChecklist/UPDATE_GENERAL_INFO_FAILURE',
)<UpdateParams, CreateGeneralInfoResponse, CommonMessageErrorResponse[]>();

export const createQuestionAction = createAsyncAction(
  '@auditChecklist/CREATE_QUESTION_REQUEST',
  '@auditChecklist/CREATE_QUESTION_SUCCESS',
  '@auditChecklist/CREATE_QUESTION_FAILURE',
)<
  {
    id: string;
    body: any;
    handleSuccess?: (newQuestion?: Question) => void;
    isDuplicate?: boolean;
  },
  Question[],
  CommonMessageErrorResponse[]
>();

export const checkIsCreatedInitialData = createAction(
  '@auditChecklist/CREATED_INITIAL_DATA',
)<boolean>();

export const updateQuestionAction = createAsyncAction(
  '@auditChecklist/UPDATE_QUESTION_REQUEST',
  '@auditChecklist/UPDATE_QUESTION_SUCCESS',
  '@auditChecklist/UPDATE_QUESTION_FAILURE',
)<
  {
    idAuditChecklist: string;
    idQuestion: string;
    body: any;
    hasSubmit?: boolean;
    handleSuccess?: () => void;
  },
  Question[],
  CommonMessageErrorResponse[]
>();

export const getListQuestionAction = createAsyncAction(
  '@auditChecklist/GET_LIST_QUESTION_REQUEST',
  '@auditChecklist/GET_LIST_QUESTION_SUCCESS',
  '@auditChecklist/GET_LIST_QUESTION_FAILURE',
)<
  {
    id: string;
    body: any;
    companyId?: string;
    onSuccess?: (question?: Question[]) => void;
  },
  Question[],
  void
>();

export const submitAuditCheckListAction = createAsyncAction(
  '@auditChecklist/SUBMIT_AUDIT_CHECKLIST_REQUEST',
  '@auditChecklist/SUBMIT_AUDIT_CHECKLIST_SUCCESS',
  '@auditChecklist/SUBMIT_AUDIT_CHECKLIST_FAILURE',
)<CommonApiParam, void, void>();

export const getAuditCheckListDetailAction = createAsyncAction(
  '@auditChecklist/GET_AUDIT_CHECKLIST_DETAIL_REQUEST',
  '@auditChecklist/GET_AUDIT_CHECKLIST_DETAIL_SUCCESS',
  '@auditChecklist/GET_AUDIT_CHECKLIST_DETAIL_FAILURE',
)<string, GetAuditCheckListDetailResponse, void>();

export const deleteQuestionAction = createAsyncAction(
  '@auditChecklist/DELETE_QUESTION_REQUEST',
  '@auditChecklist/DELETE_QUESTION_SUCCESS',
  '@auditChecklist/DELETE_QUESTION_FAILURE',
)<{ idAuditChecklist: string; idQuestion: string }, Question[], void>();

export const clearCreatedAuditCheckListAction = createAction(
  `@auditChecklist/CLEAR_CREATED_AUDIT_CHECK_LIST`,
)<void>();

export const clearAuditCheckListDetail = createAction(
  `@auditChecklist/CLEAR_AUDIT_CHECKLIST_DETAIL`,
)<void>();

export const clearAuditCheckListReducer = createAction(
  '@auditChecklist/CLEAR_AUDIT_CHECKLIST_REDUCER',
)<void>();

export const clearErrorMessages = createAction(
  '@auditChecklist/CLEAR_ERROR_MESSAGES',
)<void>();

export const updateParamsActions = createAction(
  `@auditChecklist/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@AuditInspectionWorkspace/SET_DATA_FILTER`,
)<CommonApiParam>();
