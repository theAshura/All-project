import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import { InspectorTimeOff } from 'models/api/inspector-time-off/inspector-time-off.model';
import { State } from 'store/reducer';
import {
  getInspectorTimeOffDetailActionsApi,
  getListInspectorTimeOffsActionsApi,
  deleteInspectorTimeOffActionsApi,
  createInspectorTimeOffActionsApi,
  updateInspectorTimeOffPermissionDetailActionsApi,
} from '../../api/inspector-time-off.api';
import {
  getInspectorTimeOffDetailActions,
  getListInspectorTimeOffActions,
  updateInspectorTimeOffActions,
  deleteInspectorTimeOffActions,
  createInspectorTimeOffActions,
} from './inspector-time-off.action';

function* getListInspectorTimeOffsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListInspectorTimeOffsActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListInspectorTimeOffActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListInspectorTimeOffActions.failure());
  }
}

function* deleteInspectorTimeOffsSaga(action) {
  try {
    const { params, listInspectorTimeOffs } = yield select(
      (state: State) => state.focusRequest,
    );
    yield call(deleteInspectorTimeOffActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listInspectorTimeOffs.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteInspectorTimeOffActions.success(newParams));
    action.payload?.getListInspectorTimeOff();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteInspectorTimeOffActions.failure());
  }
}

function* createInspectorTimeOffSaga(action) {
  try {
    const params: InspectorTimeOff = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createInspectorTimeOffActionsApi, params);
    yield put(createInspectorTimeOffActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createInspectorTimeOffActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createInspectorTimeOffActions.failure(undefined));
    }
  }
}

function* getInspectorTimeOffDetailSaga(action) {
  try {
    const response = yield call(
      getInspectorTimeOffDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getInspectorTimeOffDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getInspectorTimeOffDetailActions.failure());
  }
}

function* updateInspectorTimeOffSaga(action) {
  try {
    yield call(
      updateInspectorTimeOffPermissionDetailActionsApi,
      action.payload,
    );
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateInspectorTimeOffActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateInspectorTimeOffActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateInspectorTimeOffActions.failure(undefined));
    }
  }
}

export default function* InspectorTimeOffAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteInspectorTimeOffActions.request,
      deleteInspectorTimeOffsSaga,
    ),
    yield takeLatest(
      getListInspectorTimeOffActions.request,
      getListInspectorTimeOffsSaga,
    ),
    yield takeLatest(
      createInspectorTimeOffActions.request,
      createInspectorTimeOffSaga,
    ),
    yield takeLatest(
      getInspectorTimeOffDetailActions.request,
      getInspectorTimeOffDetailSaga,
    ),
    yield takeLatest(
      updateInspectorTimeOffActions.request,
      updateInspectorTimeOffSaga,
    ),
  ]);
}
