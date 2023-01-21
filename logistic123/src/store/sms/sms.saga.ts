import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { CreateSmsParams } from 'models/api/sms/sms.model';
import {
  createSmsActionsApi,
  deleteSmsActionsApi,
  getSmsDetailActionsApi,
  getListSmsActionsApi,
  updateSmsDetailActionsApi,
} from 'api/sms.api';
import {
  createSmsActions,
  deleteSmsActions,
  getSmsDetailActions,
  getListSmsActions,
  updateSmsActions,
} from './sms.action';

function* getListSmsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListSmsActionsApi, other);

    const { data } = response;
    yield put(getListSmsActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListSmsActions.failure());
  }
}

function* createSmsSaga(action) {
  try {
    const params: CreateSmsParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createSmsActionsApi, params);
    yield put(createSmsActions.success());
    action?.payload?.afterCreate?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createSmsActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createSmsActions.failure(undefined));
    }
  }
}

function* deleteSmsSaga(action) {
  try {
    const { params, ListInjury } = yield select((state: State) => state.injury);
    yield call(deleteSmsActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      ListInjury.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteSmsActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteSmsActions.failure());
  }
}

function* getSmsDetailSaga(action) {
  try {
    const response = yield call(getSmsDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getSmsDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSmsDetailActions.failure());
  }
}

function* updateSmsSaga(action) {
  try {
    yield call(updateSmsDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateSmsActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateSmsActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateSmsActions.failure(undefined));
    }
  }
}

export default function* SmsSaga() {
  yield all([
    yield takeLatest(createSmsActions.request, createSmsSaga),
    yield takeLatest(getListSmsActions.request, getListSmsSaga),
    yield takeLatest(deleteSmsActions.request, deleteSmsSaga),
    yield takeLatest(getSmsDetailActions.request, getSmsDetailSaga),
    yield takeLatest(updateSmsActions.request, updateSmsSaga),
  ]);
}
