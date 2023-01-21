import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselScreeningMaintenanceActionsApi,
  updateVesselScreeningMaintenanceActionsApi,
} from 'pages/vessel-screening/utils/api/common.api';
import {
  getListVesselScreeningMaintenanceActions,
  updateVesselScreeningMaintenanceActions,
} from './vessel-maintenance-performance.action';

function* getListVesselMaintenancePerformanceSaga(action) {
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
      getListVesselScreeningMaintenanceActionsApi,
      id,
      other,
    );
    const { data } = response;
    yield put(getListVesselScreeningMaintenanceActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningMaintenanceActions.failure());
  }
}

function* updateMaintenancePerformanceSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningMaintenanceActionsApi, other);

    yield put(updateVesselScreeningMaintenanceActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselScreeningMaintenanceActions.failure(e));
  }
}

export default function* vesselMaintenancePerformanceSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningMaintenanceActions.request,
      getListVesselMaintenancePerformanceSaga,
    ),

    yield takeLatest(
      updateVesselScreeningMaintenanceActions.request,
      updateMaintenancePerformanceSaga,
    ),
  ]);
}
