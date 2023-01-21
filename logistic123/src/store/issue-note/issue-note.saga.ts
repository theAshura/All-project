import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { State } from 'store/reducer';
import { checkExitResponse } from 'models/api/issue-note/issue-note.model';
import {
  getIssueNoteDetailActions,
  getListIssueNoteActions,
  updateIssueNoteActions,
  deleteIssueNoteActions,
  createIssueNoteActions,
  checkExitCodeAction,
} from './issue-note.action';
import {
  getIssueNoteDetailActionsApi,
  getListIssueNotesActionsApi,
  deleteIssueNoteActionsApi,
  createIssueNoteActionsApi,
  updateIssueNotePermissionDetailActionsApi,
  checkExitCodeApi,
} from '../../api/issue-note.api';

function* getListIssueNotesSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListIssueNotesActionsApi, other);
    const { data } = response;
    yield put(getListIssueNoteActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListIssueNoteActions.failure());
  }
}

function* deleteIssueNotesSaga(action) {
  try {
    const { params, listIssues } = yield select(
      (state: State) => state.issueNote,
    );

    yield call(deleteIssueNoteActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listIssues.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteIssueNoteActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListIssue();
  } catch (e) {
    toastError(e);
    yield put(deleteIssueNoteActions.failure());
  }
}

function* createIssueNoteSaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createIssueNoteActionsApi, other);
    yield put(createIssueNoteActions.success());
    yield put(getListIssueNoteActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createIssueNoteActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createIssueNoteActions.failure(undefined));
    }
  }
}

function* getIssueNoteDetailSaga(action) {
  try {
    const response = yield call(getIssueNoteDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getIssueNoteDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.ISSUE_NOTE);
    }
    toastError(e);
    yield put(getIssueNoteDetailActions.failure());
  }
}

function* updateIssueNoteSaga(action) {
  try {
    yield call(updateIssueNotePermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.ISSUE_NOTE);
    action.payload?.afterUpdate();
    yield put(updateIssueNoteActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateIssueNoteActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateIssueNoteActions.failure(undefined));
    }
  }
}

function* checkExitCodeSaga(action) {
  try {
    const { isExistField } = yield select((state: State) => state.issueNote);
    const response = yield call(checkExitCodeApi, action.payload);
    if (action?.payload?.field === 'code') {
      const res: checkExitResponse = {
        isExistCode: response?.data?.isExist,
        isExistName: isExistField?.isExistName,
      };
      yield put(checkExitCodeAction.success(res));
    } else {
      const res: checkExitResponse = {
        isExistName: response?.data?.isExist,
        isExistCode: isExistField?.isExistCode,
      };
      yield put(checkExitCodeAction.success(res));
    }
  } catch (e) {
    toastError(e);
    yield put(checkExitCodeAction.failure(undefined));
  }
}

export default function* IssueNoteNoteSaga() {
  yield all([
    yield takeLatest(deleteIssueNoteActions.request, deleteIssueNotesSaga),
    yield takeLatest(getListIssueNoteActions.request, getListIssueNotesSaga),
    yield takeLatest(createIssueNoteActions.request, createIssueNoteSaga),
    yield takeLatest(getIssueNoteDetailActions.request, getIssueNoteDetailSaga),
    yield takeLatest(updateIssueNoteActions.request, updateIssueNoteSaga),
    yield takeLatest(checkExitCodeAction.request, checkExitCodeSaga),
  ]);
}
