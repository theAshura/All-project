import { ExternalStoreModel } from 'models/store/external/external.model';
import { createReducer } from 'typesafe-actions';
import {
  clearExternalAction,
  createExternalActions,
  deleteExternalActions,
  getDetailExternal,
  getLisExternalActions,
  updateExternalActions,
} from './external.action';

const INITIAL_STATE: ExternalStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  listExternal: null,
  detailExternal: null,
  dataFilter: null,
  errorList: undefined,
};

const externalReducer = createReducer<ExternalStoreModel>(INITIAL_STATE)
  .handleAction(getLisExternalActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getLisExternalActions.success, (state, { payload }) => ({
    ...state,
    listExternal: payload,
    loading: false,
  }))
  .handleAction(getLisExternalActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteExternalActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteExternalActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteExternalActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getDetailExternal.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getDetailExternal.success, (state, { payload }) => ({
    ...state,
    detailExternal: payload,
    loading: false,
  }))
  .handleAction(getDetailExternal.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createExternalActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createExternalActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createExternalActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateExternalActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateExternalActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateExternalActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearExternalAction, (state) => ({
    ...state,
  }));

export default externalReducer;
