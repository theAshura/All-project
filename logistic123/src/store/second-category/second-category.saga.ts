import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
// import history from 'helpers/history.helper';
// import { AppRouteConst } from 'constants/route.const';

import { CreateSecondCategoryParams } from 'models/api/second-category/second-category.model';
import {
  getListSecondCategoryActionsApi,
  deleteSecondCategoryActionsApi,
  createSecondCategoryActionsApi,
  getSecondCategoryDetailActionsApi,
  updateSecondCategoryDetailActionsApi,
  getListSecondCategoryByMainIdActionsApi,
} from 'api/second-category.api';
import { State } from '../reducer';
import {
  getListSecondCategoryActions,
  getListSecondCategoryByMainIdActions,
  getSecondCategoryDetailActions,
  updateSecondCategoryActions,
  deleteSecondCategoryActions,
  createSecondCategoryActions,
} from './second-category.action';

function* getListSecondCategorySaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListSecondCategoryActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListSecondCategoryActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListSecondCategoryActions.failure());
  }
}

function* getListSecondCategoryByMainIdSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListSecondCategoryByMainIdActionsApi, other);
    const { data } = response;
    yield put(getListSecondCategoryByMainIdActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListSecondCategoryByMainIdActions.failure());
  }
}

function* deleteSecondCategorySaga(action) {
  try {
    const { params, listSecondCategories } = yield select(
      (state: State) => state.secondCategory,
    );
    yield call(deleteSecondCategoryActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listSecondCategories.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteSecondCategoryActions.success(newParams));
    action.payload?.getListSecondCategory();
  } catch (e) {
    toastError(e);
    yield put(deleteSecondCategoryActions.failure());
  }
}

function* createSecondCategorySaga(action) {
  try {
    const params: CreateSecondCategoryParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createSecondCategoryActionsApi, params);
    yield put(createSecondCategoryActions.success());
    toastSuccess('You have created successfully');

    action.payload?.afterCreate();
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createSecondCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createSecondCategoryActions.failure(undefined));
    }
  }
}

function* getSecondCategoryDetailSaga(action) {
  try {
    const response = yield call(
      getSecondCategoryDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getSecondCategoryDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSecondCategoryDetailActions.failure());
  }
}

function* updateSecondCategorySaga(action) {
  try {
    yield call(updateSecondCategoryDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    yield put(updateSecondCategoryActions.success());
    action.payload?.afterUpdate();
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateSecondCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateSecondCategoryActions.failure(undefined));
    }
  }
}

export default function* SecondCategorySaga() {
  yield all([
    yield takeLatest(
      deleteSecondCategoryActions.request,
      deleteSecondCategorySaga,
    ),
    yield takeLatest(
      getListSecondCategoryByMainIdActions.request,
      getListSecondCategoryByMainIdSaga,
    ),
    yield takeLatest(
      getListSecondCategoryActions.request,
      getListSecondCategorySaga,
    ),
    yield takeLatest(
      createSecondCategoryActions.request,
      createSecondCategorySaga,
    ),
    yield takeLatest(
      getSecondCategoryDetailActions.request,
      getSecondCategoryDetailSaga,
    ),
    yield takeLatest(
      updateSecondCategoryActions.request,
      updateSecondCategorySaga,
    ),
  ]);
}
