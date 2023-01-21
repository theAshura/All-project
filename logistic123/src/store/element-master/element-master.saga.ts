import { AppRouteConst } from 'constants/route.const';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import {
  getStandardMasterDetailActionsApi,
  getListStandardMasterActionsApi,
  getListElementMasterActionsApi,
  updateElementMasterActionsApi,
} from 'api/element-master.api';
import {
  getStandardMasterDetailActions,
  getListStandardMasterActions,
  deleteStandardMasterActions,
  getListStandardMasterNoElementActions,
  getListElementMasterActions,
  updateElementMasterActions,
} from './element-master.action';

function* getListStandardMasterSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListStandardMasterActionsApi, other);
    const { data } = response;
    yield put(getListStandardMasterActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListStandardMasterActions.failure());
  }
}

function* getListStandardMasterNoElementSaga(action) {
  try {
    const response = yield call(
      getListStandardMasterActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getListStandardMasterNoElementActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListStandardMasterNoElementActions.failure());
  }
}

function* getStandardMasterDetailSaga(action) {
  try {
    const response = yield call(
      getStandardMasterDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getStandardMasterDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TYPE);
    }
    toastError(e);
    yield put(getStandardMasterDetailActions.failure());
  }
}

function* deleteStandardMasterSaga(action) {
  try {
    const { id, data } = action.payload;
    yield call(updateElementMasterActionsApi, {
      id,
      body: data,
    });
    toastSuccess('You have deleted successfully');
    action.payload?.getListStandardMaster();
    yield put(updateElementMasterActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e?.message);
      }
      yield put(updateElementMasterActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateElementMasterActions.failure(undefined));
    }
  }
}

function* getListElementMasterSaga(action) {
  try {
    const response = yield call(getListElementMasterActionsApi, {
      id: action.payload,
      body: { page: 1, pageSize: -1 },
    });
    const { data } = response;
    action.payload?.handleSuccess?.();
    yield put(getListElementMasterActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListElementMasterActions.failure());
  }
}

function* updateElementMasterSaga(action) {
  try {
    const { id, data, isCreate } = action.payload;
    if (!data?.createEleMasters?.length && !data?.updateEleMasters?.length) {
      toastError('You have to add at least 1 element.');
    } else {
      yield call(updateElementMasterActionsApi, {
        id,
        body: data,
      });
      if (isCreate) {
        toastSuccess('You have created successfully');
      } else {
        toastSuccess('You have updated successfully');
      }
      history.push(AppRouteConst.ELEMENT_MASTER);
    }
    yield put(updateElementMasterActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e?.message);
      }
      yield put(updateElementMasterActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateElementMasterActions.failure(undefined));
    }
  }
}

export default function* ElementMasterSaga() {
  yield all([
    yield takeLatest(
      getListStandardMasterActions.request,
      getListStandardMasterSaga,
    ),
    yield takeLatest(
      getListStandardMasterNoElementActions.request,
      getListStandardMasterNoElementSaga,
    ),
    yield takeLatest(
      getStandardMasterDetailActions.request,
      getStandardMasterDetailSaga,
    ),
    yield takeLatest(
      deleteStandardMasterActions.request,
      deleteStandardMasterSaga,
    ),
    yield takeLatest(
      getListElementMasterActions.request,
      getListElementMasterSaga,
    ),
    yield takeLatest(
      updateElementMasterActions.request,
      updateElementMasterSaga,
    ),
  ]);
}
