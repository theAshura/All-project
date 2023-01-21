import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  getListVesselSurveyClassInfoActionsApi,
  updateVesselSurveyClassInfoctionsApi,
} from 'pages/vessel-screening/utils/api/vessel-surveys-class-info.api';
import {
  getListVesselSurveysClassInfoActions,
  updateVesselSurveysClassInfoActions,
} from './vessel-surveys-class-info.action';

function* getListVesselSurveysClassInfoSaga(action) {
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
      getListVesselSurveyClassInfoActionsApi,
      id,
      other,
    );
    const { data } = response;
    yield put(getListVesselSurveysClassInfoActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListVesselSurveysClassInfoActions.failure());
  }
}

function* updateVesselSurveysClassInfoSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselSurveyClassInfoctionsApi, other);

    yield put(updateVesselSurveysClassInfoActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselSurveysClassInfoActions.failure(e));
  }
}

export default function* vesselSurveysClassInfoSaga() {
  yield all([
    yield takeLatest(
      getListVesselSurveysClassInfoActions.request,
      getListVesselSurveysClassInfoSaga,
    ),
    yield takeLatest(
      updateVesselSurveysClassInfoActions.request,
      updateVesselSurveysClassInfoSaga,
    ),
  ]);
}
