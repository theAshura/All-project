import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getExternalInspectionRequestDetailApi,
  getListVesselScreeningExternalInspectionApi,
  getVesselScreeningExternalInspectionDetailApi,
  updateVesselScreeningExternalInspectionRequestApi,
} from '../utils/api/external-inspection.api';
import {
  getExternalInspectionRequestDetailActions,
  getListVesselScreeningExternalInspectionActions,
  getVesselScreeningExternalInspectionDetailActions,
  updateExternalInspectionRequestActions,
} from './vessel-external-inspection.action';

function* getListVesselScreeningExternalInspectionSaga(action) {
  try {
    const { isRefreshLoading, handleSuccess, ...other } = action.payload;

    const response = yield call(
      getListVesselScreeningExternalInspectionApi,
      other,
    );
    const { list, risk } = response.data;
    yield put(
      getListVesselScreeningExternalInspectionActions.success({
        ...list,
        risk,
      }),
    );
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningExternalInspectionActions.failure());
  }
}

function* getVesselScreeingExternalInspectionDetailSaga(action) {
  try {
    const response = yield call(
      getVesselScreeningExternalInspectionDetailApi,
      action.payload,
    );
    const { data } = response;
    yield put(getVesselScreeningExternalInspectionDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVesselScreeningExternalInspectionDetailActions.failure());
  }
}

function* getExternalInspectionRequestDetailSaga(action) {
  try {
    const response = yield call(
      getExternalInspectionRequestDetailApi,
      action.payload,
    );
    const { data } = response;
    yield put(getExternalInspectionRequestDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getExternalInspectionRequestDetailActions.failure());
  }
}

function* updateExternalInspectionRequestSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningExternalInspectionRequestApi, other);
    yield put(updateExternalInspectionRequestActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateExternalInspectionRequestActions.failure(e));
  }
}

export default function* VesselExternalInspectionSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningExternalInspectionActions.request,
      getListVesselScreeningExternalInspectionSaga,
    ),
    yield takeLatest(
      getVesselScreeningExternalInspectionDetailActions.request,
      getVesselScreeingExternalInspectionDetailSaga,
    ),
    yield takeLatest(
      updateExternalInspectionRequestActions.request,
      updateExternalInspectionRequestSaga,
    ),
    yield takeLatest(
      getExternalInspectionRequestDetailActions.request,
      getExternalInspectionRequestDetailSaga,
    ),
  ]);
}
