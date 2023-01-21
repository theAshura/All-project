import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { Cargo, CheckExitResponse } from '../utils/model';
import {
  getCargoDetailActionsApi,
  getListCargosActionsApi,
  deleteCargoActionsApi,
  createCargoActionsApi,
  updateCargoPermissionDetailActionsApi,
  checkExitCodeApi,
} from '../utils/api';
import {
  getCargoDetailActions,
  getListCargoActions,
  updateCargoActions,
  deleteCargoActions,
  createCargoActions,
  checkExitCodeAction,
} from './action';

function* getListCargosSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListCargosActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListCargoActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCargoActions.failure());
  }
}

function* deleteCargosSaga(action) {
  try {
    const { params, listCargos } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deleteCargoActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCargos.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteCargoActions.success(newParams));
    action.payload?.getListCargo();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteCargoActions.failure());
  }
}

function* createCargoSaga(action) {
  try {
    const params: Cargo = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createCargoActionsApi, params);
    yield put(createCargoActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createCargoActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createCargoActions.failure(undefined));
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

function* getCargoDetailSaga(action) {
  try {
    const response = yield call(getCargoDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getCargoDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCargoDetailActions.failure());
  }
}

function* updateCargoSaga(action) {
  try {
    yield call(updateCargoPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateCargoActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateCargoActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateCargoActions.failure(undefined));
    }
  }
}

export default function* CargoMasterSaga() {
  yield all([
    yield takeLatest(deleteCargoActions.request, deleteCargosSaga),
    yield takeLatest(getListCargoActions.request, getListCargosSaga),
    yield takeLatest(createCargoActions.request, createCargoSaga),
    yield takeLatest(getCargoDetailActions.request, getCargoDetailSaga),
    yield takeLatest(updateCargoActions.request, updateCargoSaga),
    yield takeLatest(checkExitCodeAction.request, checkExitCodeSaga),
  ]);
}
