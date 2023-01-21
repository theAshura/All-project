import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import {
  getStandardMasterDetailActionsApi,
  getListStandardMasterActionsApi,
  deleteStandardMasterActionsApi,
  createStandardMasterActionsApi,
  updateStandardMasterDetailActionsApi,
} from 'api/standard-master.api';
import { State } from '../reducer';

import {
  getStandardMasterDetailActions,
  getListStandardMasterActions,
  updateStandardMasterActions,
  deleteStandardMasterActions,
  createStandardMasterActions,
} from './standard-master.action';

function* getListStandardMastersSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListStandardMasterActionsApi, other);
    const { data } = response;
    yield put(getListStandardMasterActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListStandardMasterActions.failure());
  }
}

function* deleteStandardMastersSaga(action) {
  try {
    const { params, listStandardMasters } = yield select(
      (state: State) => state.standardMaster,
    );
    yield call(deleteStandardMasterActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listStandardMasters.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteStandardMasterActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteStandardMasterActions.failure());
  }
}

function* createStandardMasterSaga(action) {
  try {
    const { isNew, handleSuccess, ...params } = action.payload;

    yield call(createStandardMasterActionsApi, params);
    yield put(createStandardMasterActions.success());
    yield put(getListStandardMasterActions.request({}));
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }
    history.push(AppRouteConst.STANDARD_MASTER);
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createStandardMasterActions.failure(e));
    } else {
      toastError(e);
      yield put(createStandardMasterActions.failure(undefined));
    }
  }
}

function* getStandardMasterDetailSaga(action) {
  try {
    const response = yield call(
      getStandardMasterDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getStandardMasterDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.STANDARD_MASTER);
    }
    toastError(e);
    yield put(getStandardMasterDetailActions.failure());
  }
}

function* updateStandardMasterSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;

    yield call(updateStandardMasterDetailActionsApi, params);
    put(updateStandardMasterActions.success());
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }
    history.push(AppRouteConst.STANDARD_MASTER);
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateStandardMasterActions.failure(e));
    } else {
      toastError(e);
      yield put(updateStandardMasterActions.failure(undefined));
    }
  }
}

export default function* StandardMasterSaga() {
  yield all([
    yield takeLatest(
      deleteStandardMasterActions.request,
      deleteStandardMastersSaga,
    ),
    yield takeLatest(
      getListStandardMasterActions.request,
      getListStandardMastersSaga,
    ),
    yield takeLatest(
      createStandardMasterActions.request,
      createStandardMasterSaga,
    ),
    yield takeLatest(
      getStandardMasterDetailActions.request,
      getStandardMasterDetailSaga,
    ),
    yield takeLatest(
      updateStandardMasterActions.request,
      updateStandardMasterSaga,
    ),
  ]);
}
