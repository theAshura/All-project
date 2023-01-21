import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getInjuriesSafetyRequestDetailActions,
  getListVesselScreeningInjuriesSafetyActions,
  updateInjuriesSafetyRequestActions,
} from './vessel-injuries-safety.action';
import {
  getInjuriesSafetyRequestDetailApi,
  getListVesselScreeningInjuriesSafetyApi,
  updateVesselScreeningInjuriesSafetyRequestApi,
} from '../utils/api/injuries-safety.api';

function* getListVesselScreeningInjuriesSafetySaga(action) {
  try {
    const { isRefreshLoading, handleSuccess, ...other } = action.payload;

    const response = yield call(getListVesselScreeningInjuriesSafetyApi, other);
    const { list, risk } = response.data;
    yield put(
      getListVesselScreeningInjuriesSafetyActions.success({
        ...list,
        risk,
      }),
    );
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningInjuriesSafetyActions.failure());
  }
}

function* getInjuriesSafetyRequestDetailSaga(action) {
  try {
    const response = yield call(
      getInjuriesSafetyRequestDetailApi,
      action.payload,
    );
    const { data } = response;
    yield put(getInjuriesSafetyRequestDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getInjuriesSafetyRequestDetailActions.failure());
  }
}

function* updateInjuriesSafetyRequestSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningInjuriesSafetyRequestApi, other);
    yield put(updateInjuriesSafetyRequestActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateInjuriesSafetyRequestActions.failure(e));
  }
}

export default function* VesselInjuriesSafetySaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningInjuriesSafetyActions.request,
      getListVesselScreeningInjuriesSafetySaga,
    ),
    yield takeLatest(
      updateInjuriesSafetyRequestActions.request,
      updateInjuriesSafetyRequestSaga,
    ),
    yield takeLatest(
      getInjuriesSafetyRequestDetailActions.request,
      getInjuriesSafetyRequestDetailSaga,
    ),
  ]);
}
