import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import {
  getCategoryMappingDetailActions,
  getListCategoryMappingActions,
  updateCategoryMappingActions,
  createCategoryMappingActions,
} from './category-mapping.action';
import {
  getCategoryMappingDetailActionsApi,
  getListCategoryMappingsActionsApi,
  createCategoryMappingActionsApi,
  updateCategoryMappingPermissionDetailActionsApi,
} from '../../api/category-mapping.api';

function* getListCategoryMappingsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListCategoryMappingsActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListCategoryMappingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCategoryMappingActions.failure());
  }
}

function* createCategoryMappingSaga(action) {
  try {
    const { isNew, resetForm, ...other } = action.payload;

    yield call(createCategoryMappingActionsApi, other);
    yield put(createCategoryMappingActions.success());
    toastSuccess('You have created successfully');
    action.payload?.afterCreate();
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createCategoryMappingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createCategoryMappingActions.failure(undefined));
    }
  }
}

function* getCategoryMappingDetailSaga(action) {
  try {
    const response = yield call(
      getCategoryMappingDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getCategoryMappingDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.CATEGORY_MAPPING);
    }
    toastError(e);
    yield put(getCategoryMappingDetailActions.failure());
  }
}

function* updateCategoryMappingSaga(action) {
  try {
    yield call(updateCategoryMappingPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();
    yield put(updateCategoryMappingActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateCategoryMappingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateCategoryMappingActions.failure(undefined));
    }
  }
}

export default function* CategoryMappingAndPermissionSaga() {
  yield all([
    yield takeLatest(
      getListCategoryMappingActions.request,
      getListCategoryMappingsSaga,
    ),
    yield takeLatest(
      createCategoryMappingActions.request,
      createCategoryMappingSaga,
    ),
    yield takeLatest(
      getCategoryMappingDetailActions.request,
      getCategoryMappingDetailSaga,
    ),
    yield takeLatest(
      updateCategoryMappingActions.request,
      updateCategoryMappingSaga,
    ),
  ]);
}
