import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { CreatePscActionParams } from 'models/api/psc-action/psc-action.model';

import { State } from '../reducer';
import {
  getPscActionDetailActions,
  getListPscActions,
  updatePscActions,
  deletePscActions,
  createPscActions,
} from './psc-action.action';
import {
  getPscActionDetailActionsApi,
  getListPscActionsApi,
  deletePscActionsApi,
  createPscActionsApi,
  updatePscActionPermissionDetailActionsApi,
} from '../../api/psc-action.api';

function* getListPscActionsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListPscActionsApi, other);
    const { data } = response;
    yield put(getListPscActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListPscActions.failure());
  }
}

function* deletePscActionsSaga(action) {
  try {
    const { params, listPscActions } = yield select(
      (state: State) => state.pscAction,
    );
    yield call(deletePscActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPscActions.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deletePscActions.success(newParams));
    action.payload?.getListPscAction?.();
  } catch (e) {
    toastError(e);
    yield put(deletePscActions.failure());
  }
}

function* createPscActionSaga(action) {
  try {
    const params: CreatePscActionParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createPscActionsApi, params);
    yield put(createPscActions.success());
    yield put(getListPscActions.request({}));
    action.payload?.afterCreate?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createPscActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createPscActions.failure(undefined));
    }
  }
}

function* getPscActionDetailSaga(action) {
  try {
    const response = yield call(getPscActionDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getPscActionDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.PSC_ACTION);
    }
    toastError(e);
    yield put(getPscActionDetailActions.failure());
  }
}

function* updatePscActionSaga(action) {
  try {
    yield call(updatePscActionPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate?.();
    yield put(updatePscActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updatePscActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updatePscActions.failure(undefined));
    }
  }
}

export default function* PscActionAndPermissionSaga() {
  yield all([
    yield takeLatest(deletePscActions.request, deletePscActionsSaga),
    yield takeLatest(getListPscActions.request, getListPscActionsSaga),
    yield takeLatest(createPscActions.request, createPscActionSaga),
    yield takeLatest(getPscActionDetailActions.request, getPscActionDetailSaga),
    yield takeLatest(updatePscActions.request, updatePscActionSaga),
  ]);
}
