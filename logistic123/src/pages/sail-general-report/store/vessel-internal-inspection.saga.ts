import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getListVesselScreeningInternalInspectionApi,
  getVesselScreeningInternalInspectionDetailApi,
  updateInternalInspectionRequestApi,
  getInternalInspectionRequestDetailApi,
} from '../utils/api/internal-inspection.api';
import {
  getListVesselScreeningInternalInspectionActions,
  getVesselScreeningInternalInspectionDetailActions,
  updateInternalInspectionRequestActions,
  getInternalInspectionRequestDetailActions,
} from './vessel-internal-inspection.action';

function* getListVesselScreeningInternalInspectionSaga(action) {
  try {
    const { isRefreshLoading, handleSuccess, ...other } = action.payload;

    const response = yield call(
      getListVesselScreeningInternalInspectionApi,
      other,
    );
    const { list, risk } = response.data;
    yield put(
      getListVesselScreeningInternalInspectionActions.success({
        ...list,
        risk,
      }),
    );
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningInternalInspectionActions.failure());
  }
}

function* getVesselScreeingInternalInspectionDetailSaga(action) {
  try {
    const response = yield call(
      getVesselScreeningInternalInspectionDetailApi,
      action.payload,
    );
    const { data } = response;
    yield put(getVesselScreeningInternalInspectionDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVesselScreeningInternalInspectionDetailActions.failure());
  }
}

function* getInternalInspectionRequestDetailSaga(action) {
  try {
    const response = yield call(
      getInternalInspectionRequestDetailApi,
      action.payload,
    );
    const { data } = response;
    yield put(getInternalInspectionRequestDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getInternalInspectionRequestDetailActions.failure());
  }
}

function* updateInternalInspectionRequestSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateInternalInspectionRequestApi, other);

    yield put(updateInternalInspectionRequestActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateInternalInspectionRequestActions.failure(e));
  }
}

export default function* VesselInternalInspectionSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningInternalInspectionActions.request,
      getListVesselScreeningInternalInspectionSaga,
    ),
    yield takeLatest(
      getVesselScreeningInternalInspectionDetailActions.request,
      getVesselScreeingInternalInspectionDetailSaga,
    ),
    yield takeLatest(
      updateInternalInspectionRequestActions.request,
      updateInternalInspectionRequestSaga,
    ),
    yield takeLatest(
      getInternalInspectionRequestDetailActions.request,
      getInternalInspectionRequestDetailSaga,
    ),
  ]);
}
