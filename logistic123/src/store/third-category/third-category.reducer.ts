import { ThirdCategoryStoreModel } from 'models/store/third-category/third-category.model';
import { createReducer } from 'typesafe-actions';
import {
  getListThirdCategoryActions,
  getThirdCategoryDetailActions,
  updateThirdCategoryActions,
  createThirdCategoryActions,
  deleteThirdCategoryActions,
  clearThirdCategoryErrorsReducer,
  clearThirdCategoryReducer,
  updateParamsActions,
} from './third-category.action';

const INITIAL_STATE: ThirdCategoryStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listThirdCategories: undefined,
  thirdCategoryDetail: null,
  errorList: undefined,
};

const thirdCategoryReducer = createReducer<ThirdCategoryStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListThirdCategoryActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListThirdCategoryActions.success, (state, { payload }) => ({
    ...state,
    listThirdCategories: payload,
    loading: false,
  }))
  .handleAction(getListThirdCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteThirdCategoryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteThirdCategoryActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteThirdCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateThirdCategoryActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateThirdCategoryActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateThirdCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createThirdCategoryActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createThirdCategoryActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createThirdCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getThirdCategoryDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getThirdCategoryDetailActions.success,
    (state, { payload }) => ({
      ...state,
      thirdCategoryDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getThirdCategoryDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearThirdCategoryErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearThirdCategoryReducer, () => ({
    ...INITIAL_STATE,
  }));

export default thirdCategoryReducer;
