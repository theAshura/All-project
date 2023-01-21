import { AppTypePropertyState } from 'models/store/app-type-property/app-type-property.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsAppTypePropertyReducer,
  clearAppTypePropertyErrorsReducer,
  clearAppTypePropertyReducer,
  createAppTypePropertyActions,
  deleteAppTypePropertyActions,
  getListAppTypePropertyActions,
  getAppTypePropertyDetailActions,
  updateAppTypePropertyActions,
  updateParamsActions,
} from './app-type-property.action';

const INITIAL_STATE: AppTypePropertyState = {
  loading: false,
  disable: false,
  listAppTypeProperty: null,
  appTypePropertyDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const AppTypePropertyReducer = createReducer<AppTypePropertyState>(
  INITIAL_STATE,
)
  .handleAction(
    getListAppTypePropertyActions.request,
    (state, { payload }) => ({
      ...state,
      params: payload,
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListAppTypePropertyActions.success,
    (state, { payload }) => ({
      ...state,
      listAppTypeProperty: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getListAppTypePropertyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteAppTypePropertyActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteAppTypePropertyActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deleteAppTypePropertyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createAppTypePropertyActions.request, (state, { payload }) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createAppTypePropertyActions.success, (state, { payload }) => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createAppTypePropertyActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(
    getAppTypePropertyDetailActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
    }),
  )
  .handleAction(
    getAppTypePropertyDetailActions.success,
    (state, { payload }) => ({
      ...state,
      appTypePropertyDetail: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getAppTypePropertyDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateAppTypePropertyActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateAppTypePropertyActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateAppTypePropertyActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(clearAppTypePropertyReducer, (state) => ({
    ...INITIAL_STATE,
  }))
  .handleAction(clearParamsAppTypePropertyReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }))
  .handleAction(clearAppTypePropertyErrorsReducer, (state) => ({
    ...state,
    errorList: [],
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }));

export default AppTypePropertyReducer;
