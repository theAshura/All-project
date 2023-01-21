import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { CreateShipRankParams } from 'models/api/ship-rank/ship-rank.model';

import { State } from '../reducer';
import {
  getShipRankDetailActions,
  getListShipRankActions,
  updateShipRankActions,
  deleteShipRankActions,
  createShipRankActions,
} from './ship-rank.action';
import {
  getShipRankDetailActionsApi,
  getListShipRanksActionsApi,
  deleteShipRankActionsApi,
  createShipRankActionsApi,
  updateShipRankPermissionDetailActionsApi,
} from '../../api/ship-rank.api';

function* getListShipRanksSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListShipRanksActionsApi, other);
    const { data } = response;
    yield put(getListShipRankActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListShipRankActions.failure());
  }
}

function* deleteShipRanksSaga(action) {
  try {
    const { params, listShipRanks } = yield select(
      (state: State) => state.shipRank,
    );
    yield call(deleteShipRankActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listShipRanks.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteShipRankActions.success(newParams));
    action.payload?.getList();
  } catch (e) {
    toastError(e);
    yield put(deleteShipRankActions.failure());
  }
}

function* createShipRankSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: CreateShipRankParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createShipRankActionsApi, params);
    yield put(createShipRankActions.success());
    toastSuccess('You have created successfully');
    if (!isNew) {
      history.push(AppRouteConst.SHIP_RANK);
    } else {
      action.payload?.resetForm();
    }
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createShipRankActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createShipRankActions.failure(undefined));
    }
  }
}

function* getShipRankDetailSaga(action) {
  try {
    const response = yield call(getShipRankDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getShipRankDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SHIP_RANK);
    }
    toastError(e);
    yield put(getShipRankDetailActions.failure());
  }
}

function* updateShipRankSaga(action) {
  try {
    yield call(updateShipRankPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.SHIP_RANK);
    yield put(updateShipRankActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateShipRankActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateShipRankActions.failure(undefined));
    }
  }
}

export default function* ShipRankAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteShipRankActions.request, deleteShipRanksSaga),
    yield takeLatest(getListShipRankActions.request, getListShipRanksSaga),
    yield takeLatest(createShipRankActions.request, createShipRankSaga),
    yield takeLatest(getShipRankDetailActions.request, getShipRankDetailSaga),
    yield takeLatest(updateShipRankActions.request, updateShipRankSaga),
  ]);
}
