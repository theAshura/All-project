import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getPortStateControlDetailActionsApi,
  getListPortStateControlActionsApi,
  deletePortStateControlActionsApi,
  createPortStateControlActionsApi,
  updatePortStateControlDetailActionsApi,
} from 'api/port-state-control.api';
import { State } from '../reducer';

import {
  getPortStateControlDetailActions,
  getListPortStateControlActions,
  updatePortStateControlActions,
  deletePortStateControlActions,
  createPortStateControlActions,
} from './port-state-control.action';

function* getListPortStateControlsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListPortStateControlActionsApi, other);
    const { data } = response;
    yield put(getListPortStateControlActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListPortStateControlActions.failure());
  }
}

function* deletePortStateControlsSaga(action) {
  try {
    const { params, listPortStateControls } = yield select(
      (state: State) => state.portStateControl,
    );
    yield call(deletePortStateControlActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPortStateControls.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deletePortStateControlActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deletePortStateControlActions.failure());
  }
}

function* createPortStateControlSaga(action) {
  try {
    const { isNew, handleSuccess, ...params } = action.payload;
    const body = {
      ...params,
      noFindings: params?.noFindings !== 'false',
    };
    yield call(createPortStateControlActionsApi, body);
    yield put(createPortStateControlActions.success());
    yield put(getListPortStateControlActions.request({}));
    handleSuccess?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createPortStateControlActions.failure(e));
    } else {
      toastError(e);
      yield put(createPortStateControlActions.failure(undefined));
    }
  }
}

function* getPortStateControlDetailSaga(action) {
  try {
    const response = yield call(
      getPortStateControlDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getPortStateControlDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getPortStateControlDetailActions.failure());
  }
}

function* updatePortStateControlSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    const body = {
      ...params,
      data: {
        ...params?.data,
        noFindings: params?.data?.noFindings !== 'false',
      },
    };
    yield call(updatePortStateControlDetailActionsApi, body);
    put(updatePortStateControlActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updatePortStateControlActions.failure(e));
    } else {
      toastError(e);
      yield put(updatePortStateControlActions.failure(undefined));
    }
  }
}

export default function* PortStateControlSaga() {
  yield all([
    yield takeLatest(
      deletePortStateControlActions.request,
      deletePortStateControlsSaga,
    ),
    yield takeLatest(
      getListPortStateControlActions.request,
      getListPortStateControlsSaga,
    ),
    yield takeLatest(
      createPortStateControlActions.request,
      createPortStateControlSaga,
    ),
    yield takeLatest(
      getPortStateControlDetailActions.request,
      getPortStateControlDetailSaga,
    ),
    yield takeLatest(
      updatePortStateControlActions.request,
      updatePortStateControlSaga,
    ),
  ]);
}
