import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import { FocusRequest } from 'models/api/focus-request/focus-request.model';
import { State } from 'store/reducer';
import {
  getFocusRequestDetailActionsApi,
  getListFocusRequestsActionsApi,
  deleteFocusRequestActionsApi,
  createFocusRequestActionsApi,
  updateFocusRequestPermissionDetailActionsApi,
} from '../../api/focus-request.api';
import {
  getFocusRequestDetailActions,
  getListFocusRequestActions,
  updateFocusRequestActions,
  deleteFocusRequestActions,
  createFocusRequestActions,
} from './focus-request.action';

function* getListFocusRequestsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListFocusRequestsActionsApi, other);

    const { data } = response;
    yield put(getListFocusRequestActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListFocusRequestActions.failure());
  }
}

function* deleteFocusRequestsSaga(action) {
  try {
    const { params, listFocusRequests } = yield select(
      (state: State) => state.focusRequest,
    );
    yield call(deleteFocusRequestActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listFocusRequests.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteFocusRequestActions.success(newParams));
    action.payload?.getListFocusRequest();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteFocusRequestActions.failure());
  }
}

function* createFocusRequestSaga(action) {
  try {
    const params: FocusRequest = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createFocusRequestActionsApi, params);
    yield put(createFocusRequestActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createFocusRequestActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createFocusRequestActions.failure(undefined));
    }
  }
}

function* getFocusRequestDetailSaga(action) {
  try {
    const response = yield call(
      getFocusRequestDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getFocusRequestDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getFocusRequestDetailActions.failure());
  }
}

function* updateFocusRequestSaga(action) {
  try {
    yield call(updateFocusRequestPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateFocusRequestActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateFocusRequestActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateFocusRequestActions.failure(undefined));
    }
  }
}

export default function* FocusRequestAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteFocusRequestActions.request,
      deleteFocusRequestsSaga,
    ),
    yield takeLatest(
      getListFocusRequestActions.request,
      getListFocusRequestsSaga,
    ),
    yield takeLatest(createFocusRequestActions.request, createFocusRequestSaga),
    yield takeLatest(
      getFocusRequestDetailActions.request,
      getFocusRequestDetailSaga,
    ),
    yield takeLatest(updateFocusRequestActions.request, updateFocusRequestSaga),
  ]);
}
