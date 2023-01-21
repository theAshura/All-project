import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselScreeningPortStateControlActionsApi,
  getPortStateRequestDetailApi,
  updateVesselScreeningPortStateControlActionsApi,
} from 'pages/vessel-screening/utils/api/common.api';
import {
  getListVesselScreeningPortStateControlActions,
  getVesselPortStateControlRequestDetailActions,
  updateVesselScreeningPortStateControlActions,
} from './vessel-port-state-control.action';

function* getListVesselPortStateControlPerformanceSaga(action) {
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
      getListVesselScreeningPortStateControlActionsApi,
      id,
      other,
    );
    const { data } = response;
    yield put(getListVesselScreeningPortStateControlActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningPortStateControlActions.failure());
  }
}

function* getPortStateRequestDetailSaga(action) {
  try {
    const response = yield call(getPortStateRequestDetailApi, action.payload);
    const { data } = response;
    yield put(getVesselPortStateControlRequestDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVesselPortStateControlRequestDetailActions.failure());
  }
}

function* updatePortStateControlPerformanceSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningPortStateControlActionsApi, other);

    yield put(updateVesselScreeningPortStateControlActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselScreeningPortStateControlActions.failure(e));
  }
}

export default function* vesselPortStateControlPerformanceSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningPortStateControlActions.request,
      getListVesselPortStateControlPerformanceSaga,
    ),

    yield takeLatest(
      updateVesselScreeningPortStateControlActions.request,
      updatePortStateControlPerformanceSaga,
    ),
    yield takeLatest(
      getVesselPortStateControlRequestDetailActions.request,
      getPortStateRequestDetailSaga,
    ),
  ]);
}
