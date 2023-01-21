import { ConditionOfClassStoreModel } from 'models/store/condition-of-class/condition-of-class.model';
import { createReducer } from 'typesafe-actions';
import {
  createConditionOfClassActions,
  clearConditionOfClassReducer,
  clearConditionOfClassErrorsReducer,
  clearConditionOfClassParamsReducer,
  getListConditionOfClassActions,
  deleteConditionOfClassActions,
  updateConditionOfClassActions,
  getConditionOfClassDetailActions,
} from './condition-of-class.action';

const INITIAL_STATE: ConditionOfClassStoreModel = {
  loading: true,
  loadingCompany: false,
  disable: false,
  params: { isLeftMenu: false },
  errorList: undefined,
  dataFilter: null,
  listConditionOfClass: undefined,
  conditionOfClassDetail: null,
};

const conditionOfClassReducer = createReducer<ConditionOfClassStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListConditionOfClassActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListConditionOfClassActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      listConditionOfClass: payload,
    }),
  )
  .handleAction(getListConditionOfClassActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createConditionOfClassActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(
    createConditionOfClassActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      params: { isLeftMenu: false },
    }),
  )
  .handleAction(
    createConditionOfClassActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )
  .handleAction(deleteConditionOfClassActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deleteConditionOfClassActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deleteConditionOfClassActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateConditionOfClassActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateConditionOfClassActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateConditionOfClassActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )
  .handleAction(getConditionOfClassDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getConditionOfClassDetailActions.success,
    (state, { payload }) => ({
      ...state,
      conditionOfClassDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getConditionOfClassDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearConditionOfClassErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearConditionOfClassParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearConditionOfClassReducer, (state) => ({
    ...INITIAL_STATE,
  }));

export default conditionOfClassReducer;
