import { SecondCategoryStoreModel } from 'models/store/second-category/second-category.model';
import { createReducer } from 'typesafe-actions';
import {
  getListSecondCategoryActions,
  getSecondCategoryDetailActions,
  updateSecondCategoryActions,
  createSecondCategoryActions,
  deleteSecondCategoryActions,
  clearSecondCategoryErrorsReducer,
  getListSecondCategoryByMainIdActions,
  clearSecondCategoryReducer,
  updateParamsActions,
} from './second-category.action';

const INITIAL_STATE: SecondCategoryStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listSecondCategories: undefined,
  secondCategoryDetail: null,
  errorList: undefined,
};

const secondCategoryReducer = createReducer<SecondCategoryStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListSecondCategoryActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListSecondCategoryActions.success, (state, { payload }) => ({
    ...state,
    listSecondCategories: payload,
    loading: false,
  }))
  .handleAction(getListSecondCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(
    getListSecondCategoryByMainIdActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListSecondCategoryByMainIdActions.success,
    (state, { payload }) => ({
      ...state,
      listSecondCategories: {
        data: payload,
        page: 1,
        pageSize: payload?.length,
        totalPage: 1,
        totalItem: payload?.length,
      },
      loading: false,
    }),
  )
  .handleAction(getListSecondCategoryByMainIdActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteSecondCategoryActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteSecondCategoryActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteSecondCategoryActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateSecondCategoryActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateSecondCategoryActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateSecondCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createSecondCategoryActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createSecondCategoryActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createSecondCategoryActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getSecondCategoryDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getSecondCategoryDetailActions.success,
    (state, { payload }) => ({
      ...state,
      secondCategoryDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getSecondCategoryDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearSecondCategoryErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearSecondCategoryReducer, () => ({
    ...INITIAL_STATE,
  }));

export default secondCategoryReducer;
