import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createMaintenancePerformanceActionsApi,
  deleteMaintenancePerformanceActionsApi,
  getDetailMaintenancePerformanceActionsApi,
  getListMaintenancePerformanceActionsApi,
  updateMaintenancePerformanceActionsApi,
} from 'api/maintenance-performance.api';

import {
  getListMaintenancePerformanceActions,
  createMaintenancePerformanceActions,
  deleteMaintenancePerformanceActions,
  getDetailMaintenancePerformance,
  updateMaintenancePerformanceActions,
} from './maintenance-performance.action';

function* getListMaintenancePerformanceSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListMaintenancePerformanceActionsApi, other);
    const { data } = response;
    yield put(getListMaintenancePerformanceActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListMaintenancePerformanceActions.failure());
  }
}
function* createMaintenancePerformanceSaga(action) {
  try {
    yield call(createMaintenancePerformanceActionsApi, action.payload);

    yield put(createMaintenancePerformanceActions.success());
    if (action.payload.handleSuccess) {
      action.payload.handleSuccess();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    toastError(e);
    yield put(createMaintenancePerformanceActions.failure());
  }
}
function* updateMaintenancePerformanceSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateMaintenancePerformanceActionsApi, other);

    yield put(updateMaintenancePerformanceActions.success());
    if (action?.payload?.handleSuccess) {
      action.payload.handleSuccess();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateMaintenancePerformanceActions.failure());
  }
}
function* deleteMaintenancePerformanceSaga(action) {
  try {
    yield call(deleteMaintenancePerformanceActionsApi, action.payload);

    yield put(deleteMaintenancePerformanceActions.success());
    if (action.payload.handleSuccess) {
      action.payload.handleSuccess();
    }
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteMaintenancePerformanceActions.failure());
  }
}
function* getDetailMaintenancePerformanceSaga(action) {
  try {
    const response = yield call(
      getDetailMaintenancePerformanceActionsApi,
      action.payload,
    );

    const { data } = response;
    yield put(getDetailMaintenancePerformance.success(data));
  } catch (e) {
    yield put(getDetailMaintenancePerformance.failure());
  }
}

export default function* MaintenancePerformanceSaga() {
  yield all([
    yield takeLatest(
      getListMaintenancePerformanceActions.request,
      getListMaintenancePerformanceSaga,
    ),
    yield takeLatest(
      createMaintenancePerformanceActions.request,
      createMaintenancePerformanceSaga,
    ),
    yield takeLatest(
      deleteMaintenancePerformanceActions.request,
      deleteMaintenancePerformanceSaga,
    ),
    yield takeLatest(
      getDetailMaintenancePerformance.request,
      getDetailMaintenancePerformanceSaga,
    ),
    yield takeLatest(
      updateMaintenancePerformanceActions.request,
      updateMaintenancePerformanceSaga,
    ),
  ]);
}
