import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import { InjuryMaster } from 'models/api/injury-master/injury-master.model';
import { State } from 'store/reducer';
import {
  getInjuryMasterDetailActionsApi,
  getListInjuryMastersActionsApi,
  deleteInjuryMasterActionsApi,
  createInjuryMasterActionsApi,
  updateInjuryMasterPermissionDetailActionsApi,
} from '../../api/injury-master.api';
import {
  getInjuryMasterDetailActions,
  getListInjuryMasterActions,
  updateInjuryMasterActions,
  deleteInjuryMasterActions,
  createInjuryMasterActions,
} from './injury-master.action';

function* getListInjuryMastersSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListInjuryMastersActionsApi, other);

    const { data } = response;
    yield put(getListInjuryMasterActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListInjuryMasterActions.failure());
  }
}

function* deleteInjuryMastersSaga(action) {
  try {
    const { params, listInjuryMasters } = yield select(
      (state: State) => state.injuryMaster,
    );
    yield call(deleteInjuryMasterActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listInjuryMasters.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteInjuryMasterActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteInjuryMasterActions.failure());
  }
}

function* createInjuryMasterSaga(action) {
  try {
    const params: InjuryMaster = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createInjuryMasterActionsApi, params);
    yield put(createInjuryMasterActions.success());
    action.payload?.handleSuccess();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createInjuryMasterActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createInjuryMasterActions.failure(undefined));
    }
  }
}

function* getInjuryMasterDetailSaga(action) {
  try {
    const response = yield call(
      getInjuryMasterDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getInjuryMasterDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getInjuryMasterDetailActions.failure());
  }
}

function* updateInjuryMasterSaga(action) {
  try {
    yield call(updateInjuryMasterPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.handleSuccess();

    yield put(updateInjuryMasterActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateInjuryMasterActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateInjuryMasterActions.failure(undefined));
    }
  }
}

export default function* InjuryMasterAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteInjuryMasterActions.request,
      deleteInjuryMastersSaga,
    ),
    yield takeLatest(
      getListInjuryMasterActions.request,
      getListInjuryMastersSaga,
    ),
    yield takeLatest(createInjuryMasterActions.request, createInjuryMasterSaga),
    yield takeLatest(
      getInjuryMasterDetailActions.request,
      getInjuryMasterDetailSaga,
    ),
    yield takeLatest(updateInjuryMasterActions.request, updateInjuryMasterSaga),
  ]);
}
