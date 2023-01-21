import { createReducer } from 'typesafe-actions';
import {
  getListStandardMasterActions,
  getStandardMasterDetailActions,
  getListStandardMasterNoElementActions,
  getListElementMasterActions,
  deleteStandardMasterActions,
  setDataFilterAction,
  updateParamsActions,
  clearElementMasterReducer,
  clearElementMasterErrorsReducer,
  updateElementMasterActions,
} from './element-master.action';
import { ElementMasterStoreModel } from '../../models/store/element-master/element-master.model';

const initParams = {
  isLeftMenu: false,
};

const INITIAL_STATE: ElementMasterStoreModel = {
  loading: false,
  disable: false,
  params: initParams,
  listStandardMasters: undefined,
  listStandardNoElements: undefined,
  standardMasterDetail: null,
  listElementMasters: undefined,
  elementMasterDetail: null,
  errorList: undefined,
  dataFilter: null,
};
const ElementMasterReducer = createReducer<ElementMasterStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListStandardMasterActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading:
      payload?.isRefreshLoading === false || payload?.isRefreshLoading
        ? payload?.isRefreshLoading
        : true,
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
  .handleAction(getListStandardMasterNoElementActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getListStandardMasterNoElementActions.success,
    (state, { payload }) => ({
      ...state,
      listStandardNoElements: payload,
      loading: false,
    }),
  )
  .handleAction(getListStandardMasterNoElementActions.failure, (state) => ({
    ...state,
    loading: false,
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
  .handleAction(deleteStandardMasterActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(deleteStandardMasterActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteStandardMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))
  .handleAction(getListElementMasterActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: true,
  }))
  .handleAction(getListElementMasterActions.success, (state, { payload }) => ({
    ...state,
    listElementMasters: payload,
    loading: false,
  }))
  .handleAction(getListElementMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateElementMasterActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateElementMasterActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateElementMasterActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))
  .handleAction(clearElementMasterErrorsReducer, (state) => ({
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
  .handleAction(clearElementMasterReducer, () => ({
    ...INITIAL_STATE,
  }));

export default ElementMasterReducer;
