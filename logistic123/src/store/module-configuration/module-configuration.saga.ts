import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import {
  getDetailLabelActionsApi,
  getDetailModuleConfigurationActionsApi,
  getListLabelActionsApi,
  getListModuleConfigurationActionsApi,
  updateDetailLabelActionsApi,
  updateDetailModuleConfigurationActionsApi,
} from 'api/module-configuration.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getDetailLabelConfigActions,
  getDetailModuleConfigurationActions,
  getListLabelConfigActions,
  getListModuleConfigurationActions,
  updateDetailLabelConfigActions,
  updateDetailModuleConfigurationActions,
} from './module-configuration.action';

function* getListModuleConfigurationSaga(action) {
  try {
    const response = yield call(
      getListModuleConfigurationActionsApi,
      action.payload,
    );
    if (response.data) {
      yield put(getListModuleConfigurationActions.success(response.data));
    }
  } catch (error) {
    toastError(error);
    yield put(getListModuleConfigurationActions.failure());
  }
}

function* getDetailModuleConfigurationSaga(action) {
  try {
    const response = yield call(
      getDetailModuleConfigurationActionsApi,
      action.payload,
    );
    if (response.data) {
      yield put(getDetailModuleConfigurationActions.success(response.data));
    }
  } catch (error) {
    toastError(error);
    yield put(getDetailModuleConfigurationActions.failure());
  }
}

function* updateDetailModuleConfigurationSaga(action) {
  try {
    const { onSuccess, ...other } = action.payload;

    const response = yield call(
      updateDetailModuleConfigurationActionsApi,
      other,
    );
    yield put(
      updateDetailModuleConfigurationActions.success(response?.data?.message),
    );
    toastSuccess(response?.data?.message || 'Update module success');
    onSuccess?.(response.data?.id || '');
  } catch (error) {
    toastError(error);
    yield put(updateDetailModuleConfigurationActions.failure());
  }
}

function* getListLabelConfigSaga(action) {
  try {
    const response = yield call(getListLabelActionsApi, action.payload);
    if (response?.data) {
      yield put(getListLabelConfigActions.success(response?.data));
    }
  } catch (error) {
    toastError(error);
    yield put(getListLabelConfigActions.failure());
  }
}

function* getDetailLabelConfigSaga(action) {
  try {
    const response = yield call(getDetailLabelActionsApi, action.payload);
    if (response?.data) {
      yield put(getDetailLabelConfigActions.success(response?.data));
    }
  } catch (error) {
    toastError(error);
    yield put(getDetailLabelConfigActions.failure());
  }
}

function* updateDetailLabelConfigSaga(action) {
  try {
    const { onSuccess, ...other } = action.payload;
    const response = yield call(updateDetailLabelActionsApi, other);
    if (response?.data) {
      yield put(updateDetailLabelConfigActions.success(response.data.message));
      toastSuccess(response.data.message, 4000);
      onSuccess?.(response.data?.id || '');
    }
  } catch (error) {
    toastError(error);
    yield put(updateDetailLabelConfigActions.failure());
  }
}

export default function* ModuleConfigurationSaga() {
  yield all([
    yield takeLatest(
      getListModuleConfigurationActions.request,
      getListModuleConfigurationSaga,
    ),
    yield takeLatest(
      getDetailModuleConfigurationActions.request,
      getDetailModuleConfigurationSaga,
    ),
    yield takeLatest(
      updateDetailModuleConfigurationActions.request,
      updateDetailModuleConfigurationSaga,
    ),
    yield takeLatest(getListLabelConfigActions.request, getListLabelConfigSaga),
    yield takeLatest(
      getDetailLabelConfigActions.request,
      getDetailLabelConfigSaga,
    ),
    yield takeLatest(
      updateDetailLabelConfigActions.request,
      updateDetailLabelConfigSaga,
    ),
  ]);
}
