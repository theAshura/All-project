import { VesselDryDockingStoreModel } from 'pages/vessel-screening/utils/models/common.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselScreeningDryDockingErrorsReducer,
  getListVesselScreeningDryDockingActions,
  updateVesselScreeningDryDockingActions,
  updateParamsActions,
  clearVesselScreeningDryDockingReducer,
  setDataFilterAction,
} from './vessel-dry-docking.action';

const INITIAL_STATE: VesselDryDockingStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  list: null,
  dataFilter: null,
  errors: undefined,
};

const vesselDryDockingPerformanceReducer =
  createReducer<VesselDryDockingStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningDryDockingActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningDryDockingActions.success,
      (state, { payload }) => ({
        ...state,
        list: payload,
        loading: false,
      }),
    )
    .handleAction(getListVesselScreeningDryDockingActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(
      updateVesselScreeningDryDockingActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateVesselScreeningDryDockingActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateVesselScreeningDryDockingActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )

    .handleAction(clearVesselScreeningDryDockingErrorsReducer, (state) => ({
      ...state,
      errors: undefined,
    }))
    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
      dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
    }))
    .handleAction(
      clearVesselScreeningDryDockingReducer,
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

export default vesselDryDockingPerformanceReducer;
