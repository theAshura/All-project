import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { CheckExitResponse, CreatePlanDrawingParams } from '../utils/model';
import {
  getPlanDrawingDetailActionsApi,
  getListPlanDrawingsActionsApi,
  deletePlanDrawingActionsApi,
  createPlanDrawingActionsApi,
  updatePlanDrawingPermissionDetailActionsApi,
  checkExitCodeApi,
} from '../utils/api';
import {
  getPlanDrawingDetailActions,
  getListPlanDrawingActions,
  updatePlanDrawingActions,
  deletePlanDrawingActions,
  createPlanDrawingActions,
  checkExitCodeAction,
} from './action';

function* getListPlanDrawingsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListPlanDrawingsActionsApi, other);
    handleSuccess?.();

    const { data } = response;
    yield put(getListPlanDrawingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListPlanDrawingActions.failure());
  }
}

function* deletePlanDrawingsSaga(action) {
  try {
    const { params, listPlanDrawings } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deletePlanDrawingActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPlanDrawings.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deletePlanDrawingActions.success(newParams));
    action.payload?.handelSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deletePlanDrawingActions.failure());
  }
}

function* createPlanDrawingSaga(action) {
  try {
    const params: CreatePlanDrawingParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createPlanDrawingActionsApi, params);
    yield put(createPlanDrawingActions.success());
    action.payload?.handelSuccess();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createPlanDrawingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createPlanDrawingActions.failure(undefined));
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

function* getPlanDrawingDetailSaga(action) {
  try {
    const response = yield call(getPlanDrawingDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getPlanDrawingDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getPlanDrawingDetailActions.failure());
  }
}

function* updatePlanDrawingSaga(action) {
  try {
    yield call(updatePlanDrawingPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.handelSuccess();

    yield put(updatePlanDrawingActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updatePlanDrawingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updatePlanDrawingActions.failure(undefined));
    }
  }
}

export default function* PlanDrawingMasterSaga() {
  yield all([
    yield takeLatest(deletePlanDrawingActions.request, deletePlanDrawingsSaga),
    yield takeLatest(
      getListPlanDrawingActions.request,
      getListPlanDrawingsSaga,
    ),
    yield takeLatest(createPlanDrawingActions.request, createPlanDrawingSaga),
    yield takeLatest(
      getPlanDrawingDetailActions.request,
      getPlanDrawingDetailSaga,
    ),
    yield takeLatest(updatePlanDrawingActions.request, updatePlanDrawingSaga),
    yield takeLatest(checkExitCodeAction.request, checkExitCodeSaga),
  ]);
}
