import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { State } from '../reducer';

import {
  getFeatureConfigDetailActions,
  getListFeatureConfigActions,
  updateFeatureConfigActions,
  deleteFeatureConfigActions,
  createFeatureConfigActions,
} from './feature-config.action';
import {
  getFeatureConfigDetailActionsApi,
  getListFeatureConfigsActionsApi,
  deleteFeatureConfigActionsApi,
  createFeatureConfigActionsApi,
  updateFeatureConfigPermissionDetailActionsApi,
} from '../../api/feature-config.api';

function* getListFeatureConfigsSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;
    const response = yield call(getListFeatureConfigsActionsApi, other);
    const { data } = response;
    yield put(getListFeatureConfigActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListFeatureConfigActions.failure());
  }
}

function* deleteFeatureConfigsSaga(action) {
  try {
    const { params, listFeatureConfigs } = yield select(
      (state: State) => state.auditType,
    );
    yield call(deleteFeatureConfigActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listFeatureConfigs.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteFeatureConfigActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListFeatureConfig();
  } catch (e) {
    toastError(e);
    yield put(deleteFeatureConfigActions.failure());
  }
}

function* createFeatureConfigSaga(action) {
  try {
    const { isNew, resetForm, ...params } = action.payload;

    yield call(createFeatureConfigActionsApi, params);
    yield put(createFeatureConfigActions.success());
    yield put(getListFeatureConfigActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createFeatureConfigActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createFeatureConfigActions.failure(undefined));
    }
  }
}

function* getFeatureConfigDetailSaga(action) {
  try {
    const response = yield call(
      getFeatureConfigDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getFeatureConfigDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TYPE);
    }
    toastError(e);
    yield put(getFeatureConfigDetailActions.failure());
  }
}

function* updateFeatureConfigSaga(action) {
  try {
    yield call(updateFeatureConfigPermissionDetailActionsApi, action.payload);
    put(updateFeatureConfigActions.success());
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateFeatureConfigActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateFeatureConfigActions.failure(undefined));
    }
  }
}

export default function* FeatureConfigAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteFeatureConfigActions.request,
      deleteFeatureConfigsSaga,
    ),
    yield takeLatest(
      getListFeatureConfigActions.request,
      getListFeatureConfigsSaga,
    ),
    yield takeLatest(
      createFeatureConfigActions.request,
      createFeatureConfigSaga,
    ),
    yield takeLatest(
      getFeatureConfigDetailActions.request,
      getFeatureConfigDetailSaga,
    ),
    yield takeLatest(
      updateFeatureConfigActions.request,
      updateFeatureConfigSaga,
    ),
  ]);
}
