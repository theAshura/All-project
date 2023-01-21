import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { State } from '../reducer';
import {
  getVIQDetailActions,
  getListVIQActions,
  updateVIQActions,
  deleteVIQActions,
  createVIQActions,
  getListPotentialRiskActions,
} from './viq.action';
import {
  getVIQDetailActionsApi,
  getListVIQsActionsApi,
  getListPriorityActionsApi,
  deleteVIQActionsApi,
  createVIQActionsApi,
  updateVIQDetailActionsApi,
} from '../../api/viq.api';

function* getListVIQsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListVIQsActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListVIQActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListVIQActions.failure());
  }
}

function* getListPotentialRiskSaga() {
  try {
    const response = yield call(getListPriorityActionsApi);
    const { data } = response;
    yield put(getListPotentialRiskActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListPotentialRiskActions.failure());
  }
}

function* deleteVIQSaga(action) {
  try {
    const { params, listVIQs } = yield select((state: State) => state.viq);
    yield call(deleteVIQActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listVIQs.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteVIQActions.success(newParams));
    action?.payload?.afterDelete();
  } catch (e) {
    toastError(e);
    yield put(deleteVIQActions.failure());
  }
}

// CREATE
function* createVIQSaga(action) {
  try {
    const { getDetail, afterCreate, isNew, ...other } = action.payload;
    const response = yield call(createVIQActionsApi, other);
    const { data } = response;
    toastSuccess('You have created successfully');
    yield put(createVIQActions.success(data));
    if (!isNew) {
      history.push(`${AppRouteConst.VIQ}`);
    } else {
      action.payload?.resetForm();
    }
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 400) {
      yield put(createVIQActions.failure(e?.errorList));
    } else {
      yield put(createVIQActions.failure(undefined));
    }
  }
}

// DETAIL
function* getVIQDetailSaga(action) {
  try {
    const response = yield call(getVIQDetailActionsApi, action.payload);
    const { data } = response;
    yield put(getVIQDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.VIQ);
    }
    toastError(e);
    yield put(getVIQDetailActions.failure());
  }
}

// UPDATE

function* updateVIQSaga(action) {
  try {
    yield call(updateVIQDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.VIQ);
    yield put(updateVIQActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateVIQActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateVIQActions.failure(undefined));
    }
  }
}
export default function* VIQAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteVIQActions.request, deleteVIQSaga),

    yield takeLatest(getListVIQActions.request, getListVIQsSaga),

    yield takeLatest(createVIQActions.request, createVIQSaga),

    yield takeLatest(getVIQDetailActions.request, getVIQDetailSaga),

    yield takeLatest(updateVIQActions.request, updateVIQSaga),

    yield takeLatest(
      getListPotentialRiskActions.request,
      getListPotentialRiskSaga,
    ),
  ]);
}
