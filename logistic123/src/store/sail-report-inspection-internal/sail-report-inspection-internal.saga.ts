import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createSailReportInspectionInternalApi,
  getSailReportInspectionInternalDetailApi,
  updateSailReportInspectionInternalApi,
  deleteSailReportInspectionInternalApi,
  getListSailReportInspectionInternalApi,
} from 'api/sail-report-inspection-internal.api';
import {
  createSailReportInspectionInternalActions,
  updateSailReportInspectionInternalActions,
  getSailReportInspectionInternalDetailActions,
  deleteSailReportInspectionInternalActions,
  getListSailReportInspectionInternalActions,
} from './sail-report-inspection-internal.action';
import { State } from '../reducer';

function* getListSailReportInspectionInternalSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListSailReportInspectionInternalApi, other);
    const { data } = response;
    yield put(getListSailReportInspectionInternalActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListSailReportInspectionInternalActions.failure());
  }
}

function* deleteSailReportInspectionInternalSaga(action) {
  try {
    const { params, listSailReportInspectionInternal } = yield select(
      (state: State) => state.sailReportInspectionInternal,
    );
    yield call(deleteSailReportInspectionInternalApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listSailReportInspectionInternal.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteSailReportInspectionInternalActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteSailReportInspectionInternalActions.failure());
  }
}

function* createInternalInspectionsSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(createSailReportInspectionInternalApi, params);
    yield put(createSailReportInspectionInternalActions.success());
    handleSuccess?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createSailReportInspectionInternalActions.failure(e));
    } else {
      toastError(e);
      yield put(createSailReportInspectionInternalActions.failure(undefined));
    }
  }
}

function* getInternalInspectionsDetailSaga(action) {
  try {
    const response = yield call(
      getSailReportInspectionInternalDetailApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSailReportInspectionInternalDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSailReportInspectionInternalDetailActions.failure());
  }
}

function* updateInternalInspectionsSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(updateSailReportInspectionInternalApi, params);
    put(updateSailReportInspectionInternalActions.success());
    handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateSailReportInspectionInternalActions.failure(e));
    } else {
      toastError(e);
      yield put(updateSailReportInspectionInternalActions.failure(undefined));
    }
  }
}

export default function* SailReportInspectionInternalSaga() {
  yield all([
    yield takeLatest(
      getListSailReportInspectionInternalActions.request,
      getListSailReportInspectionInternalSaga,
    ),
    yield takeLatest(
      deleteSailReportInspectionInternalActions.request,
      deleteSailReportInspectionInternalSaga,
    ),
    yield takeLatest(
      createSailReportInspectionInternalActions.request,
      createInternalInspectionsSaga,
    ),
    yield takeLatest(
      getSailReportInspectionInternalDetailActions.request,
      getInternalInspectionsDetailSaga,
    ),
    yield takeLatest(
      updateSailReportInspectionInternalActions.request,
      updateInternalInspectionsSaga,
    ),
  ]);
}
