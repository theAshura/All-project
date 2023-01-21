import { PortStateControlStoreModel } from 'models/store/port-state-control/port-state-control.model';
import { createReducer } from 'typesafe-actions';
import {
  getListPortStateControlActions,
  deletePortStateControlActions,
  updatePortStateControlActions,
  createPortStateControlActions,
  getPortStateControlDetailActions,
  clearPortStateControlReducer,
  updateParamsActions,
  clearPortStateControlErrorsReducer,
  setDataFilterAction,
} from './port-state-control.action';

const INITIAL_STATE: PortStateControlStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  dataFilter: null,

  listPortStateControls: undefined,
  portStateControlDetail: null,
  errorList: undefined,
};

const PortStateControlReducer = createReducer<PortStateControlStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListPortStateControlActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListPortStateControlActions.success,
    (state, { payload }) => ({
      ...state,
      listPortStateControls: payload,
      loading: false,
    }),
  )
  .handleAction(getListPortStateControlActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deletePortStateControlActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deletePortStateControlActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deletePortStateControlActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updatePortStateControlActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updatePortStateControlActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updatePortStateControlActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(createPortStateControlActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createPortStateControlActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(
    createPortStateControlActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(getPortStateControlDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getPortStateControlDetailActions.success,
    (state, { payload }) => ({
      ...state,
      portStateControlDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getPortStateControlDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearPortStateControlErrorsReducer, (state) => ({
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

  .handleAction(clearPortStateControlReducer, () => ({
    ...INITIAL_STATE,
  }));

export default PortStateControlReducer;
