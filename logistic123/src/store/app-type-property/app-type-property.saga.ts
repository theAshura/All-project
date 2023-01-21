import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createAppTypePropertyActionsApi,
  deleteAppTypePropertyActionsApi,
  getDetailAppTypePropertyActionApi,
  getListAppTypePropertyActionsApi,
  updateAppTypePropertyActionApi,
} from 'api/app-type-property.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { AppTypeProperty } from 'models/api/app-type-property/app-type-property.model';
import { State } from 'store/reducer';
import {
  createAppTypePropertyActions,
  deleteAppTypePropertyActions,
  getListAppTypePropertyActions,
  getAppTypePropertyDetailActions,
  updateAppTypePropertyActions,
} from './app-type-property.action';

function* getListAppTypePropertySaga(action) {
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
    const response = yield call(getListAppTypePropertyActionsApi, params);
    const { data } = response;
    handleSuccess?.();
    yield put(getListAppTypePropertyActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListAppTypePropertyActions.failure());
  }
}

function* deleteAppTypePropertySaga(action) {
  try {
    const { params, listAppTypeProperty } = yield select(
      (state: State) => state.port,
    );
    yield call(deleteAppTypePropertyActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listAppTypeProperty.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteAppTypePropertyActions.success(newParams));
    action.payload?.getListAppTypeProperty();
  } catch (e) {
    toastError(e);
    yield put(deleteAppTypePropertyActions.failure());
  }
}

function* createAppTypePropertySaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: AppTypeProperty = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createAppTypePropertyActionsApi, params);
    yield put(createAppTypePropertyActions.success());
    if (!isNew) {
      history.push(AppRouteConst.APP_TYPE_PROPERTY);
    } else {
      action.payload?.resetForm();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createAppTypePropertyActions.failure(e?.errorList || []));
  }
}

function* getAppTypePropertyDetailSaga(action) {
  try {
    const response = yield call(
      getDetailAppTypePropertyActionApi,
      action.payload,
    );
    const { data } = response;
    yield put(getAppTypePropertyDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.APP_TYPE_PROPERTY);
    }
    yield put(getAppTypePropertyDetailActions.failure());
  }
}

function* updateAppTypePropertySaga(action) {
  try {
    yield call(
      updateAppTypePropertyActionApi,
      action.payload?.id,
      action.payload?.body,
    );
    put(updateAppTypePropertyActions.success());
    history.push(AppRouteConst.APP_TYPE_PROPERTY);
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateAppTypePropertyActions.failure(e?.errorList || []));
  }
}

export default function* AppTypePropertySaga() {
  yield all([
    yield takeLatest(
      getListAppTypePropertyActions.request,
      getListAppTypePropertySaga,
    ),
    yield takeLatest(
      deleteAppTypePropertyActions.request,
      deleteAppTypePropertySaga,
    ),
    yield takeLatest(
      createAppTypePropertyActions.request,
      createAppTypePropertySaga,
    ),
    yield takeLatest(
      getAppTypePropertyDetailActions.request,
      getAppTypePropertyDetailSaga,
    ),
    yield takeLatest(
      updateAppTypePropertyActions.request,
      updateAppTypePropertySaga,
    ),
  ]);
}
