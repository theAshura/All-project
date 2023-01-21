import {
  GetIssueNotesResponse,
  CreateIssueNoteParams,
  UpdateIssueNoteParams,
  IssueNoteDetailResponse,
  CheckExitCodeParams,
  checkExitResponse,
} from 'models/api/issue-note/issue-note.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteIssueNote {
  id: string;
  isDetail?: boolean;
  getListIssue: () => void;
}

export const getListIssueNoteActions = createAsyncAction(
  `@IssueNote/GET_LIST_ISSUE_NOTE_ACTIONS`,
  `@IssueNote/GET_LIST_ISSUE_NOTE_ACTIONS_SUCCESS`,
  `@IssueNote/GET_LIST_ISSUE_NOTE_ACTIONS_FAIL`,
)<CommonApiParam, GetIssueNotesResponse, void>();

export const deleteIssueNoteActions = createAsyncAction(
  `@IssueNote/DELETE_ISSUE_NOTE_ACTIONS`,
  `@IssueNote/DELETE_ISSUE_NOTE_ACTIONS_SUCCESS`,
  `@IssueNote/DELETE_ISSUE_NOTE_ACTIONS_FAIL`,
)<ParamsDeleteIssueNote, CommonApiParam, void>();

export const createIssueNoteActions = createAsyncAction(
  `@IssueNote/CREATE_ISSUE_NOTE_ACTIONS`,
  `@IssueNote/CREATE_ISSUE_NOTE_ACTIONS_SUCCESS`,
  `@IssueNote/CREATE_ISSUE_NOTE_ACTIONS_FAIL`,
)<CreateIssueNoteParams, void, ErrorField[]>();

export const updateIssueNoteActions = createAsyncAction(
  `@IssueNote/UPDATE_ISSUE_NOTE_ACTIONS`,
  `@IssueNote/UPDATE_ISSUE_NOTE_ACTIONS_SUCCESS`,
  `@IssueNote/UPDATE_ISSUE_NOTE_ACTIONS_FAIL`,
)<UpdateIssueNoteParams, void, ErrorField[]>();

export const getIssueNoteDetailActions = createAsyncAction(
  `@IssueNote/GET_ISSUE_NOTE_DETAIL_ACTIONS`,
  `@IssueNote/GET_ISSUE_NOTE_DETAIL_ACTIONS_SUCCESS`,
  `@IssueNote/GET_ISSUE_NOTE_DETAIL_ACTIONS_FAIL`,
)<string, IssueNoteDetailResponse, void>();

export const checkExitCodeAction = createAsyncAction(
  `@IssueNote/CHECK_EXIT_CODE_ACTIONS`,
  `@IssueNote/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@IssueNote/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, checkExitResponse, void>();

export const clearIssueNoteReducer = createAction(
  `@IssueNote/CLEAR_ISSUE_NOTE_REDUCER`,
)<void>();

export const clearIssueNoteErrorsReducer = createAction(
  `@IssueNote/CLEAR_ISSUE_NOTE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@IssueNote/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
