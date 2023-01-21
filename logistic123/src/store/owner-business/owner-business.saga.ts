import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { CreateOwnerBusinessParams } from 'models/api/owner-business/owner-business.model';

import { State } from '../reducer';
import {
  getOwnerBusinessDetailActions,
  getListOwnerBusiness,
  updateOwnerBusiness,
  deleteOwnerBusiness,
  createOwnerBusiness,
} from './owner-business.action';
import {
  getOwnerBusinessDetailActionsApi,
  getListOwnerBusinessApi,
  deleteOwnerBusinessApi,
  createOwnerBusinessApi,
  updateOwnerBusinessPermissionDetailActionsApi,
} from '../../api/owner-business.api';

function* getListOwnerBusinessSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListOwnerBusinessApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListOwnerBusiness.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListOwnerBusiness.failure());
  }
}

function* deleteOwnerBusinessSaga(action) {
  try {
    const { params, listOwnerBusiness } = yield select(
      (state: State) => state.ownerBusiness,
    );
    yield call(deleteOwnerBusinessApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listOwnerBusiness.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteOwnerBusiness.success(newParams));
    action.payload?.getListOwnerBusiness?.();
  } catch (e) {
    toastError(e);
    yield put(deleteOwnerBusiness.failure());
  }
}

function* createOwnerBusinessSaga(action) {
  try {
    const params: CreateOwnerBusinessParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createOwnerBusinessApi, params);
    yield put(createOwnerBusiness.success());
    yield put(getListOwnerBusiness.request({}));
    action.payload?.afterCreate?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createOwnerBusiness.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createOwnerBusiness.failure(undefined));
    }
  }
}

function* getOwnerBusinessDetailSaga(action) {
  try {
    const response = yield call(
      getOwnerBusinessDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getOwnerBusinessDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.OWNER_BUSINESS);
    }
    toastError(e);
    yield put(getOwnerBusinessDetailActions.failure());
  }
}

function* updateOwnerBusinessSaga(action) {
  try {
    yield call(updateOwnerBusinessPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate?.();
    yield put(updateOwnerBusiness.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateOwnerBusiness.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateOwnerBusiness.failure(undefined));
    }
  }
}

export default function* OwnerBusinessAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteOwnerBusiness.request, deleteOwnerBusinessSaga),
    yield takeLatest(getListOwnerBusiness.request, getListOwnerBusinessSaga),
    yield takeLatest(createOwnerBusiness.request, createOwnerBusinessSaga),
    yield takeLatest(
      getOwnerBusinessDetailActions.request,
      getOwnerBusinessDetailSaga,
    ),
    yield takeLatest(updateOwnerBusiness.request, updateOwnerBusinessSaga),
  ]);
}
