import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselScreeningIncidentInvestigationActionsApi,
  updateVesselScreeningIncidentInvestigationActionsApi,
} from 'pages/vessel-screening/utils/api/common.api';
import {
  getListVesselScreeningIncidentInvestigationActions,
  updateVesselScreeningIncidentInvestigationActions,
} from './vessel-incident-investigation.action';

function* getListVesselIncidentInvestigationPerformanceSaga(action) {
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
      getListVesselScreeningIncidentInvestigationActionsApi,
      id,
      other,
    );
    const { data } = response;
    yield put(getListVesselScreeningIncidentInvestigationActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselScreeningIncidentInvestigationActions.failure());
  }
}

function* updateIncidentInvestigationPerformanceSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselScreeningIncidentInvestigationActionsApi, other);

    yield put(updateVesselScreeningIncidentInvestigationActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselScreeningIncidentInvestigationActions.failure(e));
  }
}

export default function* vesselIncidentInvestigationPerformanceSaga() {
  yield all([
    yield takeLatest(
      getListVesselScreeningIncidentInvestigationActions.request,
      getListVesselIncidentInvestigationPerformanceSaga,
    ),

    yield takeLatest(
      updateVesselScreeningIncidentInvestigationActions.request,
      updateIncidentInvestigationPerformanceSaga,
    ),
  ]);
}
