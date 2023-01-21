import { VesselPortStateControlStoreModel } from 'pages/vessel-screening/utils/models/common.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselScreeningPortStateControlErrorsReducer,
  getListVesselScreeningPortStateControlActions,
  updateVesselScreeningPortStateControlActions,
  updateParamsActions,
  clearVesselScreeningPortStateControlReducer,
  setDataFilterAction,
  getVesselPortStateControlRequestDetailActions,
} from './vessel-port-state-control.action';

const INITIAL_STATE: VesselPortStateControlStoreModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },
  list: null,
  portStateRequestDetail: null,
  dataFilter: null,
  errors: undefined,
};

const vesselPortStateControlPerformanceReducer =
  createReducer<VesselPortStateControlStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningPortStateControlActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningPortStateControlActions.success,
      (state, { payload }) => ({
        ...state,
        list: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListVesselScreeningPortStateControlActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      getVesselPortStateControlRequestDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getVesselPortStateControlRequestDetailActions.success,
      (state, { payload }) => ({
        ...state,
        portStateRequestDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getVesselPortStateControlRequestDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(
      updateVesselScreeningPortStateControlActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateVesselScreeningPortStateControlActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateVesselScreeningPortStateControlActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )

    .handleAction(
      clearVesselScreeningPortStateControlErrorsReducer,
      (state) => ({
        ...state,
        errors: undefined,
      }),
    )
    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
      dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
    }))
    .handleAction(
      clearVesselScreeningPortStateControlReducer,
      (state, { payload }) => ({
        ...state,
        dataFilter: payload ? null : state?.dataFilter,
      }),
    )
    .handleAction(setDataFilterAction, (state, { payload }) => ({
      ...state,
      dataFilter: {
        ...payload,
        typeRange: payload?.dateFilter
          ? state.dataFilter?.typeRange
          : payload.typeRange,
      },
    }));

export default vesselPortStateControlPerformanceReducer;
