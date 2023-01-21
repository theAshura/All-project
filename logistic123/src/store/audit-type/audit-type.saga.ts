import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { State } from '../reducer';

import {
  getAuditTypeDetailActions,
  getListAuditTypeActions,
  updateAuditTypeActions,
  deleteAuditTypeActions,
  createAuditTypeActions,
} from './audit-type.action';
import {
  getAuditTypeDetailActionsApi,
  getListAuditTypesActionsApi,
  deleteAuditTypeActionsApi,
  createAuditTypeActionsApi,
  updateAuditTypePermissionDetailActionsApi,
} from '../../api/audit-type.api';

function* getListAuditTypesSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListAuditTypesActionsApi, other);
    const { data } = response;
    yield put(getListAuditTypeActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListAuditTypeActions.failure());
  }
}

function* deleteAuditTypesSaga(action) {
  try {
    const { params, listAuditTypes } = yield select(
      (state: State) => state.auditType,
    );
    yield call(deleteAuditTypeActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listAuditTypes.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteAuditTypeActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListAuditType();
  } catch (e) {
    toastError(e);
    yield put(deleteAuditTypeActions.failure());
  }
}

function* createAuditTypeSaga(action) {
  try {
    const { isNew, resetForm, ...params } = action.payload;

    yield call(createAuditTypeActionsApi, params);
    yield put(createAuditTypeActions.success());
    yield put(getListAuditTypeActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createAuditTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createAuditTypeActions.failure(undefined));
    }
  }
}

function* getAuditTypeDetailSaga(action) {
  try {
    const response = yield call(getAuditTypeDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getAuditTypeDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TYPE);
    }
    toastError(e);
    yield put(getAuditTypeDetailActions.failure());
  }
}

function* updateAuditTypeSaga(action) {
  try {
    yield call(updateAuditTypePermissionDetailActionsApi, action.payload);
    put(updateAuditTypeActions.success());
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateAuditTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateAuditTypeActions.failure(undefined));
    }
  }
}

export default function* AuditTypeAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteAuditTypeActions.request, deleteAuditTypesSaga),
    yield takeLatest(getListAuditTypeActions.request, getListAuditTypesSaga),
    yield takeLatest(createAuditTypeActions.request, createAuditTypeSaga),
    yield takeLatest(getAuditTypeDetailActions.request, getAuditTypeDetailSaga),
    yield takeLatest(updateAuditTypeActions.request, updateAuditTypeSaga),
  ]);
}
