import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
// import history from 'helpers/history.helper';
// import { AppRouteConst } from 'constants/route.const';

import { CreateThirdCategoryParams } from 'models/api/third-category/third-category.model';
import {
  getListThirdCategoryActionsApi,
  deleteThirdCategoryActionsApi,
  createThirdCategoryActionsApi,
  getThirdCategoryDetailActionsApi,
  updateThirdCategoryDetailActionsApi,
} from 'api/third-category.api';
import { State } from '../reducer';
import {
  getListThirdCategoryActions,
  getThirdCategoryDetailActions,
  updateThirdCategoryActions,
  deleteThirdCategoryActions,
  createThirdCategoryActions,
} from './third-category.action';

function* getListThirdCategorySaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListThirdCategoryActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListThirdCategoryActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListThirdCategoryActions.failure());
  }
}

function* deleteThirdCategorySaga(action) {
  try {
    const { params, listThirdCategories } = yield select(
      (state: State) => state.thirdCategory,
    );
    yield call(deleteThirdCategoryActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listThirdCategories.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteThirdCategoryActions.success(newParams));
    action.payload?.handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(deleteThirdCategoryActions.failure());
  }
}

function* createThirdCategorySaga(action) {
  try {
    const params: CreateThirdCategoryParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createThirdCategoryActionsApi, params);
    yield put(createThirdCategoryActions.success());
    toastSuccess('You have created successfully');
    action.payload?.afterCreate();
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createThirdCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createThirdCategoryActions.failure(undefined));
    }
  }
}

function* getThirdCategoryDetailSaga(action) {
  try {
    const response = yield call(
      getThirdCategoryDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getThirdCategoryDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getThirdCategoryDetailActions.failure());
  }
}

function* updateThirdCategorySaga(action) {
  try {
    yield call(updateThirdCategoryDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.handleSuccess?.();

    yield put(updateThirdCategoryActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateThirdCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateThirdCategoryActions.failure(undefined));
    }
  }
}

export default function* ThirdCategorySaga() {
  yield all([
    yield takeLatest(
      deleteThirdCategoryActions.request,
      deleteThirdCategorySaga,
    ),
    yield takeLatest(
      getListThirdCategoryActions.request,
      getListThirdCategorySaga,
    ),
    yield takeLatest(
      createThirdCategoryActions.request,
      createThirdCategorySaga,
    ),
    yield takeLatest(
      getThirdCategoryDetailActions.request,
      getThirdCategoryDetailSaga,
    ),
    yield takeLatest(
      updateThirdCategoryActions.request,
      updateThirdCategorySaga,
    ),
  ]);
}
