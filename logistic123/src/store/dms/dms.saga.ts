import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { DMS } from 'models/api/dms/dms.model';
import {
  createDMSActionsApi,
  deleteDMSActionsApi,
  downloadFileApi,
  getDMSDetailActionsApi,
  getListDMSsActionsApi,
  getListFileApi,
  updateDMSActionsApi,
} from 'api/dms.api';
import { State } from '../reducer';
import {
  createDMSActions,
  deleteDMSActions,
  downloadFileActions,
  getDMSDetailActions,
  getListDMSActions,
  getListFileActions,
  updateDMSActions,
} from './dms.action';

function* getListDMSsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListDMSsActionsApi, other);
    const { data } = response;
    yield put(getListDMSActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListDMSActions.failure());
  }
}

function* deleteDMSsSaga(action) {
  try {
    const { params, listDMSs } = yield select((state: State) => state.dms);
    yield call(deleteDMSActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listDMSs.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteDMSActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.getListDMS();
  } catch (e) {
    toastError(e);
    yield put(deleteDMSActions.failure());
  }
}

function* createDMSSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: DMS = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createDMSActionsApi, params);
    yield put(createDMSActions.success());
    toastSuccess('You have created successfully');
    if (!isNew) {
      history.push(AppRouteConst.DMS);
    } else {
      action.payload?.resetForm();
    }
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createDMSActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createDMSActions.failure(undefined));
    }
  }
}

function* getDMSDetailSaga(action) {
  try {
    const response = yield call(getDMSDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getDMSDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.DMS);
    }
    toastError(e);
    yield put(getDMSDetailActions.failure());
  }
}

function* updateDMSSaga(action) {
  try {
    yield call(updateDMSActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.DMS);
    yield put(updateDMSActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateDMSActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateDMSActions.failure(undefined));
    }
  }
}

function* getListFileSaga(action) {
  try {
    const response = yield call(getListFileApi, action.payload);
    const { data } = response;
    yield put(getListFileActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListFileActions.failure());
  }
}

function* downloadFileSaga(action) {
  try {
    const response = yield call(downloadFileApi, action.payload);
    const { data } = response;
    yield put(getListFileActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListFileActions.failure());
  }
}

export default function* DMSSaga() {
  yield all([
    yield takeLatest(deleteDMSActions.request, deleteDMSsSaga),
    yield takeLatest(getListDMSActions.request, getListDMSsSaga),
    yield takeLatest(createDMSActions.request, createDMSSaga),
    yield takeLatest(getDMSDetailActions.request, getDMSDetailSaga),
    yield takeLatest(updateDMSActions.request, updateDMSSaga),
    yield takeLatest(getListFileActions.request, getListFileSaga),
    yield takeLatest(downloadFileActions.request, downloadFileSaga),
  ]);
}
