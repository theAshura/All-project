import { InspectorTimeOffStoreModel } from 'models/store/inspector-time-off/inspector-time-off.model';
import { createReducer } from 'typesafe-actions';
import {
  getListInspectorTimeOffActions,
  updateParamsActions,
  deleteInspectorTimeOffActions,
  updateInspectorTimeOffActions,
  createInspectorTimeOffActions,
  getInspectorTimeOffDetailActions,
  clearInspectorTimeOffReducer,
  clearInspectorTimeOffErrorsReducer,
  clearInspectorTimeOffParamsReducer,
} from './inspector-time-off.action';

const INITIAL_STATE: InspectorTimeOffStoreModel = {
  loading: true,
  params: { isLeftMenu: false },
  listInspectorTimeOffs: undefined,
  InspectorTimeOffDetail: null,
  errorList: undefined,
};

const fleetReducer = createReducer<InspectorTimeOffStoreModel>(INITIAL_STATE)
  .handleAction(
    getListInspectorTimeOffActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListInspectorTimeOffActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      listInspectorTimeOffs: payload,
    }),
  )
  .handleAction(getListInspectorTimeOffActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteInspectorTimeOffActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deleteInspectorTimeOffActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deleteInspectorTimeOffActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateInspectorTimeOffActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateInspectorTimeOffActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateInspectorTimeOffActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(createInspectorTimeOffActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createInspectorTimeOffActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(
    createInspectorTimeOffActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(getInspectorTimeOffDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getInspectorTimeOffDetailActions.success,
    (state, { payload }) => ({
      ...state,
      InspectorTimeOffDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getInspectorTimeOffDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearInspectorTimeOffErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearInspectorTimeOffParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearInspectorTimeOffReducer, () => ({
    ...INITIAL_STATE,
  }));

export default fleetReducer;
