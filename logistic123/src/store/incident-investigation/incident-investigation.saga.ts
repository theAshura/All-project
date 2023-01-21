import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getIncidentInvestigationDetailActionsApi,
  getListIncidentInvestigationActionsApi,
  deleteIncidentInvestigationActionsApi,
  createIncidentInvestigationActionsApi,
  updateIncidentInvestigationDetailActionsApi,
} from 'api/incident-investigation.api';
import { State } from '../reducer';

import {
  getIncidentInvestigationDetailActions,
  getListIncidentInvestigationActions,
  updateIncidentInvestigationActions,
  deleteIncidentInvestigationActions,
  createIncidentInvestigationActions,
} from './incident-investigation.action';

function* getListIncidentInvestigationsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListIncidentInvestigationActionsApi, other);
    const { data } = response;
    yield put(getListIncidentInvestigationActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListIncidentInvestigationActions.failure());
  }
}

function* deleteIncidentInvestigationsSaga(action) {
  try {
    const { params, listIncidentInvestigations } = yield select(
      (state: State) => state.incidentInvestigation,
    );
    yield call(deleteIncidentInvestigationActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listIncidentInvestigations.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteIncidentInvestigationActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteIncidentInvestigationActions.failure());
  }
}

function* createIncidentInvestigationSaga(action) {
  try {
    const { isNew, handleSuccess, ...params } = action.payload;

    yield call(createIncidentInvestigationActionsApi, params);
    yield put(createIncidentInvestigationActions.success());
    yield put(getListIncidentInvestigationActions.request({}));
    handleSuccess?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createIncidentInvestigationActions.failure(e));
    } else {
      toastError(e);
      yield put(createIncidentInvestigationActions.failure(undefined));
    }
  }
}

function* getIncidentInvestigationDetailSaga(action) {
  try {
    const response = yield call(
      getIncidentInvestigationDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getIncidentInvestigationDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getIncidentInvestigationDetailActions.failure());
  }
}

function* updateIncidentInvestigationSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;

    yield call(updateIncidentInvestigationDetailActionsApi, params);
    put(updateIncidentInvestigationActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateIncidentInvestigationActions.failure(e));
    } else {
      toastError(e);
      yield put(updateIncidentInvestigationActions.failure(undefined));
    }
  }
}

export default function* IncidentInvestigationSaga() {
  yield all([
    yield takeLatest(
      deleteIncidentInvestigationActions.request,
      deleteIncidentInvestigationsSaga,
    ),
    yield takeLatest(
      getListIncidentInvestigationActions.request,
      getListIncidentInvestigationsSaga,
    ),
    yield takeLatest(
      createIncidentInvestigationActions.request,
      createIncidentInvestigationSaga,
    ),
    yield takeLatest(
      getIncidentInvestigationDetailActions.request,
      getIncidentInvestigationDetailSaga,
    ),
    yield takeLatest(
      updateIncidentInvestigationActions.request,
      updateIncidentInvestigationSaga,
    ),
  ]);
}
