import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';

import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  createIncidentActionsApi,
  getListIncidentActionsApi,
  getIncidentDetailActionsApi,
  updateIncidentDetailActionsApi,
  deleteIncidentActionsApi,
  getIncidentPlaceActionsApi,
  getNumberIncidentActionsApi,
  getTypeOfIncidentActionsApi,
  getReviewStatusActionsApi,
  getRiskDetailActionsApi,
} from '../utils/api/common.api';
import {
  getListIncidentActions,
  createIncidentActions,
  getIncidentDetailActions,
  updateIncidentsActions,
  deleteIncidentsActions,
  getIncidentPlaceActions,
  getNumberIncidentsActions,
  getTypeOfIncidentActions,
  getReviewStatusActions,
  getRiskDetailsActions,
} from './action';

function* getListIncidentsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListIncidentActionsApi, other);
    handleSuccess?.();
    yield put(getListIncidentActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getListIncidentActions.failure());
  }
}

function* createIncidentsSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(createIncidentActionsApi, params);
    handleSuccess?.();
    yield put(createIncidentActions.success());
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createIncidentActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createIncidentActions.failure(undefined));
    }
  }
}

function* getIncidentsDetailSaga(action) {
  try {
    const response = yield call(getIncidentDetailActionsApi, action.payload);
    const { data } = response;
    yield put(getIncidentDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getIncidentDetailActions.failure());
  }
}

function* updateIncidentsSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;

    yield call(updateIncidentDetailActionsApi, params);
    yield put(updateIncidentsActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateIncidentsActions.failure(e));
    } else {
      toastError(e);
      yield put(updateIncidentsActions.failure(undefined));
    }
  }
}

function* deleteIncidentsSaga(action) {
  try {
    const { params, listIncidentInvestigations } = yield select(
      (state: State) => state.incidentInvestigation,
    );
    yield call(deleteIncidentActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listIncidentInvestigations.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteIncidentsActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteIncidentsActions.failure());
  }
}

// summary

function* getNumberIncidentSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getNumberIncidentActionsApi, other);
    handleSuccess?.();
    yield put(getNumberIncidentsActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getNumberIncidentsActions.failure());
  }
}

function* getIncidentPlaceSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getIncidentPlaceActionsApi, other);
    handleSuccess?.();
    yield put(getIncidentPlaceActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getIncidentPlaceActions.failure());
  }
}

function* getTypeOfIncidentSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getTypeOfIncidentActionsApi, other);
    handleSuccess?.();
    yield put(getTypeOfIncidentActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getTypeOfIncidentActions.failure());
  }
}

function* getReviewStatusSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getReviewStatusActionsApi, other);
    handleSuccess?.();
    yield put(getReviewStatusActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getReviewStatusActions.failure());
  }
}

function* getRiskDetailsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getRiskDetailActionsApi, other);
    handleSuccess?.();
    yield put(getRiskDetailsActions.success(response?.data));
  } catch (e) {
    toastError(e);
    yield put(getRiskDetailsActions.failure());
  }
}

export default function* IncidentsSaga() {
  yield all([
    yield takeLatest(getListIncidentActions.request, getListIncidentsSaga),
    yield takeLatest(createIncidentActions.request, createIncidentsSaga),
    yield takeLatest(getIncidentDetailActions.request, getIncidentsDetailSaga),
    yield takeLatest(updateIncidentsActions.request, updateIncidentsSaga),
    yield takeLatest(deleteIncidentsActions.request, deleteIncidentsSaga),
    yield takeLatest(getNumberIncidentsActions.request, getNumberIncidentSaga),
    yield takeLatest(getIncidentPlaceActions.request, getIncidentPlaceSaga),
    yield takeLatest(getTypeOfIncidentActions.request, getTypeOfIncidentSaga),
    yield takeLatest(getReviewStatusActions.request, getReviewStatusSaga),
    yield takeLatest(getRiskDetailsActions.request, getRiskDetailsSaga),
  ]);
}
