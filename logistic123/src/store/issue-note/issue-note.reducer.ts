import { IssueNoteStoreModel } from 'models/store/issue-note/issue-note.model';
import { createReducer } from 'typesafe-actions';
import {
  getListIssueNoteActions,
  deleteIssueNoteActions,
  updateIssueNoteActions,
  createIssueNoteActions,
  getIssueNoteDetailActions,
  clearIssueNoteReducer,
  updateParamsActions,
  clearIssueNoteErrorsReducer,
  checkExitCodeAction,
} from './issue-note.action';

const INITIAL_STATE: IssueNoteStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listIssues: undefined,
  issueDetail: null,
  errorList: undefined,
};

const issueNoteReducer = createReducer<IssueNoteStoreModel>(INITIAL_STATE)
  .handleAction(getListIssueNoteActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListIssueNoteActions.success, (state, { payload }) => ({
    ...state,
    listIssues: payload,
    loading: false,
  }))
  .handleAction(getListIssueNoteActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteIssueNoteActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteIssueNoteActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },

    loading: false,
  }))
  .handleAction(deleteIssueNoteActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateIssueNoteActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateIssueNoteActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateIssueNoteActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createIssueNoteActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createIssueNoteActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createIssueNoteActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getIssueNoteDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getIssueNoteDetailActions.success, (state, { payload }) => ({
    ...state,
    issueDetail: payload,
    loading: false,
  }))
  .handleAction(getIssueNoteDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearIssueNoteErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(checkExitCodeAction.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(checkExitCodeAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    isExistField: payload,
  }))
  .handleAction(checkExitCodeAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearIssueNoteReducer, () => ({
    ...INITIAL_STATE,
  }));

export default issueNoteReducer;
