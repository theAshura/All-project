import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createVesselTypeActionsApi,
  deleteVesselTypeActionsApi,
  getDetailVesselTypeActionApi,
  getListVesselTypeActionsApi,
  updateVesselTypeActionApi,
} from 'api/vessel-type.api';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  createVesselTypeActions,
  deleteVesselTypeActions,
  getListVesselTypeActions,
  getVesselTypeDetailActions,
  updateVesselTypeActions,
} from './vessel-type.action';

function* getListVesselTypeSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListVesselTypeActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListVesselTypeActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListVesselTypeActions.failure());
  }
}

function* deleteVesselTypeSaga(action) {
  try {
    const { params, listVesselTypes } = yield select(
      (state: State) => state.vesselType,
    );
    yield call(deleteVesselTypeActionsApi, action.payload?.id);
    action.payload?.getListVesselType();

    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listVesselTypes.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteVesselTypeActions.success(newParams));
  } catch (e) {
    toastError(e);
    yield put(deleteVesselTypeActions.failure());
  }
}

function* createVesselTypeSaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createVesselTypeActionsApi, other);
    yield put(createVesselTypeActions.success());
    yield put(getListVesselTypeActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createVesselTypeActions.failure(e?.errorList || []));
  }
}

function* getVesselTypeSaga(action) {
  try {
    const response = yield call(getDetailVesselTypeActionApi, action.payload);
    const { data } = response;
    yield put(getVesselTypeDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.VESSEL_TYPE);
    }
    yield put(getVesselTypeDetailActions.failure());
  }
}

function* updateVesselTypeSaga(action) {
  try {
    yield call(updateVesselTypeActionApi, action.payload);
    put(updateVesselTypeActions.success());
    history.push(AppRouteConst.VESSEL_TYPE);
    action.payload?.afterUpdate();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateVesselTypeActions.failure(e?.errorList || []));
  }
}

export default function* vesselTypeSaga() {
  yield all([
    yield takeLatest(getListVesselTypeActions.request, getListVesselTypeSaga),
    yield takeLatest(deleteVesselTypeActions.request, deleteVesselTypeSaga),
    yield takeLatest(createVesselTypeActions.request, createVesselTypeSaga),
    yield takeLatest(getVesselTypeDetailActions.request, getVesselTypeSaga),
    yield takeLatest(updateVesselTypeActions.request, updateVesselTypeSaga),
  ]);
}
