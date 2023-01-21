import { all, call, put, select, takeLatest } from '@redux-saga/core/effects';
import {
  createDeviceControlActionsApi,
  deleteDeviceControlActionsApi,
  getDetailDeviceControlActionApi,
  getListDeviceControlActionsApi,
  updateDeviceControlActionApi,
} from 'api/device-control.api';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { DeviceControl } from 'models/api/device-control/device-control.model';
import { State } from 'store/reducer';
import {
  createDeviceControlActions,
  deleteDeviceControlActions,
  getDeviceControlDetailActions,
  getListDeviceControlActions,
  updateDeviceControlActions,
} from './device-control.action';

function* getListDeviceControlSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const params = {
      ...other,
      country: action.payload?.country?.label,
    };
    const response = yield call(getListDeviceControlActionsApi, params);
    const { data } = response;
    yield put(getListDeviceControlActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListDeviceControlActions.failure());
  }
}

function* deleteDeviceControlSaga(action) {
  try {
    const { params, listDeviceControl } = yield select(
      (state: State) => state.port,
    );
    yield call(deleteDeviceControlActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listDeviceControl.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteDeviceControlActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListDeviceControl();
  } catch (e) {
    toastError(e);
    yield put(deleteDeviceControlActions.failure());
  }
}

function* createDeviceControlSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: DeviceControl = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createDeviceControlActionsApi, params);
    yield put(createDeviceControlActions.success());
    if (!isNew) {
      history.push(AppRouteConst.DEVICE_CONTROL);
    } else {
      action.payload?.resetForm();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createDeviceControlActions.failure(e?.errorList || []));
  }
}

function* getDeviceControlDetailSaga(action) {
  try {
    const response = yield call(
      getDetailDeviceControlActionApi,
      action.payload,
    );
    const { data } = response;
    yield put(getDeviceControlDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.DEVICE_CONTROL);
    }
    yield put(getDeviceControlDetailActions.failure());
  }
}

function* updateDeviceControlSaga(action) {
  try {
    yield call(
      updateDeviceControlActionApi,
      action.payload?.id,
      action.payload?.body,
    );
    put(updateDeviceControlActions.success());
    if (action.payload?.afterUpdate) {
      action.payload?.afterUpdate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateDeviceControlActions.failure(e?.errorList || []));
  }
}

export default function* DeviceControlSaga() {
  yield all([
    yield takeLatest(
      getListDeviceControlActions.request,
      getListDeviceControlSaga,
    ),
    yield takeLatest(
      deleteDeviceControlActions.request,
      deleteDeviceControlSaga,
    ),
    yield takeLatest(
      createDeviceControlActions.request,
      createDeviceControlSaga,
    ),
    yield takeLatest(
      getDeviceControlDetailActions.request,
      getDeviceControlDetailSaga,
    ),
    yield takeLatest(
      updateDeviceControlActions.request,
      updateDeviceControlSaga,
    ),
  ]);
}
