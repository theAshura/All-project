import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import { InjuryBody } from 'models/api/injury-body/injury-body.model';
import { State } from 'store/reducer';
import {
  getInjuryBodyDetailActionsApi,
  getListInjuryBodyActionsApi,
  deleteInjuryBodyActionsApi,
  createInjuryBodyActionsApi,
  updateInjuryBodyPermissionDetailActionsApi,
} from 'api/injury-body.api';
import {
  getInjuryBodyDetailActions,
  getListInjuryBodyActions,
  updateInjuryBodyActions,
  deleteInjuryBodyActions,
  createInjuryBodyActions,
} from './injury-body.action';

function* getListInjuryBodySaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListInjuryBodyActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListInjuryBodyActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListInjuryBodyActions.failure());
  }
}

function* deleteInjuryBodySaga(action) {
  try {
    const { params, listInjuryBody } = yield select(
      (state: State) => state.injuryBody,
    );
    yield call(deleteInjuryBodyActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listInjuryBody.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteInjuryBodyActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteInjuryBodyActions.failure());
  }
}

function* createInjuryBodySaga(action) {
  try {
    const params: InjuryBody = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createInjuryBodyActionsApi, params);
    yield put(createInjuryBodyActions.success());
    action.payload?.handleSuccess();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createInjuryBodyActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createInjuryBodyActions.failure(undefined));
    }
  }
}

function* getInjuryBodyDetailSaga(action) {
  try {
    const response = yield call(getInjuryBodyDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getInjuryBodyDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getInjuryBodyDetailActions.failure());
  }
}

function* updateInjuryBodySaga(action) {
  try {
    yield call(updateInjuryBodyPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.handleSuccess();

    yield put(updateInjuryBodyActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateInjuryBodyActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateInjuryBodyActions.failure(undefined));
    }
  }
}

export default function* InjuryBodyAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteInjuryBodyActions.request, deleteInjuryBodySaga),
    yield takeLatest(getListInjuryBodyActions.request, getListInjuryBodySaga),
    yield takeLatest(createInjuryBodyActions.request, createInjuryBodySaga),
    yield takeLatest(
      getInjuryBodyDetailActions.request,
      getInjuryBodyDetailSaga,
    ),
    yield takeLatest(updateInjuryBodyActions.request, updateInjuryBodySaga),
  ]);
}
