import { NatureOfFindingsMasterState } from 'models/store/nature-of-findings-master/nature-of-findings-master.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsNatureOfFindingsMasterReducer,
  clearNatureOfFindingsMasterErrorsReducer,
  clearNatureOfFindingsMasterReducer,
  createNatureOfFindingsMasterActions,
  deleteNatureOfFindingsMasterActions,
  getListNatureOfFindingsMasterActions,
  getNatureOfFindingsMasterDetailActions,
  updateNatureOfFindingsMasterActions,
  updateParamsActions,
} from './nature-of-findings-master.action';

const INITIAL_STATE: NatureOfFindingsMasterState = {
  loading: false,
  disable: false,
  listNatureOfFindingsMaster: null,
  NatureOfFindingsMasterDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const NatureOfFindingsMasterReducer =
  createReducer<NatureOfFindingsMasterState>(INITIAL_STATE)
    .handleAction(
      getListNatureOfFindingsMasterActions.request,
      (state, { payload }) => ({
        ...state,
        params: payload,
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListNatureOfFindingsMasterActions.success,
      (state, { payload }) => ({
        ...state,
        listNatureOfFindingsMaster: payload,
        errorList: [],
        loading: false,
      }),
    )
    .handleAction(getListNatureOfFindingsMasterActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(deleteNatureOfFindingsMasterActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      deleteNatureOfFindingsMasterActions.success,
      (state, { payload }) => ({
        ...state,
        errorList: [],
        params: payload,
        loading: false,
      }),
    )
    .handleAction(deleteNatureOfFindingsMasterActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(createNatureOfFindingsMasterActions.request, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(createNatureOfFindingsMasterActions.success, () => ({
      ...INITIAL_STATE,
    }))
    .handleAction(
      createNatureOfFindingsMasterActions.failure,
      (state, { payload }) => ({
        ...state,
        errorList: payload,
        loading: false,
      }),
    )
    .handleAction(getNatureOfFindingsMasterDetailActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getNatureOfFindingsMasterDetailActions.success,
      (state, { payload }) => ({
        ...state,
        NatureOfFindingsMasterDetail: payload,
        errorList: [],
        loading: false,
      }),
    )
    .handleAction(getNatureOfFindingsMasterDetailActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(updateNatureOfFindingsMasterActions.request, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(updateNatureOfFindingsMasterActions.success, (state) => ({
      ...state,
      errorList: [],
      loading: false,
    }))
    .handleAction(
      updateNatureOfFindingsMasterActions.failure,
      (state, { payload }) => ({
        ...state,
        errorList: payload,
        loading: false,
      }),
    )
    .handleAction(clearNatureOfFindingsMasterReducer, () => ({
      ...INITIAL_STATE,
    }))
    .handleAction(clearParamsNatureOfFindingsMasterReducer, (state) => ({
      ...state,
      params: { isLeftMenu: false },
    }))

    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
    }))

    .handleAction(clearNatureOfFindingsMasterErrorsReducer, (state) => ({
      ...state,
      errorList: [],
    }));

export default NatureOfFindingsMasterReducer;
