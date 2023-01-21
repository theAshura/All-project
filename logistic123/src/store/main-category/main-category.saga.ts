import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import {
  getListMainCategoryActionsApi,
  getMainCategoryDetailActionsApi,
  updateMainCategoryDetailActionsApi,
  deleteMainCategoryActionsApi,
  createMainCategoryActionsApi,
} from 'api/main-category.api';
import { State } from '../reducer';
import {
  getListMainCategoryActions,
  getMainCategoryDetailActions,
  updateMainCategoryActions,
  deleteMainCategoryActions,
  createMainCategoryActions,
} from './main-category.action';

function* getListMainCategorySaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListMainCategoryActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListMainCategoryActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListMainCategoryActions.failure());
  }
}

function* deleteMainCategorySaga(action) {
  try {
    const { params, listMainCategories } = yield select(
      (state: State) => state.mainCategory,
    );
    yield call(deleteMainCategoryActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listMainCategories.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteMainCategoryActions.success(newParams));
    action.payload?.getListMainCategory();
  } catch (e) {
    toastError(e);
    yield put(deleteMainCategoryActions.failure());
  }
}

function* createMainCategorySaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createMainCategoryActionsApi, other);
    yield put(createMainCategoryActions.success());
    yield put(getListMainCategoryActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createMainCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createMainCategoryActions.failure(undefined));
    }
  }
}

function* getMainCategoryDetailSaga(action) {
  try {
    const response = yield call(
      getMainCategoryDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getMainCategoryDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.MAIN_CATEGORY);
    }
    toastError(e);
    yield put(getMainCategoryDetailActions.failure());
  }
}

function* updateMainCategorySaga(action) {
  try {
    yield call(updateMainCategoryDetailActionsApi, action.payload);
    yield put(updateMainCategoryActions.success());
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateMainCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateMainCategoryActions.failure(undefined));
    }
  }
}

export default function* MainCategorySaga() {
  yield all([
    yield takeLatest(deleteMainCategoryActions.request, deleteMainCategorySaga),
    yield takeLatest(
      getListMainCategoryActions.request,
      getListMainCategorySaga,
    ),
    yield takeLatest(createMainCategoryActions.request, createMainCategorySaga),
    yield takeLatest(
      getMainCategoryDetailActions.request,
      getMainCategoryDetailSaga,
    ),
    yield takeLatest(updateMainCategoryActions.request, updateMainCategorySaga),
  ]);
}
