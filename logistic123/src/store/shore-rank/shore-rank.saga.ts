import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createShoreRankActionsApi,
  deleteShoreRankActionsApi,
  getDetailShoreRankActionApi,
  getListShoreRankActionsApi,
  updateShoreRankActionApi,
} from 'api/shore-rank.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { ShoreRank } from 'models/api/shore-rank/shore-rank.model';
import { State } from 'store/reducer';
import {
  createShoreRankActions,
  deleteShoreRankActions,
  getListShoreRankActions,
  getShoreRankDetailActions,
  updateShoreRankActions,
} from './shore-rank.action';

function* getListShoreRankSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListShoreRankActionsApi, other);
    const { data } = response;
    yield put(getListShoreRankActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListShoreRankActions.failure());
  }
}

function* deleteShoreRankSaga(action) {
  try {
    const { params, listShoreRank } = yield select(
      (state: State) => state.shoreRank,
    );
    yield call(deleteShoreRankActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listShoreRank.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteShoreRankActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.getListShoreRank();
  } catch (e) {
    toastError(e);
    yield put(deleteShoreRankActions.failure());
  }
}

function* createShoreRankSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: ShoreRank = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createShoreRankActionsApi, params);
    yield put(createShoreRankActions.success());
    if (!isNew) {
      history.push(AppRouteConst.SHORE_RANK);
    } else {
      action.payload?.resetForm();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createShoreRankActions.failure(e?.errorList || []));
  }
}

function* getShoreRankSaga(action) {
  try {
    const response = yield call(getDetailShoreRankActionApi, action.payload);
    const { data } = response;
    yield put(getShoreRankDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SHORE_RANK);
    }
    yield put(getShoreRankDetailActions.failure());
  }
}

function* updateShoreRankSaga(action) {
  try {
    yield call(
      updateShoreRankActionApi,
      action.payload?.id,
      action.payload?.body,
    );
    put(updateShoreRankActions.success());
    history.push(AppRouteConst.SHORE_RANK);
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateShoreRankActions.failure(e?.errorList || []));
  }
}

export default function* shoreRankSaga() {
  yield all([
    yield takeLatest(getListShoreRankActions.request, getListShoreRankSaga),
    yield takeLatest(deleteShoreRankActions.request, deleteShoreRankSaga),
    yield takeLatest(createShoreRankActions.request, createShoreRankSaga),
    yield takeLatest(getShoreRankDetailActions.request, getShoreRankSaga),
    yield takeLatest(updateShoreRankActions.request, updateShoreRankSaga),
  ]);
}
