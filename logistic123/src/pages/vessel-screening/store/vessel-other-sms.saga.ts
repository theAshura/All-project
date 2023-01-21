import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getOtherSMSRequestDetailActions,
  getListVesselScreeningOtherSMSActions,
  updateOtherSMSRequestActions,
} from './vessel-other-sms.action';
import {
  getOtherSMSRequestDetailApi,
  getListVesselScreeningOtherSMSApi,
  updateVesselScreeningOtherSMSRequestApi,
} from '../utils/api/other-sms.api';

function* getListVesselScreeningOtherSMSSaga(action) {
  try {
    const { isRefreshLoading, handleSuccess, ...other } = action.payload;

    const response = yield call(getListVesselScreeningOtherSMSApi, other);
    const { list, risk } = response.data;
    yield put(
      getListVesselScreeningOtherSMSActions.success({
        ...list,
        risk,
      }),
    );
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningOtherSMSActions.failure());
  }
}

function* getOtherSMSRequestDetailSaga(action) {
  try {
    const response = yield call(getOtherSMSRequestDetailApi, action.payload);
    const { data } = response;
    yield put(getOtherSMSRequestDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getOtherSMSRequestDetailActions.failure());
  }
}

function* updateOtherSMSRequestSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningOtherSMSRequestApi, other);
    yield put(updateOtherSMSRequestActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateOtherSMSRequestActions.failure(e));
  }
}

export default function* VesselOtherSMSSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningOtherSMSActions.request,
      getListVesselScreeningOtherSMSSaga,
    ),
    yield takeLatest(
      updateOtherSMSRequestActions.request,
      updateOtherSMSRequestSaga,
    ),
    yield takeLatest(
      getOtherSMSRequestDetailActions.request,
      getOtherSMSRequestDetailSaga,
    ),
  ]);
}
