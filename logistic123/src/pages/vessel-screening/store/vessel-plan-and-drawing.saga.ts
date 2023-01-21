import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselScreeningPlanAndDrawingApi,
  updatePlanAndDrawingsRequestApi,
} from 'pages/vessel-screening/utils/api/plan-and-drawing.api';

import {
  getListVesselPlanAndDrawingActions,
  updateVesselPlanAndDrawingsActions,
} from './vessel-plan-and-drawing.action';

function* getListVesselPlanAndDrawingsSaga(action) {
  try {
    const { isRefreshLoading, handleSuccess, ...other } = action.payload;
    const response = yield call(getListVesselScreeningPlanAndDrawingApi, other);
    const { list, risk } = response.data;
    yield put(
      getListVesselPlanAndDrawingActions.success({
        ...list,
        risk,
      }),
    );
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselPlanAndDrawingActions.failure());
  }
}

function* updateVesselPlanAndDrawingsSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updatePlanAndDrawingsRequestApi, other);
    yield put(updateVesselPlanAndDrawingsActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselPlanAndDrawingsActions.failure(e));
  }
}

export default function* vesselPlanAndDrawingsSaga() {
  yield all([
    yield takeLatest(
      getListVesselPlanAndDrawingActions.request,
      getListVesselPlanAndDrawingsSaga,
    ),
    yield takeLatest(
      updateVesselPlanAndDrawingsActions.request,
      updateVesselPlanAndDrawingsSaga,
    ),
  ]);
}
