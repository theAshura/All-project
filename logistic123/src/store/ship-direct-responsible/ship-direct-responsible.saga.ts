import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { CreateShipDirectResponsibleParams } from 'models/api/ship-direct-responsible/ship-direct-responsible.model';

import { State } from '../reducer';
import {
  getShipDirectResponsibleDetailActions,
  getListShipDirectResponsibleActions,
  updateShipDirectResponsibleActions,
  deleteShipDirectResponsibleActions,
  createShipDirectResponsibleActions,
} from './ship-direct-responsible.action';
import {
  getShipDirectResponsibleDetailActionsApi,
  getListShipDirectResponsiblesActionsApi,
  deleteShipDirectResponsibleActionsApi,
  createShipDirectResponsibleActionsApi,
  updateShipDirectResponsiblePermissionDetailActionsApi,
} from '../../api/ship-direct-responsible.api';

function* getListShipDirectResponsiblesSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListShipDirectResponsiblesActionsApi, other);
    const { data } = response;
    yield put(getListShipDirectResponsibleActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListShipDirectResponsibleActions.failure());
  }
}

function* deleteShipDirectResponsiblesSaga(action) {
  try {
    const { params, listShipDirectResponsibles } = yield select(
      (state: State) => state.shipDirectResponsible,
    );
    yield call(deleteShipDirectResponsibleActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listShipDirectResponsibles.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteShipDirectResponsibleActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.getListShipDirectResponsible();
  } catch (e) {
    toastError(e);
    yield put(deleteShipDirectResponsibleActions.failure());
  }
}

function* createShipDirectResponsibleSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: CreateShipDirectResponsibleParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createShipDirectResponsibleActionsApi, params);
    yield put(createShipDirectResponsibleActions.success());
    toastSuccess('You have created successfully');
    if (!isNew) {
      history.push(AppRouteConst.SHIP_DIRECT_RESPONSIBLE);
    } else {
      action.payload?.resetForm();
    }
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createShipDirectResponsibleActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createShipDirectResponsibleActions.failure(undefined));
    }
  }
}

function* getShipDirectResponsibleDetailSaga(action) {
  try {
    const response = yield call(
      getShipDirectResponsibleDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getShipDirectResponsibleDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SHIP_DIRECT_RESPONSIBLE);
    }
    toastError(e);
    yield put(getShipDirectResponsibleDetailActions.failure());
  }
}

function* updateShipDirectResponsibleSaga(action) {
  try {
    yield call(
      updateShipDirectResponsiblePermissionDetailActionsApi,
      action.payload,
    );
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.SHIP_DIRECT_RESPONSIBLE);
    yield put(updateShipDirectResponsibleActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateShipDirectResponsibleActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateShipDirectResponsibleActions.failure(undefined));
    }
  }
}

export default function* ShipDirectResponsibleAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteShipDirectResponsibleActions.request,
      deleteShipDirectResponsiblesSaga,
    ),
    yield takeLatest(
      getListShipDirectResponsibleActions.request,
      getListShipDirectResponsiblesSaga,
    ),
    yield takeLatest(
      createShipDirectResponsibleActions.request,
      createShipDirectResponsibleSaga,
    ),
    yield takeLatest(
      getShipDirectResponsibleDetailActions.request,
      getShipDirectResponsibleDetailSaga,
    ),
    yield takeLatest(
      updateShipDirectResponsibleActions.request,
      updateShipDirectResponsibleSaga,
    ),
  ]);
}
