import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { CreateConditionClassDispensationsParams } from 'models/api/condition-of-class/condition-of-class.model';
import {
  createConditionOfClassActionsApi,
  deleteConditionOfClassActionsApi,
  getConditionOfClassDetailActionsApi,
  getListConditionOfClassActionsApi,
  updateConditionOfClassDetailActionsApi,
} from 'api/condition-of-class.api';
import {
  createConditionOfClassActions,
  deleteConditionOfClassActions,
  getConditionOfClassDetailActions,
  getListConditionOfClassActions,
  updateConditionOfClassActions,
} from './condition-of-class.action';

function* getListConditionOfClassSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListConditionOfClassActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListConditionOfClassActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListConditionOfClassActions.failure());
  }
}

function* createConditionOfClassSaga(action) {
  try {
    const params: CreateConditionClassDispensationsParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createConditionOfClassActionsApi, params);
    yield put(createConditionOfClassActions.success());
    action?.payload?.afterCreate?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createConditionOfClassActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createConditionOfClassActions.failure(undefined));
    }
  }
}

function* deleteConditionOfClassSaga(action) {
  try {
    const { params, getListConditionOfClass } = yield select(
      (state: State) => state.conditionOfClass,
    );
    yield call(deleteConditionOfClassActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      getListConditionOfClass.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteConditionOfClassActions.success(newParams));
    action.payload?.getListConditionOfClass();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteConditionOfClassActions.failure());
  }
}

function* getConditionOfClassDetailSaga(action) {
  try {
    const response = yield call(
      getConditionOfClassDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getConditionOfClassDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getConditionOfClassDetailActions.failure());
  }
}

function* updateConditionOfClassSaga(action) {
  try {
    yield call(updateConditionOfClassDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateConditionOfClassActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateConditionOfClassActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateConditionOfClassActions.failure(undefined));
    }
  }
}

export default function* ConditionOfClassAndPermissionSaga() {
  yield all([
    yield takeLatest(
      createConditionOfClassActions.request,
      createConditionOfClassSaga,
    ),
    yield takeLatest(
      getListConditionOfClassActions.request,
      getListConditionOfClassSaga,
    ),
    yield takeLatest(
      deleteConditionOfClassActions.request,
      deleteConditionOfClassSaga,
    ),
    yield takeLatest(
      getConditionOfClassDetailActions.request,
      getConditionOfClassDetailSaga,
    ),
    yield takeLatest(
      updateConditionOfClassActions.request,
      updateConditionOfClassSaga,
    ),
  ]);
}
