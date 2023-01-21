import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createExternalActionsApi,
  deleteExternalActionsApi,
  getDetailExternalActionsApi,
  getListExternalActionsApi,
  updateExternalActionsApi,
} from 'api/external.api';
import {
  createExternalActions,
  deleteExternalActions,
  getDetailExternal,
  getLisExternalActions,
  updateExternalActions,
} from './external.action';

function* getListExternalSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListExternalActionsApi, other);
    const { data } = response;
    yield put(getLisExternalActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e?.message);
    yield put(getLisExternalActions.failure());
  }
}
function* createExternalSaga(action) {
  try {
    const params = {
      ...action?.payload,
      eventTypeId: action?.payload?.eventTypeId
        ?.map((item) => item.value)
        .join(),
      authorityId: action?.payload?.authorityId
        ?.map((item) => item.value)
        .join(),
      noFindings: action?.payload?.noFindings !== 'false',
    };
    const response = yield call(createExternalActionsApi, params);
    action?.payload?.handleSuccess?.();
    yield put(createExternalActions.success());
    action?.payload?.handleSuccess?.();
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message);
    yield put(createExternalActions.failure());
  }
}
function* updateExternalSaga(action) {
  try {
    const params = {
      ...action.payload,
      data: {
        ...action?.payload?.data,
        eventTypeId: action?.payload?.data?.eventTypeId
          ?.map((item) => item.value)
          .join(),
        authorityId: action?.payload?.data?.authorityId
          ?.map((item) => item.value)
          .join(),
        noFindings: action?.payload?.data?.noFindings !== 'false',
      },
    };
    const response = yield call(updateExternalActionsApi, params);
    yield put(updateExternalActions.success());
    action?.payload?.handleSuccess?.();
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message);
    yield put(updateExternalActions.failure());
  }
}
function* deleteExternalSaga(action) {
  try {
    const response = yield call(deleteExternalActionsApi, action.payload);

    yield put(deleteExternalActions.success());
    if (action.payload.afterDelete) {
      action.payload.afterDelete();
    }
    toastSuccess(response?.data?.message);
    action.payload?.handleSuccess?.();
  } catch (e) {
    toastError(e?.message);
    yield put(deleteExternalActions.failure());
  }
}
function* getDetailExternalSaga(action) {
  try {
    const response = yield call(getDetailExternalActionsApi, action.payload);

    const { data } = response;
    yield put(getDetailExternal.success(data));
  } catch (e) {
    yield put(getDetailExternal.failure());
  }
}

export default function* ExternalSaga() {
  yield all([
    yield takeLatest(getLisExternalActions.request, getListExternalSaga),
    yield takeLatest(createExternalActions.request, createExternalSaga),
    yield takeLatest(deleteExternalActions.request, deleteExternalSaga),
    yield takeLatest(getDetailExternal.request, getDetailExternalSaga),
    yield takeLatest(updateExternalActions.request, updateExternalSaga),
  ]);
}
