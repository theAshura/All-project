import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';

import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  createPilotTerminalFeedbackActionsApi,
  getListPilotTerminalFeedbackActionsApi,
  getPilotTerminalFeedbackDetailActionsApi,
  updatePilotTerminalFeedbackDetailActionsApi,
  deletePilotTerminalFeedbackActionsApi,
  getNumberOfPilotFeedback,
  getPilotFeedbackStatus,
  getPilotFeedbackAverageScore,
} from '../utils/api/common.api';
import {
  getListPilotTerminalFeedbackActions,
  createPilotTerminalFeedbackActions,
  getPilotTerminalFeedbackDetailActions,
  updatePilotTerminalFeedbacksActions,
  deletePilotTerminalFeedbacksActions,
  getNumberOfPilotFeedbackActions,
  getPilotFeedbackStatusActions,
  getPilotFeedbackAverageScoreActions,
} from './action';

function* getListPilotTerminalFeedbackSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListPilotTerminalFeedbackActionsApi, other);
    handleSuccess?.();
    yield put(getListPilotTerminalFeedbackActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getListPilotTerminalFeedbackActions.failure());
  }
}

function* createPilotTerminalFeedbacksSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(createPilotTerminalFeedbackActionsApi, params);
    handleSuccess?.();
    yield put(createPilotTerminalFeedbackActions.success());
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createPilotTerminalFeedbackActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createPilotTerminalFeedbackActions.failure(undefined));
    }
  }
}

function* getPilotTerminalFeedbacksDetailSaga(action) {
  try {
    const response = yield call(
      getPilotTerminalFeedbackDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getPilotTerminalFeedbackDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getPilotTerminalFeedbackDetailActions.failure());
  }
}

function* updatePilotTerminalFeedbacksSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;

    yield call(updatePilotTerminalFeedbackDetailActionsApi, params);
    yield put(updatePilotTerminalFeedbacksActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updatePilotTerminalFeedbacksActions.failure(e));
    } else {
      toastError(e);
      yield put(updatePilotTerminalFeedbacksActions.failure(undefined));
    }
  }
}

function* deletePilotTerminalFeedbacksSaga(action) {
  try {
    const { params, listPilotTerminalFeedbackInvestigations } = yield select(
      (state: State) => state.incidentInvestigation,
    );
    yield call(deletePilotTerminalFeedbackActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPilotTerminalFeedbackInvestigations.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deletePilotTerminalFeedbacksActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deletePilotTerminalFeedbacksActions.failure());
  }
}

function* getNumberOfPilotFeedbackSaga(action) {
  try {
    const { fromDate, toDate } = action.payload;
    const response = yield call(getNumberOfPilotFeedback, { fromDate, toDate });
    const { data } = response;
    yield put(getNumberOfPilotFeedbackActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getNumberOfPilotFeedbackActions.failure());
  }
}

function* getPilotFeedbackStatusSaga(action) {
  try {
    const { fromDate, toDate } = action.payload;
    const response = yield call(getPilotFeedbackStatus, { fromDate, toDate });
    const { data } = response;
    yield put(getPilotFeedbackStatusActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getPilotFeedbackStatusActions.failure());
  }
}

function* getPilotFeedbackAverageScoreSaga(action) {
  try {
    const { fromDate, toDate } = action.payload;
    const response = yield call(getPilotFeedbackAverageScore, {
      fromDate,
      toDate,
    });
    const { data } = response;
    yield put(getPilotFeedbackAverageScoreActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getPilotFeedbackAverageScoreActions.failure());
  }
}

export default function* PilotTerminalFeedbacksSaga() {
  yield all([
    yield takeLatest(
      getListPilotTerminalFeedbackActions.request,
      getListPilotTerminalFeedbackSaga,
    ),
    yield takeLatest(
      createPilotTerminalFeedbackActions.request,
      createPilotTerminalFeedbacksSaga,
    ),
    yield takeLatest(
      getPilotTerminalFeedbackDetailActions.request,
      getPilotTerminalFeedbacksDetailSaga,
    ),
    yield takeLatest(
      updatePilotTerminalFeedbacksActions.request,
      updatePilotTerminalFeedbacksSaga,
    ),
    yield takeLatest(
      deletePilotTerminalFeedbacksActions.request,
      deletePilotTerminalFeedbacksSaga,
    ),
    yield takeLatest(
      getNumberOfPilotFeedbackActions.request,
      getNumberOfPilotFeedbackSaga,
    ),
    yield takeLatest(
      getPilotFeedbackStatusActions.request,
      getPilotFeedbackStatusSaga,
    ),
    yield takeLatest(
      getPilotFeedbackAverageScoreActions.request,
      getPilotFeedbackAverageScoreSaga,
    ),
  ]);
}
