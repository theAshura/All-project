import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import {
  createRemarkApi,
  deleteRemarksByDateApi,
  getAnalysisDataApi,
  getListActivityApi,
  getRemarksByDateApi,
  updateRemarksByDateApi,
} from 'api/home-page.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createRemarkActions,
  deleteRemarksByDateActions,
  getAnalysisDataActions,
  getListActivityActions,
  getRemarksByDateActions,
  updateRemarksByDateActions,
} from './home-page.action';

function* getActivitySaga(action) {
  try {
    const response = yield call(getListActivityApi, action.payload);
    const { data } = response;
    yield put(getListActivityActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListActivityActions.failure());
  }
}
function* getAnalysisDataSaga() {
  try {
    const response = yield call(getAnalysisDataApi);
    const { data } = response;
    yield put(getAnalysisDataActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getAnalysisDataActions.failure());
  }
}

function* createRemarkSaga(action) {
  const { remark, createdAtFrom, createdAtTo } = action.payload;
  try {
    yield call(createRemarkApi, { remark, createdDate: createdAtFrom });
    yield put(createRemarkActions.success());
    yield put(
      getRemarksByDateActions.request({
        createdDateFrom: createdAtFrom,
        createdDateTo: createdAtTo,
      }),
    );
    yield put(getListActivityActions.request({}));
    yield put(getAnalysisDataActions.request());

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createRemarkActions.failure(e?.errorList || []));
  }
}

function* getRemarkByDateSaga(action) {
  try {
    const response = yield call(getRemarksByDateApi, action.payload);
    const { data } = response;

    yield put(getRemarksByDateActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getRemarksByDateActions.failure());
  }
}

function* updateRemarkSaga(action) {
  const { id, createdAtFrom, createdAtTo, remark } = action.payload;
  try {
    yield call(updateRemarksByDateApi, { remark, id });
    yield put(updateRemarksByDateActions.success());
    yield put(
      getRemarksByDateActions.request({
        createdDateFrom: createdAtFrom,
        createdDateTo: createdAtTo,
      }),
    );
    yield put(getListActivityActions.request({}));
    yield put(getAnalysisDataActions.request());
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(updateRemarksByDateActions.failure(e?.errorList || []));
  }
}

function* deleteRemarkSaga(action) {
  const { id, createdAtFrom, createdAtTo } = action.payload;
  try {
    yield call(deleteRemarksByDateApi, id);
    yield put(deleteRemarksByDateActions.success());
    yield put(
      getRemarksByDateActions.request({
        createdDateFrom: createdAtFrom,
        createdDateTo: createdAtTo,
      }),
    );
    yield put(getListActivityActions.request({}));
    yield put(getAnalysisDataActions.request());
    toastSuccess('You have deleted successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(deleteRemarksByDateActions.failure(e?.errorList || []));
  }
}

export default function* HomePageSaga() {
  yield all([
    yield takeLatest(getListActivityActions.request, getActivitySaga),
    yield takeLatest(getAnalysisDataActions.request, getAnalysisDataSaga),
    yield takeLatest(createRemarkActions.request, createRemarkSaga),
    yield takeLatest(getRemarksByDateActions.request, getRemarkByDateSaga),
    yield takeLatest(updateRemarksByDateActions.request, updateRemarkSaga),
    yield takeLatest(deleteRemarksByDateActions.request, deleteRemarkSaga),
  ]);
}
