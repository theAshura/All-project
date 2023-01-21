import { StandardMasterStoreModel } from 'models/store/standard-master/standard-master.model';
import { createReducer } from 'typesafe-actions';
import {
  getListStandardMasterActions,
  deleteStandardMasterActions,
  updateStandardMasterActions,
  createStandardMasterActions,
  getStandardMasterDetailActions,
  clearStandardMasterReducer,
  updateParamsActions,
  clearStandardMasterErrorsReducer,
  setDataFilterAction,
} from './standard-master.action';

const INITIAL_STATE: StandardMasterStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  dataFilter: null,

  listStandardMasters: undefined,
  standardMasterDetail: null,
  errorList: undefined,
};

const standardMasterReducer = createReducer<StandardMasterStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListStandardMasterActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListStandardMasterActions.success, (state, { payload }) => ({
    ...state,
    listStandardMasters: payload,
    loading: false,
  }))
  .handleAction(getListStandardMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteStandardMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteStandardMasterActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteStandardMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateStandardMasterActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateStandardMasterActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateStandardMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createStandardMasterActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createStandardMasterActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createStandardMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getStandardMasterDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getStandardMasterDetailActions.success,
    (state, { payload }) => ({
      ...state,
      standardMasterDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getStandardMasterDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearStandardMasterErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(setDataFilterAction, (state, { payload }) => ({
    ...state,
    dataFilter: {
      ...payload,
      typeRange: payload?.dateFilter
        ? state.dataFilter?.typeRange
        : payload.typeRange,
    },
  }))

  .handleAction(clearStandardMasterReducer, () => ({
    ...INITIAL_STATE,
  }));

export default standardMasterReducer;
