import { createReducer } from 'typesafe-actions';
import { ValueManagementStoreModel } from '../utils/model';
import {
  getListValueManagementActions,
  deleteValueManagementActions,
  updateValueManagementActions,
  createValueManagementActions,
  getValueManagementDetailActions,
  clearValueManagementReducer,
  clearValueManagementErrorsReducer,
  clearValueManagementParamsReducer,
} from './action';

const INITIAL_STATE: ValueManagementStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listValueManagements: undefined,
  valueManagementDetail: null,
  errorList: undefined,
};

const ValueManagementReducer = createReducer<ValueManagementStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListValueManagementActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListValueManagementActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      listValueManagements: payload,
    }),
  )
  .handleAction(getListValueManagementActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteValueManagementActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteValueManagementActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteValueManagementActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateValueManagementActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateValueManagementActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateValueManagementActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createValueManagementActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createValueManagementActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createValueManagementActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getValueManagementDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getValueManagementDetailActions.success,
    (state, { payload }) => ({
      ...state,
      valueManagementDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getValueManagementDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearValueManagementErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearValueManagementParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearValueManagementReducer, () => ({
    ...INITIAL_STATE,
  }));

export default ValueManagementReducer;
