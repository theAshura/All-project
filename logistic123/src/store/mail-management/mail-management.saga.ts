import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import {
  createMailManagementActionsApi,
  getMailTypeActionsApi,
  getListMailManagementActionsApi,
  deleteMailManagementApi,
  getMailManagementDetailApi,
  updateMailManagementDetailApi,
} from 'api/mail-management.api';

import { State } from '../reducer';
import {
  deleteMailManagementActions,
  getMailManagementDetailActions,
  updateMailManagementActions,
  getListMailManagementActions,
  getMailTypesActions,
  createMailManagementActions,
} from './mail-management.action';

function* getListMailManagementSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListMailManagementActionsApi, other);
    const { data } = response;
    yield put(getListMailManagementActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListMailManagementActions.failure());
  }
}

function* deleteMailManagementSaga(action) {
  try {
    const { params, listMailManagement } = yield select(
      (state: State) => state.mailManagement,
    );
    yield call(deleteMailManagementApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listMailManagement.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteMailManagementActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(deleteMailManagementActions.failure());
  }
}

function* createMailManagementSaga(action) {
  try {
    yield call(createMailManagementActionsApi, action.payload);
    yield put(createMailManagementActions.success());
    toastSuccess('You have created successfully');
    history.push(AppRouteConst.MAIL_MANAGEMENT);
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createMailManagementActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createMailManagementActions.failure(undefined));
    }
  }
}

function* getMailTypesSaga(action) {
  try {
    const response = yield call(getMailTypeActionsApi, action.payload);
    const { data } = response;

    yield put(getMailTypesActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.MAIL_MANAGEMENT);
    }
    toastError(e);
    yield put(getMailTypesActions.failure());
  }
}

function* updateMailManagementSaga(action) {
  try {
    yield call(updateMailManagementDetailApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.MAIL_MANAGEMENT);
    yield put(updateMailManagementActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateMailManagementActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateMailManagementActions.failure(undefined));
    }
  }
}

function* getMailManagementDetailSaga(action) {
  try {
    const response = yield call(getMailManagementDetailApi, action.payload);
    const { data } = response;
    yield put(getMailManagementDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getMailManagementDetailActions.failure());
  }
}

export default function* MailManagementSaga() {
  yield all([
    yield takeLatest(
      deleteMailManagementActions.request,
      deleteMailManagementSaga,
    ),
    yield takeLatest(
      getListMailManagementActions.request,
      getListMailManagementSaga,
    ),
    yield takeLatest(
      createMailManagementActions.request,
      createMailManagementSaga,
    ),
    yield takeLatest(getMailTypesActions.request, getMailTypesSaga),
    yield takeLatest(
      updateMailManagementActions.request,
      updateMailManagementSaga,
    ),
    yield takeLatest(
      getMailManagementDetailActions.request,
      getMailManagementDetailSaga,
    ),
  ]);
}
