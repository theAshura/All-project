import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  CreateValueManagementParams,
  UpdateValueManagementParams,
} from '../utils/model';
import {
  getValueManagementDetailActionsApi,
  getListValueManagementsActionsApi,
  deleteValueManagementActionsApi,
  createValueManagementActionsApi,
  updateValueManagementPermissionDetailActionsApi,
} from '../utils/api';
import {
  getValueManagementDetailActions,
  getListValueManagementActions,
  updateValueManagementActions,
  deleteValueManagementActions,
  createValueManagementActions,
} from './action';

function* getListValueManagementsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListValueManagementsActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListValueManagementActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListValueManagementActions.failure());
  }
}

function* deleteValueManagementsSaga(action) {
  try {
    const { params, listValueManagements } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deleteValueManagementActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listValueManagements.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteValueManagementActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteValueManagementActions.failure());
  }
}

function* createValueManagementSaga(action) {
  try {
    const params: CreateValueManagementParams = {
      ...action.payload,
      number: Number(action.payload.number),
      isNew: undefined,
      handleSuccess: undefined,
    };
    yield call(createValueManagementActionsApi, params);
    yield put(createValueManagementActions.success());
    action.payload?.handleSuccess();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(createValueManagementActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createValueManagementActions.failure(undefined));
    }
  }
}

function* getValueManagementDetailSaga(action) {
  try {
    const response = yield call(
      getValueManagementDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getValueManagementDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getValueManagementDetailActions.failure());
  }
}

function* updateValueManagementSaga(action) {
  try {
    const params: UpdateValueManagementParams = {
      id: action.payload.id,
      data: {
        ...action.payload.data,
        number: Number(action.payload.data.number),
      },
    };
    yield call(updateValueManagementPermissionDetailActionsApi, params);
    toastSuccess('You have updated successfully');
    action.payload?.handleSuccess();

    yield put(updateValueManagementActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateValueManagementActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateValueManagementActions.failure(undefined));
    }
  }
}

export default function* ValueManagementMasterSaga() {
  yield all([
    yield takeLatest(
      deleteValueManagementActions.request,
      deleteValueManagementsSaga,
    ),
    yield takeLatest(
      getListValueManagementActions.request,
      getListValueManagementsSaga,
    ),
    yield takeLatest(
      createValueManagementActions.request,
      createValueManagementSaga,
    ),
    yield takeLatest(
      getValueManagementDetailActions.request,
      getValueManagementDetailSaga,
    ),
    yield takeLatest(
      updateValueManagementActions.request,
      updateValueManagementSaga,
    ),
  ]);
}
