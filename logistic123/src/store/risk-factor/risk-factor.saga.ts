import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { CreateRiskFactorParams } from 'models/api/risk-factor/risk-factor.model';
import {
  getListRiskFactorActionsApi,
  deleteRiskFactorActionsApi,
  createRiskFactorActionsApi,
  getRiskFactorDetailActionsApi,
  updateRiskFactorDetailActionsApi,
} from 'api/risk-factor.api';
import { State } from '../reducer';
import {
  getListRiskFactorActions,
  getRiskFactorDetailActions,
  updateRiskFactorActions,
  deleteRiskFactorActions,
  createRiskFactorActions,
} from './risk-factor.action';

function* getListRiskFactorSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListRiskFactorActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListRiskFactorActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListRiskFactorActions.failure());
  }
}

function* deleteRiskFactorSaga(action) {
  try {
    const { params, listSecondCategories } = yield select(
      (state: State) => state.secondCategory,
    );
    yield call(deleteRiskFactorActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listSecondCategories.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteRiskFactorActions.success(newParams));
    action.payload?.getListRiskFactor();
  } catch (e) {
    toastError(e);
    yield put(deleteRiskFactorActions.failure());
  }
}

function* createRiskFactorSaga(action) {
  try {
    const params: CreateRiskFactorParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createRiskFactorActionsApi, params);
    yield put(createRiskFactorActions.success());
    toastSuccess('You have created successfully');

    action.payload?.afterCreate();
  } catch (e) {
    if (e?.statusCode === 400) {
      toastError(e?.message);
      yield put(createRiskFactorActions.failure(e?.errorList));
    } else {
      toastError(e?.message);
      yield put(createRiskFactorActions.failure(undefined));
    }
  }
}

function* getRiskFactorDetailSaga(action) {
  try {
    const response = yield call(getRiskFactorDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getRiskFactorDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getRiskFactorDetailActions.failure());
  }
}

function* updateRiskFactorSaga(action) {
  try {
    yield call(updateRiskFactorDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    yield put(updateRiskFactorActions.success());
    action.payload?.afterUpdate();
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateRiskFactorActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateRiskFactorActions.failure(undefined));
    }
  }
}

export default function* RiskFactorSaga() {
  yield all([
    yield takeLatest(deleteRiskFactorActions.request, deleteRiskFactorSaga),
    yield takeLatest(getListRiskFactorActions.request, getListRiskFactorSaga),
    yield takeLatest(createRiskFactorActions.request, createRiskFactorSaga),
    yield takeLatest(
      getRiskFactorDetailActions.request,
      getRiskFactorDetailSaga,
    ),
    yield takeLatest(updateRiskFactorActions.request, updateRiskFactorSaga),
  ]);
}
