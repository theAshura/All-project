import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { CreateLocationParams } from 'models/api/location/location.model';

import { State } from '../reducer';
import {
  getLocationDetailActions,
  getListLocationActions,
  updateLocationActions,
  deleteLocationActions,
  createLocationActions,
} from './location.action';
import {
  getLocationDetailActionsApi,
  getListLocationsActionsApi,
  deleteLocationActionsApi,
  createLocationActionsApi,
  updateLocationPermissionDetailActionsApi,
} from '../../api/location.api';

function* getListLocationsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListLocationsActionsApi, other);
    const { data } = response;
    yield put(getListLocationActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListLocationActions.failure());
  }
}

function* deleteLocationsSaga(action) {
  try {
    const { params, listLocations } = yield select(
      (state: State) => state.location,
    );
    yield call(deleteLocationActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listLocations.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteLocationActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.getListLocation();
  } catch (e) {
    toastError(e);
    yield put(deleteLocationActions.failure());
  }
}

function* createLocationSaga(action) {
  try {
    const params: CreateLocationParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createLocationActionsApi, params);
    yield put(createLocationActions.success());
    toastSuccess('You have created successfully');
    action.payload?.afterCreate();
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createLocationActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createLocationActions.failure(undefined));
    }
  }
}

function* getLocationDetailSaga(action) {
  try {
    const response = yield call(getLocationDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getLocationDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.LOCATION);
    }
    toastError(e);
    yield put(getLocationDetailActions.failure());
  }
}

function* updateLocationSaga(action) {
  try {
    yield call(updateLocationPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');

    yield put(updateLocationActions.success());
    action.payload?.afterUpdate();
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateLocationActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateLocationActions.failure(undefined));
    }
  }
}

export default function* LocationAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteLocationActions.request, deleteLocationsSaga),
    yield takeLatest(getListLocationActions.request, getListLocationsSaga),
    yield takeLatest(createLocationActions.request, createLocationSaga),
    yield takeLatest(getLocationDetailActions.request, getLocationDetailSaga),
    yield takeLatest(updateLocationActions.request, updateLocationSaga),
  ]);
}
