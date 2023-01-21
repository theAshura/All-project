import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { CreateShipDepartmentParams } from 'models/api/ship-department/ship-department.model';

import { State } from '../reducer';
import {
  getShipDepartmentDetailActions,
  getListShipDepartmentActions,
  updateShipDepartmentActions,
  deleteShipDepartmentActions,
  createShipDepartmentActions,
} from './ship-department.action';
import {
  getShipDepartmentDetailActionsApi,
  getListShipDepartmentsActionsApi,
  deleteShipDepartmentActionsApi,
  createShipDepartmentActionsApi,
  updateShipDepartmentPermissionDetailActionsApi,
} from '../../api/ship-department.api';

function* getListShipDepartmentsSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListShipDepartmentsActionsApi, other);
    const { data } = response;
    yield put(getListShipDepartmentActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListShipDepartmentActions.failure());
  }
}

function* deleteShipDepartmentsSaga(action) {
  try {
    const { params, listShipDepartments } = yield select(
      (state: State) => state.shipDepartment,
    );
    yield call(deleteShipDepartmentActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listShipDepartments.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteShipDepartmentActions.success(newParams));
    action.payload?.getListShipDepartment();
  } catch (e) {
    toastError(e);
    yield put(deleteShipDepartmentActions.failure());
  }
}

function* createShipDepartmentSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: CreateShipDepartmentParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createShipDepartmentActionsApi, params);
    yield put(createShipDepartmentActions.success());
    toastSuccess('You have created successfully');
    if (!isNew) {
      history.push(AppRouteConst.SHIP_DEPARTMENT);
    } else {
      action.payload?.resetForm();
    }
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createShipDepartmentActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createShipDepartmentActions.failure(undefined));
    }
  }
}

function* getShipDepartmentDetailSaga(action) {
  try {
    const response = yield call(
      getShipDepartmentDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getShipDepartmentDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SHIP_DEPARTMENT);
    }
    toastError(e);
    yield put(getShipDepartmentDetailActions.failure());
  }
}

function* updateShipDepartmentSaga(action) {
  try {
    yield call(updateShipDepartmentPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.SHIP_DEPARTMENT);
    yield put(updateShipDepartmentActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateShipDepartmentActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateShipDepartmentActions.failure(undefined));
    }
  }
}

export default function* ShipDepartmentAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteShipDepartmentActions.request,
      deleteShipDepartmentsSaga,
    ),
    yield takeLatest(
      getListShipDepartmentActions.request,
      getListShipDepartmentsSaga,
    ),
    yield takeLatest(
      createShipDepartmentActions.request,
      createShipDepartmentSaga,
    ),
    yield takeLatest(
      getShipDepartmentDetailActions.request,
      getShipDepartmentDetailSaga,
    ),
    yield takeLatest(
      updateShipDepartmentActions.request,
      updateShipDepartmentSaga,
    ),
  ]);
}
