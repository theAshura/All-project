import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createPortActionsApi,
  deletePortActionsApi,
  getDetailPortActionApi,
  getGMTActionsApi,
  getListPortActionsApi,
  getListPortStrongPreferenceActionsApi,
  updatePortActionApi,
} from 'api/port.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { Port } from 'models/api/port/port.model';
import { State } from 'store/reducer';
import {
  createPortActions,
  deletePortActions,
  getGMTActions,
  getListPortActions,
  getListPortStrongPreferenceActions,
  getPortDetailActions,
  updatePortActions,
} from './port.action';

function* getListPortSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const params = {
      ...other,
      country: action.payload?.country?.label,
    };
    const response = yield call(getListPortActionsApi, params);
    const { data } = response;
    handleSuccess?.();
    yield put(getListPortActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListPortActions.failure());
  }
}
function* getListPortStrongPreferenceSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const params = {
      ...other,
      country: action.payload?.country?.label,
    };
    const response = yield call(getListPortStrongPreferenceActionsApi, params);
    const { data } = response;
    yield put(getListPortStrongPreferenceActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListPortStrongPreferenceActions.failure());
  }
}

function* deletePortSaga(action) {
  try {
    const { params, listPort } = yield select((state: State) => state.port);
    yield call(deletePortActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPort.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deletePortActions.success(newParams));
    action.payload?.getListPort();
  } catch (e) {
    toastError(e);
    yield put(deletePortActions.failure());
  }
}

function* createPortSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: Port = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createPortActionsApi, params);
    yield put(createPortActions.success());
    if (!isNew) {
      history.push(AppRouteConst.PORT);
    } else {
      action.payload?.resetForm();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createPortActions.failure(e?.errorList || []));
  }
}

function* getPortSaga(action) {
  try {
    const response = yield call(getDetailPortActionApi, action.payload);
    const { data } = response;
    yield put(getPortDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.PORT);
    }
    yield put(getPortDetailActions.failure());
  }
}

function* updatePortSaga(action) {
  try {
    yield call(updatePortActionApi, action.payload?.id, action.payload?.body);
    put(updatePortActions.success());
    history.push(AppRouteConst.PORT);
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updatePortActions.failure(e?.errorList || []));
  }
}

function* getGMTSaga() {
  try {
    const response = yield call(getGMTActionsApi);
    const { data } = response;
    yield put(getGMTActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getGMTActions.failure());
  }
}

export default function* PortSaga() {
  yield all([
    yield takeLatest(getListPortActions.request, getListPortSaga),
    yield takeLatest(
      getListPortStrongPreferenceActions.request,
      getListPortStrongPreferenceSaga,
    ),
    yield takeLatest(deletePortActions.request, deletePortSaga),
    yield takeLatest(createPortActions.request, createPortSaga),
    yield takeLatest(getPortDetailActions.request, getPortSaga),
    yield takeLatest(updatePortActions.request, updatePortSaga),
    yield takeLatest(getGMTActions.request, getGMTSaga),
  ]);
}
