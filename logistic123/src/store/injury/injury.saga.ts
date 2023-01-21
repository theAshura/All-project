import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { CreateInjuryParams } from 'models/api/injury/injury.model';
import {
  createInjuryActionsApi,
  deleteInjuryActionsApi,
  getInjuryDetailActionsApi,
  getListInjuryActionsApi,
  getListInjuryBodyActionsApi,
  getListInjuryMasterActionsApi,
  updateInjuryDetailActionsApi,
} from 'api/injury.api';
import {
  createInjuryActions,
  deleteInjuryActions,
  getInjuryDetailActions,
  getListInjuryActions,
  getListInjuryBodyActions,
  getListInjuryMasterActions,
  updateInjuryActions,
} from './injury.action';

function* getListInjurySaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListInjuryActionsApi, other);

    const { data } = response;
    yield put(getListInjuryActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListInjuryActions.failure());
  }
}

function* getListInjuryMasterSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListInjuryMasterActionsApi, other);

    const { data } = response;
    yield put(getListInjuryMasterActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListInjuryMasterActions.failure());
  }
}

function* getListInjuryBodySaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListInjuryBodyActionsApi, other);

    const { data } = response;
    yield put(getListInjuryBodyActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListInjuryBodyActions.failure());
  }
}

function* createInjurySaga(action) {
  try {
    const params: CreateInjuryParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createInjuryActionsApi, params);
    yield put(createInjuryActions.success());
    action?.payload?.afterCreate?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createInjuryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createInjuryActions.failure(undefined));
    }
  }
}

function* deleteInjurySaga(action) {
  try {
    const { params, ListInjury } = yield select((state: State) => state.injury);
    yield call(deleteInjuryActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      ListInjury.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteInjuryActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteInjuryActions.failure());
  }
}

function* getInjuryDetailSaga(action) {
  try {
    const response = yield call(getInjuryDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getInjuryDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getInjuryDetailActions.failure());
  }
}

function* updateInjurySaga(action) {
  try {
    yield call(updateInjuryDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateInjuryActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateInjuryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateInjuryActions.failure(undefined));
    }
  }
}

export default function* InjurySaga() {
  yield all([
    yield takeLatest(createInjuryActions.request, createInjurySaga),
    yield takeLatest(getListInjuryActions.request, getListInjurySaga),
    yield takeLatest(
      getListInjuryMasterActions.request,
      getListInjuryMasterSaga,
    ),
    yield takeLatest(getListInjuryBodyActions.request, getListInjuryBodySaga),
    yield takeLatest(deleteInjuryActions.request, deleteInjurySaga),
    yield takeLatest(getInjuryDetailActions.request, getInjuryDetailSaga),
    yield takeLatest(updateInjuryActions.request, updateInjurySaga),
  ]);
}
