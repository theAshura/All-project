import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import {
  getSailReportingGeneralReportActionsApi,
  getSailReportingLatestRecordsUpdateActionsApi,
  getSailReportingPendingActionsApi,
} from 'api/summary-sail-reporting.api';
import { toastError } from 'helpers/notification.helper';
import {
  getSailReportingGeneralReportActions,
  getSailReportingLatestRecordsUpdateActions,
  getSailReportingPendingActions,
} from './summary-sail-reporting.action';

function* getSailReportingGeneralReportSaga(action) {
  try {
    const response = yield call(
      getSailReportingGeneralReportActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSailReportingGeneralReportActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSailReportingGeneralReportActions.failure());
  }
}

function* getSailReportingLatestRecordsUpdateSaga(action) {
  try {
    const response = yield call(
      getSailReportingLatestRecordsUpdateActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSailReportingLatestRecordsUpdateActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSailReportingLatestRecordsUpdateActions.failure());
  }
}

function* getSailReportingPendingActionSaga(action) {
  try {
    const response = yield call(
      getSailReportingPendingActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSailReportingPendingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSailReportingPendingActions.failure());
  }
}

export default function* SailReportingSummarySaga() {
  yield all([
    yield takeLatest(
      getSailReportingGeneralReportActions.request,
      getSailReportingGeneralReportSaga,
    ),
    yield takeLatest(
      getSailReportingLatestRecordsUpdateActions.request,
      getSailReportingLatestRecordsUpdateSaga,
    ),
    yield takeLatest(
      getSailReportingPendingActions.request,
      getSailReportingPendingActionSaga,
    ),
  ]);
}
