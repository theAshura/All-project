import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { State } from '../reducer';
import {
  getCharterOwnerDetailActions,
  getListCharterOwnerActions,
  updateCharterOwnerActions,
  deleteCharterOwnerActions,
  createCharterOwnerActions,
} from './charter-owner.action';
import {
  getCharterOwnerDetailActionsApi,
  getListCharterOwnersActionsApi,
  deleteCharterOwnerActionsApi,
  createCharterOwnerActionsApi,
  updateCharterOwnerPermissionDetailActionsApi,
} from '../../api/charter-owner.api';

function* getListCharterOwnersSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListCharterOwnersActionsApi, other);
    const { data } = response;
    yield put(getListCharterOwnerActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListCharterOwnerActions.failure());
  }
}

function* deleteCharterOwnersSaga(action) {
  try {
    const { params, listCharterOwners } = yield select(
      (state: State) => state.charterOwner,
    );
    yield call(deleteCharterOwnerActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCharterOwners.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteCharterOwnerActions.success(newParams));
    action.payload?.getListCharterOwner();
  } catch (e) {
    toastError(e);
    yield put(deleteCharterOwnerActions.failure());
  }
}

function* createCharterOwnerSaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createCharterOwnerActionsApi, other);
    yield put(createCharterOwnerActions.success());
    yield put(getListCharterOwnerActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createCharterOwnerActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createCharterOwnerActions.failure(undefined));
    }
  }
}

function* getCharterOwnerDetailSaga(action) {
  try {
    const response = yield call(
      getCharterOwnerDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getCharterOwnerDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.CHARTER_OWNER);
    }
    toastError(e);
    yield put(getCharterOwnerDetailActions.failure());
  }
}

function* updateCharterOwnerSaga(action) {
  try {
    yield call(updateCharterOwnerPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.CHARTER_OWNER);
    action.payload?.afterUpdate();
    yield put(updateCharterOwnerActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateCharterOwnerActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateCharterOwnerActions.failure(undefined));
    }
  }
}

export default function* CharterOwnerAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteCharterOwnerActions.request,
      deleteCharterOwnersSaga,
    ),
    yield takeLatest(
      getListCharterOwnerActions.request,
      getListCharterOwnersSaga,
    ),
    yield takeLatest(createCharterOwnerActions.request, createCharterOwnerSaga),
    yield takeLatest(
      getCharterOwnerDetailActions.request,
      getCharterOwnerDetailSaga,
    ),
    yield takeLatest(updateCharterOwnerActions.request, updateCharterOwnerSaga),
  ]);
}
