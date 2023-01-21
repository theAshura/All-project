import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { CargoType, CheckExitResponse } from '../utils/model';
import {
  getCargoTypeDetailActionsApi,
  getListCargoTypesActionsApi,
  deleteCargoTypeActionsApi,
  createCargoTypeActionsApi,
  updateCargoTypePermissionDetailActionsApi,
  checkExitCodeApi,
} from '../utils/api';
import {
  getCargoTypeDetailActions,
  getListCargoTypeActions,
  updateCargoTypeActions,
  deleteCargoTypeActions,
  createCargoTypeActions,
  checkExitCodeAction,
} from './action';

function* getListCargoTypesSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListCargoTypesActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListCargoTypeActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCargoTypeActions.failure());
  }
}

function* deleteCargoTypesSaga(action) {
  try {
    const { params, listCargoTypes } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deleteCargoTypeActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCargoTypes.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteCargoTypeActions.success(newParams));
    action.payload?.getListCargoType();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteCargoTypeActions.failure());
  }
}

function* createCargoTypeSaga(action) {
  try {
    const params: CargoType = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createCargoTypeActionsApi, params);
    yield put(createCargoTypeActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createCargoTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createCargoTypeActions.failure(undefined));
    }
  }
}

function* checkExitCodeSaga(action) {
  try {
    const { isExistField } = yield select((state: State) => state.cargo);
    const response = yield call(checkExitCodeApi, action.payload);
    if (action?.payload?.field === 'code') {
      const res: CheckExitResponse = {
        isExistCode: response?.data?.isExist,
        isExistName: isExistField?.isExistName,
      };
      yield put(checkExitCodeAction.success(res));
    } else {
      const res: CheckExitResponse = {
        isExistName: response?.data?.isExist,
        isExistCode: isExistField?.isExistCode,
      };
      yield put(checkExitCodeAction.success(res));
    }
  } catch (e) {
    toastError(e);
    yield put(checkExitCodeAction.failure(undefined));
  }
}

function* getCargoTypeDetailSaga(action) {
  try {
    const response = yield call(getCargoTypeDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getCargoTypeDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCargoTypeDetailActions.failure());
  }
}

function* updateCargoTypeSaga(action) {
  try {
    yield call(updateCargoTypePermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateCargoTypeActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateCargoTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateCargoTypeActions.failure(undefined));
    }
  }
}

export default function* CargoTypeMasterSaga() {
  yield all([
    yield takeLatest(deleteCargoTypeActions.request, deleteCargoTypesSaga),
    yield takeLatest(getListCargoTypeActions.request, getListCargoTypesSaga),
    yield takeLatest(createCargoTypeActions.request, createCargoTypeSaga),
    yield takeLatest(getCargoTypeDetailActions.request, getCargoTypeDetailSaga),
    yield takeLatest(updateCargoTypeActions.request, updateCargoTypeSaga),
    yield takeLatest(checkExitCodeAction.request, checkExitCodeSaga),
  ]);
}
