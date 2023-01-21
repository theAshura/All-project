import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { CrewGrouping, CheckExitResponse } from '../utils/model';
import {
  getCrewGroupingDetailActionsApi,
  getListCrewGroupingsActionsApi,
  deleteCrewGroupingActionsApi,
  createCrewGroupingActionsApi,
  updateCrewGroupingPermissionDetailActionsApi,
  checkExitCodeApi,
} from '../utils/api';
import {
  getCrewGroupingDetailActions,
  getListCrewGroupingActions,
  updateCrewGroupingActions,
  deleteCrewGroupingActions,
  createCrewGroupingActions,
  checkExitCodeAction,
} from './action';

function* getListCrewGroupingsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListCrewGroupingsActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListCrewGroupingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCrewGroupingActions.failure());
  }
}

function* deleteCrewGroupingsSaga(action) {
  try {
    const { params, listCrewGroupings } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deleteCrewGroupingActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCrewGroupings.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteCrewGroupingActions.success(newParams));
    action.payload?.getListCrewGrouping();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteCrewGroupingActions.failure());
  }
}

function* createCrewGroupingSaga(action) {
  try {
    const params: CrewGrouping = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createCrewGroupingActionsApi, params);
    yield put(createCrewGroupingActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createCrewGroupingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createCrewGroupingActions.failure(undefined));
    }
  }
}

function* checkExitCodeSaga(action) {
  try {
    const { isExistField } = yield select((state: State) => state.crewGrouping);
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

function* getCrewGroupingDetailSaga(action) {
  try {
    const response = yield call(
      getCrewGroupingDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getCrewGroupingDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getCrewGroupingDetailActions.failure());
  }
}

function* updateCrewGroupingSaga(action) {
  try {
    yield call(updateCrewGroupingPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateCrewGroupingActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateCrewGroupingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateCrewGroupingActions.failure(undefined));
    }
  }
}

export default function* CrewGroupingMasterSaga() {
  yield all([
    yield takeLatest(
      deleteCrewGroupingActions.request,
      deleteCrewGroupingsSaga,
    ),
    yield takeLatest(
      getListCrewGroupingActions.request,
      getListCrewGroupingsSaga,
    ),
    yield takeLatest(createCrewGroupingActions.request, createCrewGroupingSaga),
    yield takeLatest(
      getCrewGroupingDetailActions.request,
      getCrewGroupingDetailSaga,
    ),
    yield takeLatest(updateCrewGroupingActions.request, updateCrewGroupingSaga),
    yield takeLatest(checkExitCodeAction.request, checkExitCodeSaga),
  ]);
}
