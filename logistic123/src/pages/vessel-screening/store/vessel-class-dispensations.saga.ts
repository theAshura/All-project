import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselClassDispensationsApi,
  updateVesselClassDispensationsApi,
} from 'pages/vessel-screening/utils/api/vessel-class-dispensations.api';
import {
  getListVesselClassDispensationsActions,
  updateVesselClassDispensationsActions,
} from './vessel-class-dispensations.action';

function* getListVesselClassDispensationsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      id,
      ...other
    } = action.payload;

    const response = yield call(getListVesselClassDispensationsApi, id, other);
    const { data } = response;
    yield put(getListVesselClassDispensationsActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselClassDispensationsActions.failure());
  }
}

function* updateVesselClassDispensationsSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselClassDispensationsApi, other);

    yield put(updateVesselClassDispensationsActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselClassDispensationsActions.failure(e));
  }
}

export default function* vesselClassDispensationsSaga() {
  yield all([
    yield takeLatest(
      getListVesselClassDispensationsActions.request,
      getListVesselClassDispensationsSaga,
    ),
    yield takeLatest(
      updateVesselClassDispensationsActions.request,
      updateVesselClassDispensationsSaga,
    ),
  ]);
}
