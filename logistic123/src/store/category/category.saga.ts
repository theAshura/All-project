import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import {
  Category,
  CategoryExtend1,
  CreateCategoryParams,
} from 'models/api/category/category.model';
import { State } from '../reducer';
import {
  getCategoryDetailActions,
  getListCategoryActions,
  updateCategoryActions,
  deleteCategoryActions,
  createCategoryActions,
} from './category.action';
import {
  getCategoryDetailActionsApi,
  getListCategorysActionsApi,
  deleteCategoryActionsApi,
  createCategoryActionsApi,
  updateCategoryPermissionDetailActionsApi,
  getListCategoryByIdsApi,
  //  from 'api/category.api';
} from '../../api/category.api';

function* getListCategorysSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;
    const response = yield call(getListCategorysActionsApi, other);
    const { data } = response;
    const ids: string[] = data?.data?.map((item) => item.id);
    if (ids.length > 0 && (other?.content || other?.status || other?.sort)) {
      const responseCategoryByIds = yield call(getListCategoryByIdsApi, ids);

      let newData: CategoryExtend1[] = [];
      responseCategoryByIds.data?.forEach((item) => {
        const { children, parent } = item;
        newData = [...newData, item];

        children?.forEach((t) => {
          newData = [...newData, t];
          const children1 = t.children;
          children1?.forEach((child) => {
            newData = [...newData, child];
          });
        });
        if (parent) {
          newData = [...newData, parent];
          const parent1 = parent?.parent;
          if (parent1) {
            newData = [...newData, parent1];
          }
        }
      });
      const newCategory: Category[] = newData.map((i) => {
        const { children, parent, ...otherCategory } = i;
        return otherCategory;
      });
      let newCategoryFilter: Category[] = [];
      newCategory.forEach((item) => {
        if (!newCategoryFilter.some((i) => i.id === item.id)) {
          newCategoryFilter = [...newCategoryFilter, item];
        }
      });
      yield put(getListCategoryActions.success(newCategoryFilter || []));
    } else {
      yield put(getListCategoryActions.success(data?.data || []));
    }
  } catch (e) {
    toastError(e);
    yield put(getListCategoryActions.failure());
  }
}

function* deleteCategorysSaga(action) {
  try {
    const { params, listCategorys } = yield select(
      (state: State) => state.category,
    );
    yield call(deleteCategoryActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCategorys.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');

    yield put(deleteCategoryActions.success(newParams));
    action.payload?.getListCategory();
  } catch (e) {
    toastError(e);
    yield put(deleteCategoryActions.failure());
  }
}

function* createCategorySaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: CreateCategoryParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createCategoryActionsApi, params);
    yield put(createCategoryActions.success());
    toastSuccess('You have created successfully');
    if (!isNew) {
      history.push(AppRouteConst.CATEGORY);
    } else {
      action.payload?.resetForm();
    }
    // history.push(AppRouteConst.CATEGORY);
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createCategoryActions.failure(undefined));
    }
  }
}

function* getCategoryDetailSaga(action) {
  try {
    const response = yield call(getCategoryDetailActionsApi, action.payload);
    const responseCategory = yield call(getListCategorysActionsApi, {
      page: 1,
      pageSize: -1,
      levels: '1,2',
    });
    const { data } = response;

    yield put(
      getListCategoryActions.success(responseCategory?.data?.data || []),
    );
    yield put(getCategoryDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.CATEGORY);
    }
    toastError(e);
    yield put(getCategoryDetailActions.failure());
  }
}

function* updateCategorySaga(action) {
  try {
    yield call(updateCategoryPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.CATEGORY);
    yield put(updateCategoryActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateCategoryActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateCategoryActions.failure(undefined));
    }
  }
}

export default function* CategoryAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteCategoryActions.request, deleteCategorysSaga),
    yield takeLatest(getListCategoryActions.request, getListCategorysSaga),
    yield takeLatest(createCategoryActions.request, createCategorySaga),
    yield takeLatest(getCategoryDetailActions.request, getCategoryDetailSaga),
    yield takeLatest(updateCategoryActions.request, updateCategorySaga),
  ]);
}
