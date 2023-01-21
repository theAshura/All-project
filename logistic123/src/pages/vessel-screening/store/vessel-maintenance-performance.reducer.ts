import { VesselMaintenanceStoreModel } from 'pages/vessel-screening/utils/models/common.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselScreeningMaintenanceErrorsReducer,
  getListVesselScreeningMaintenanceActions,
  updateVesselScreeningMaintenanceActions,
  updateParamsActions,
  clearVesselScreeningMaintenanceReducer,
  setDataFilterAction,
} from './vessel-maintenance-performance.action';

const INITIAL_STATE: VesselMaintenanceStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  list: null,
  dataFilter: null,
  errors: undefined,
};

const vesselMaintenancePerformanceReducer =
  createReducer<VesselMaintenanceStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningMaintenanceActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningMaintenanceActions.success,
      (state, { payload }) => ({
        ...state,
        list: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListVesselScreeningMaintenanceActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(
      updateVesselScreeningMaintenanceActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateVesselScreeningMaintenanceActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateVesselScreeningMaintenanceActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )

    .handleAction(clearVesselScreeningMaintenanceErrorsReducer, (state) => ({
      ...state,
      errors: undefined,
    }))
    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
      dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
    }))
    .handleAction(
      clearVesselScreeningMaintenanceReducer,
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

export default vesselMaintenancePerformanceReducer;
