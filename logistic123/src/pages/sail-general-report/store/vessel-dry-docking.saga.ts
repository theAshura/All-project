import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselScreeningDryDockingActionsApi,
  updateVesselScreeningDryDockingActionsApi,
} from 'pages/vessel-screening/utils/api/common.api';
import {
  getListVesselScreeningDryDockingActions,
  updateVesselScreeningDryDockingActions,
} from './vessel-dry-docking.action';

function* getListVesselDryDockingPerformanceSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      id,
      ...other
    } = action.payload;

    const response = yield call(
      getListVesselScreeningDryDockingActionsApi,
      id,
      other,
    );
    const { data } = response;
    yield put(getListVesselScreeningDryDockingActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningDryDockingActions.failure());
  }
}

function* updateDryDockingPerformanceSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningDryDockingActionsApi, other);

    yield put(updateVesselScreeningDryDockingActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselScreeningDryDockingActions.failure(e));
  }
}

export default function* vesselDryDockingPerformanceSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningDryDockingActions.request,
      getListVesselDryDockingPerformanceSaga,
    ),

    yield takeLatest(
      updateVesselScreeningDryDockingActions.request,
      updateDryDockingPerformanceSaga,
    ),
  ]);
}
