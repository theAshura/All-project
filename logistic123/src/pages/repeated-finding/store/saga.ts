import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { RepeateFindingCalculation } from '../utils/model';
import {
  createRepeateFindingCalculationActionsApi,
  getListRepeateFindingCalculationActionsApi,
  deleteRepeateFindingCalculationActionsApi,
  updateRepeateFindingCalculationActionsApi,
} from '../utils/api';
import {
  createRepeateFindingCalculationActions,
  deleteRepeateFindingCalculationActions,
  getListRepeateFindingCalculationActions,
  updateRepeateFindingCalculationActions,
} from './action';

function* getListRepeateFindingCalculationSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(
      getListRepeateFindingCalculationActionsApi,
      other,
    );

    const { data } = response;
    handleSuccess?.();
    yield put(getListRepeateFindingCalculationActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListRepeateFindingCalculationActions.failure());
  }
}

function* createRepeateFindingCalculationSaga(action) {
  try {
    const params: RepeateFindingCalculation = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createRepeateFindingCalculationActionsApi, params);
    yield put(createRepeateFindingCalculationActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createRepeateFindingCalculationActions.failure(e?.message));
    } else {
      toastError(e);
      yield put(createRepeateFindingCalculationActions.failure(undefined));
    }
  }
}
function* deleteRepeateFindingCalculationSaga(action) {
  try {
    const { params, listRepeateFindingCalculation } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deleteRepeateFindingCalculationActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listRepeateFindingCalculation.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteRepeateFindingCalculationActions.success(newParams));
    action.payload?.getListRepeateFindingCalculation();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteRepeateFindingCalculationActions.failure());
  }
}
function* updateRepeateFindingCalculationSaga(action) {
  try {
    yield call(updateRepeateFindingCalculationActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateRepeateFindingCalculationActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        yield put(createRepeateFindingCalculationActions.failure(e?.message));
      }
    } else {
      toastError(e);
      yield put(updateRepeateFindingCalculationActions.failure(undefined));
    }
  }
}

export default function* RepeateFindingCalculationMasterSaga() {
  yield all([
    yield takeLatest(
      getListRepeateFindingCalculationActions.request,
      getListRepeateFindingCalculationSaga,
    ),
    yield takeLatest(
      deleteRepeateFindingCalculationActions.request,
      deleteRepeateFindingCalculationSaga,
    ),
    yield takeLatest(
      createRepeateFindingCalculationActions.request,
      createRepeateFindingCalculationSaga,
    ),
    yield takeLatest(
      updateRepeateFindingCalculationActions.request,
      updateRepeateFindingCalculationSaga,
    ),
  ]);
}
