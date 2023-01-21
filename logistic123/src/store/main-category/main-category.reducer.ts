import { MainCategoryStoreModel } from 'models/store/main-category/main-category.model';
import { createReducer } from 'typesafe-actions';
import {
  getListMainCategoryActions,
  getMainCategoryDetailActions,
  updateMainCategoryActions,
  createMainCategoryActions,
  deleteMainCategoryActions,
  clearMainCategoryErrorsReducer,
  clearMainCategoryReducer,
} from './main-category.action';

const INITIAL_STATE: MainCategoryStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listMainCategories: undefined,
  mainCategoryDetail: null,
  errorList: undefined,
};

const mainCategoryReducer = createReducer<MainCategoryStoreModel>(INITIAL_STATE)
  .handleAction(getListMainCategoryActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListMainCategoryActions.success, (state, { payload }) => ({
    ...state,
    listMainCategories: payload,
    loading: false,
  }))
  .handleAction(getListMainCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteMainCategoryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteMainCategoryActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteMainCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateMainCategoryActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateMainCategoryActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateMainCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createMainCategoryActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createMainCategoryActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createMainCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getMainCategoryDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getMainCategoryDetailActions.success, (state, { payload }) => ({
    ...state,
    mainCategoryDetail: payload,
    loading: false,
  }))
  .handleAction(getMainCategoryDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearMainCategoryErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearMainCategoryReducer, () => ({
    ...INITIAL_STATE,
  }));

export default mainCategoryReducer;
