import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
// import history from 'helpers/history.helper';
// import { AppRouteConst } from 'constants/route.const';

import {
  getListTerminalActionsApi,
  deleteTerminalActionsApi,
  createTerminalActionsApi,
  getTerminalDetailActionsApi,
  updateTerminalDetailActionsApi,
  getListTerminalByMainIdActionsApi,
} from 'api/terminal.api';
import { CreateTerminalParams } from 'models/api/terminal/terminal.model';
import { State } from '../reducer';
import {
  createTerminalActions,
  deleteTerminalActions,
  getListTerminalActions,
  getListTerminalByMainIdActions,
  getTerminalDetailActions,
  updateTerminalActions,
} from './terminal.action';

function* getListTerminalSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListTerminalActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListTerminalActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListTerminalActions.failure());
  }
}

function* getListTerminalByMainIdSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListTerminalByMainIdActionsApi, other);
    const { data } = response;
    yield put(getListTerminalByMainIdActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListTerminalByMainIdActions.failure());
  }
}

function* deleteTerminalSaga(action) {
  try {
    const { params, listSecondCategories } = yield select(
      (state: State) => state.terminal,
    );
    yield call(deleteTerminalActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listSecondCategories.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteTerminalActions.success(newParams));
    action.payload?.getListTerminal();
  } catch (e) {
    toastError(e);
    yield put(deleteTerminalActions.failure());
  }
}

function* createTerminalSaga(action) {
  try {
    const params: CreateTerminalParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createTerminalActionsApi, params);
    yield put(createTerminalActions.success());
    toastSuccess('You have created successfully');

    action.payload?.afterCreate();
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createTerminalActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createTerminalActions.failure(undefined));
    }
  }
}

function* getTerminalDetailSaga(action) {
  try {
    const response = yield call(getTerminalDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getTerminalDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getTerminalDetailActions.failure());
  }
}

function* updateTerminalSaga(action) {
  try {
    yield call(updateTerminalDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    yield put(updateTerminalActions.success());
    action.payload?.afterUpdate();
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateTerminalActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateTerminalActions.failure(undefined));
    }
  }
}

export default function* TerminalSaga() {
  yield all([
    yield takeLatest(deleteTerminalActions.request, deleteTerminalSaga),
    yield takeLatest(
      getListTerminalByMainIdActions.request,
      getListTerminalByMainIdSaga,
    ),
    yield takeLatest(getListTerminalActions.request, getListTerminalSaga),
    yield takeLatest(createTerminalActions.request, createTerminalSaga),
    yield takeLatest(getTerminalDetailActions.request, getTerminalDetailSaga),
    yield takeLatest(updateTerminalActions.request, updateTerminalSaga),
  ]);
}
