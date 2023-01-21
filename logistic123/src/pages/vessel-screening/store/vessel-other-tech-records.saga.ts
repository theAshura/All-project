import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselScreeningOtherTechRecordsActionsApi,
  updateVesselScreeningOtherTechRecordsActionsApi,
} from 'pages/vessel-screening/utils/api/common.api';
import {
  getListVesselScreeningOtherTechRecordsActions,
  updateVesselScreeningOtherTechRecordsActions,
} from './vessel-other-tech-records.action';

function* getListVesselOtherTechRecordsSaga(action) {
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
      getListVesselScreeningOtherTechRecordsActionsApi,
      id,
      other,
    );
    const { data } = response;
    yield put(getListVesselScreeningOtherTechRecordsActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningOtherTechRecordsActions.failure());
  }
}

function* updateOtherTechRecordsSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningOtherTechRecordsActionsApi, other);

    yield put(updateVesselScreeningOtherTechRecordsActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselScreeningOtherTechRecordsActions.failure(e));
  }
}

export default function* vesselOtherTechRecordsPerformanceSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningOtherTechRecordsActions.request,
      getListVesselOtherTechRecordsSaga,
    ),

    yield takeLatest(
      updateVesselScreeningOtherTechRecordsActions.request,
      updateOtherTechRecordsSaga,
    ),
  ]);
}
