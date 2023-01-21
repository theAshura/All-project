import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import { Fleet } from 'models/api/fleet/fleet.model';
import { State } from 'store/reducer';
import {
  getFleetDetailActionsApi,
  getListFleetsActionsApi,
  deleteFleetActionsApi,
  createFleetActionsApi,
  updateFleetPermissionDetailActionsApi,
  getListCompanyActionsApi,
} from '../../api/fleet.api';
import {
  getFleetDetailActions,
  getListFleetActions,
  updateFleetActions,
  deleteFleetActions,
  createFleetActions,
  getListCompanyActions,
} from './fleet.action';

function* getListFleetsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListFleetsActionsApi, other);

    const { data } = response;
    yield put(getListFleetActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListFleetActions.failure());
  }
}

function* getListCompanySaga(action) {
  try {
    const response = yield call(getListCompanyActionsApi, action.payload);

    const { data } = response;
    yield put(getListCompanyActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCompanyActions.failure());
  }
}

function* deleteFleetsSaga(action) {
  try {
    const { params, listFleets } = yield select((state: State) => state.fleet);
    yield call(deleteFleetActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listFleets.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteFleetActions.success(newParams));
    action.payload?.getListFleet();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteFleetActions.failure());
  }
}

function* createFleetSaga(action) {
  try {
    const params: Fleet = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createFleetActionsApi, params);
    yield put(createFleetActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createFleetActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createFleetActions.failure(undefined));
    }
  }
}

function* getFleetDetailSaga(action) {
  try {
    const response = yield call(getFleetDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getFleetDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getFleetDetailActions.failure());
  }
}

function* updateFleetSaga(action) {
  try {
    yield call(updateFleetPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateFleetActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateFleetActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateFleetActions.failure(undefined));
    }
  }
}

export default function* FleetAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteFleetActions.request, deleteFleetsSaga),
    yield takeLatest(getListCompanyActions.request, getListCompanySaga),
    yield takeLatest(getListFleetActions.request, getListFleetsSaga),
    yield takeLatest(createFleetActions.request, createFleetSaga),
    yield takeLatest(getFleetDetailActions.request, getFleetDetailSaga),
    yield takeLatest(updateFleetActions.request, updateFleetSaga),
  ]);
}
