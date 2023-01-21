import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import {
  getCDIDetailActionsApi,
  getListCDIsActionsApi,
  deleteCDIActionsApi,
  createCDIActionsApi,
  updateCDIPermissionDetailActionsApi,
} from 'api/cdi.api';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { State } from 'store/reducer';
import {
  getCDIDetailActions,
  getListCDIActions,
  updateCDIActions,
  deleteCDIActions,
  createCDIActions,
} from './cdi.action';

function* getListCDIsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListCDIsActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListCDIActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCDIActions.failure());
  }
}

function* deleteCDIsSaga(action) {
  try {
    const { params, listCDIs } = yield select((state: State) => state.cdi);
    yield call(deleteCDIActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCDIs.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteCDIActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListCDI();
  } catch (e) {
    toastError(e);
    yield put(deleteCDIActions.failure());
  }
}

function* createCDISaga(action) {
  try {
    const { isNew, resetForm, ...params } = action.payload;
    yield call(createCDIActionsApi, params);
    yield put(createCDIActions.success());
    toastSuccess('You have created successfully');
    action.payload?.afterCreate();
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createCDIActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createCDIActions.failure(undefined));
    }
  }
}

function* getCDIDetailSaga(action) {
  try {
    const response = yield call(getCDIDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getCDIDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.CDI);
    }
    toastError(e);
    yield put(getCDIDetailActions.failure());
  }
}

function* updateCDISaga(action) {
  try {
    yield call(updateCDIPermissionDetailActionsApi, action.payload);
    yield put(updateCDIActions.success());
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateCDIActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateCDIActions.failure(undefined));
    }
  }
}

export default function* CDIAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteCDIActions.request, deleteCDIsSaga),
    yield takeLatest(getListCDIActions.request, getListCDIsSaga),
    yield takeLatest(createCDIActions.request, createCDISaga),
    yield takeLatest(getCDIDetailActions.request, getCDIDetailSaga),
    yield takeLatest(updateCDIActions.request, updateCDISaga),
  ]);
}
