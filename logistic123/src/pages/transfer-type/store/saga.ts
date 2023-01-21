import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import { State } from 'store/reducer';
import { TransferType } from '../utils/model';
import {
  getTransferTypeDetailActionsApi,
  getListTransferTypesActionsApi,
  deleteTransferTypeActionsApi,
  createTransferTypeActionsApi,
  updateTransferTypePermissionDetailActionsApi,
} from '../utils/api';
import {
  getTransferTypeDetailActions,
  getListTransferTypeActions,
  updateTransferTypeActions,
  deleteTransferTypeActions,
  createTransferTypeActions,
} from './action';

function* getListTransferTypesSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListTransferTypesActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListTransferTypeActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListTransferTypeActions.failure());
  }
}

function* deleteTransferTypesSaga(action) {
  try {
    const { params, listTransferTypes } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deleteTransferTypeActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listTransferTypes.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteTransferTypeActions.success(newParams));
    action.payload?.getListTransferType();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteTransferTypeActions.failure());
  }
}

function* createTransferTypeSaga(action) {
  try {
    const params: TransferType = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createTransferTypeActionsApi, params);
    yield put(createTransferTypeActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createTransferTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createTransferTypeActions.failure(undefined));
    }
  }
}

function* getTransferTypeDetailSaga(action) {
  try {
    const response = yield call(
      getTransferTypeDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getTransferTypeDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getTransferTypeDetailActions.failure());
  }
}

function* updateTransferTypeSaga(action) {
  try {
    yield call(updateTransferTypePermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateTransferTypeActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateTransferTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateTransferTypeActions.failure(undefined));
    }
  }
}

export default function* TransferTypeMasterSaga() {
  yield all([
    yield takeLatest(
      deleteTransferTypeActions.request,
      deleteTransferTypesSaga,
    ),
    yield takeLatest(
      getListTransferTypeActions.request,
      getListTransferTypesSaga,
    ),
    yield takeLatest(createTransferTypeActions.request, createTransferTypeSaga),
    yield takeLatest(
      getTransferTypeDetailActions.request,
      getTransferTypeDetailSaga,
    ),
    yield takeLatest(updateTransferTypeActions.request, updateTransferTypeSaga),
  ]);
}
