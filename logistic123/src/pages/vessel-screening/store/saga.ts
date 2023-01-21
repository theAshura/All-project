import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createVesselScreeningActionsApi,
  getListVesselScreeningActionsApi,
  getVesselScreeningDetailActionsApi,
  updateVesselScreeningShipParticularActionsApi,
} from 'pages/vessel-screening/utils/api/common.api';
import {
  getListVesselScreeningActions,
  createVesselScreeningActions,
  getVesselScreeningDetailActions,
  updateVesselShipParticularActions,
} from 'pages/vessel-screening/store/action';

function* getListVesselScreeningSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListVesselScreeningActionsApi, other);
    handleSuccess?.();
    yield put(getListVesselScreeningActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningActions.failure());
  }
}

function* createVesselScreeningSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(createVesselScreeningActionsApi, params);
    handleSuccess?.();
    yield put(createVesselScreeningActions.success());
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e?.message);
      }
      yield put(createVesselScreeningActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createVesselScreeningActions.failure(undefined));
    }
  }
}

function* updateVesselScreeningShipParticularSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(updateVesselScreeningShipParticularActionsApi, params);
    yield put(updateVesselShipParticularActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateVesselShipParticularActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateVesselShipParticularActions.failure(undefined));
    }
  }
}

function* getVesselScreeningDetailSaga(action) {
  try {
    const response = yield call(
      getVesselScreeningDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getVesselScreeningDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVesselScreeningDetailActions.failure());
  }
}

export default function* VesselScreeningSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningActions.request,
      getListVesselScreeningSaga,
    ),
    yield takeLatest(
      createVesselScreeningActions.request,
      createVesselScreeningSaga,
    ),
    yield takeLatest(
      getVesselScreeningDetailActions.request,
      getVesselScreeningDetailSaga,
    ),
    yield takeLatest(
      updateVesselShipParticularActions.request,
      updateVesselScreeningShipParticularSaga,
    ),
  ]);
}
