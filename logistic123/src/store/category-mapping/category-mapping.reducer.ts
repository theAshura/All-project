import { CategoryMappingStoreModel } from 'models/store/category-mapping/category-mapping.model';
import { createReducer } from 'typesafe-actions';
import {
  getListCategoryMappingActions,
  deleteCategoryMappingActions,
  updateCategoryMappingActions,
  createCategoryMappingActions,
  getCategoryMappingDetailActions,
  clearCategoryMappingReducer,
  updateParamsActions,
  clearCategoryMappingErrorsReducer,
} from './category-mapping.action';

const INITIAL_STATE: CategoryMappingStoreModel = {
  loading: true,
  params: { isLeftMenu: false },

  listCategoryMappings: undefined,
  categoryMappingDetail: undefined,
  errorList: undefined,
};

const CategoryMappingReducer = createReducer<CategoryMappingStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListCategoryMappingActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListCategoryMappingActions.success,
    (state, { payload }) => ({
      ...state,
      listCategoryMappings: payload,
      loading: false,
    }),
  )
  .handleAction(getListCategoryMappingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteCategoryMappingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCategoryMappingActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteCategoryMappingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateCategoryMappingActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateCategoryMappingActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCategoryMappingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createCategoryMappingActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createCategoryMappingActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createCategoryMappingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getCategoryMappingDetailActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    getCategoryMappingDetailActions.success,
    (state, { payload }) => ({
      ...state,
      categoryMappingDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getCategoryMappingDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCategoryMappingErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearCategoryMappingReducer, () => ({
    ...INITIAL_STATE,
  }));

export default CategoryMappingReducer;
