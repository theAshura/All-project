import {
  checkWatchListApi,
  createWatchListApi,
  getListActivityApi,
  unWatchListApi,
  unWatchListMultiApi,
} from 'api/watch-list.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  checkWatchListActions,
  createWatchListActions,
  getWatchListActions,
  unWatchListActions,
  unWatchListMultiActions,
} from './watch-list.actions';

function* createWatchListSaga(action) {
  try {
    const response = yield call(createWatchListApi, action.payload);
    const { data } = response;
    yield put(createWatchListActions.success());
    yield put(getWatchListActions.request());
    toastSuccess(data?.message);
  } catch (e) {
    toastError(e);
    yield put(createWatchListActions.failure());
  }
}

function* getWatchListSaga(action) {
  try {
    const response = yield call(getListActivityApi);
    const { data } = response;
    yield put(getWatchListActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getWatchListActions.failure());
  }
}

function* checkWatchListSaga(action) {
  try {
    const response = yield call(checkWatchListApi, action.payload);
    const { data } = response;
    yield put(checkWatchListActions.success(data?.watchList));
  } catch (e) {
    toastError(e);
    yield put(checkWatchListActions.failure());
  }
}

function* unWatchListSaga(action) {
  try {
    const response = yield call(unWatchListApi, action.payload);
    const { data } = response;
    yield put(unWatchListActions.success());
    yield put(getWatchListActions.request());
    toastSuccess(data?.message);
  } catch (e) {
    toastError(e);
    yield put(unWatchListActions.failure());
  }
}

function* unWatchListMultiSaga(action) {
  try {
    const response = yield call(unWatchListMultiApi, action.payload);
    const { data } = response;
    yield put(unWatchListMultiActions.success());
    yield put(getWatchListActions.request());
    toastSuccess(data?.message);
  } catch (e) {
    toastError(e);
    yield put(unWatchListMultiActions.failure());
  }
}

export default function* WatchListSaga() {
  yield all([
    yield takeLatest(createWatchListActions.request, createWatchListSaga),
    yield takeLatest(getWatchListActions.request, getWatchListSaga),
    yield takeLatest(checkWatchListActions.request, checkWatchListSaga),
    yield takeLatest(unWatchListActions.request, unWatchListSaga),
    yield takeLatest(unWatchListMultiActions.request, unWatchListMultiSaga),
  ]);
}
