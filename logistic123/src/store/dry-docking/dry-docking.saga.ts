import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createDryDockingActionsApi,
  deleteDryDockingActionsApi,
  getDetailDryDockingActionsApi,
  getListDryDockingActionsApi,
  updateDryDockingActionsApi,
} from 'api/dry-docking.api';
import {
  createDryDockingActions,
  deleteDryDockingActions,
  getDetailDryDocking,
  getLisDryDockingActions,
  updateDryDockingActions,
} from './dry-docking.action';

function* getListDryDockingSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListDryDockingActionsApi, other);
    const { data } = response;
    yield put(getLisDryDockingActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e?.message);
    yield put(getLisDryDockingActions.failure());
  }
}
function* createDryDockingSaga(action) {
  try {
    const response = yield call(createDryDockingActionsApi, action.payload);

    yield put(createDryDockingActions.success());
    if (action.payload.afterCreate) {
      action.payload.afterCreate();
    }
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message);
    yield put(createDryDockingActions.failure());
  }
}
function* updateDryDockingSaga(action) {
  try {
    const response = yield call(updateDryDockingActionsApi, action.payload);

    yield put(updateDryDockingActions.success());
    if (action.payload.afterUpdate) {
      action.payload.afterUpdate();
    }
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message);
    yield put(updateDryDockingActions.failure());
  }
}
function* deleteDryDockingSaga(action) {
  try {
    const response = yield call(deleteDryDockingActionsApi, action.payload);

    yield put(deleteDryDockingActions.success());
    if (action.payload.afterDelete) {
      action.payload.afterDelete();
    }
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message);
    yield put(deleteDryDockingActions.failure());
  }
}
function* getDetailDryDockingSaga(action) {
  try {
    const response = yield call(getDetailDryDockingActionsApi, action.payload);

    const { data } = response;
    yield put(getDetailDryDocking.success(data));
  } catch (e) {
    yield put(getDetailDryDocking.failure());
  }
}

export default function* DryDockingSaga() {
  yield all([
    yield takeLatest(getLisDryDockingActions.request, getListDryDockingSaga),
    yield takeLatest(createDryDockingActions.request, createDryDockingSaga),
    yield takeLatest(deleteDryDockingActions.request, deleteDryDockingSaga),
    yield takeLatest(getDetailDryDocking.request, getDetailDryDockingSaga),
    yield takeLatest(updateDryDockingActions.request, updateDryDockingSaga),
  ]);
}
