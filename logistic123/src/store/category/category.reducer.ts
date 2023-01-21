import { CategoryStoreModel } from 'models/store/category/category.model';
import { createReducer } from 'typesafe-actions';
import {
  getListCategoryActions,
  deleteCategoryActions,
  updateCategoryActions,
  createCategoryActions,
  getCategoryDetailActions,
  updateParamsActions,
  clearCategoryReducer,
  clearCategoryErrorsReducer,
} from './category.action';

const INITIAL_STATE: CategoryStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listCategorys: undefined,
  categoryDetail: null,
  errorList: undefined,
};

const categoryReducer = createReducer<CategoryStoreModel>(INITIAL_STATE)
  .handleAction(getListCategoryActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListCategoryActions.success, (state, { payload }) => ({
    ...state,
    listCategorys: payload,
    loading: false,
  }))
  .handleAction(getListCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteCategoryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCategoryActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateCategoryActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateCategoryActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createCategoryActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createCategoryActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getCategoryDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCategoryDetailActions.success, (state, { payload }) => ({
    ...state,
    categoryDetail: payload,
    loading: false,
  }))
  .handleAction(getCategoryDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCategoryErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearCategoryReducer, () => ({
    ...INITIAL_STATE,
  }));

export default categoryReducer;
