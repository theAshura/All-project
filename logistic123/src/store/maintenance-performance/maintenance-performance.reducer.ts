import { MaintenanceTechnicalStoreModel } from 'models/store/maintenance-performance/maintenance-performance.model';
import { createReducer } from 'typesafe-actions';
import {
  getListMaintenancePerformanceActions,
  createMaintenancePerformanceActions,
  deleteMaintenancePerformanceActions,
  getDetailMaintenancePerformance,
  clearMaintenancePerformance,
  updateMaintenancePerformanceActions,
  setDataFilterAction,
  updateParamsActions,
} from './maintenance-performance.action';

const INITIAL_STATE: MaintenanceTechnicalStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  listMaintenancePerformance: null,
  detailMaintenancePerformance: null,
  dataFilter: null,
  errorLists: undefined,
  // TODO: template
  content: null,
  errorListTemplate: null,
  paramTemplate: null,
  listTemplate: null,
  templateDetail: null,
};

const maintenancePerformanceReducer =
  createReducer<MaintenanceTechnicalStoreModel>(INITIAL_STATE)
    .handleAction(
      getListMaintenancePerformanceActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListMaintenancePerformanceActions.success,
      (state, { payload }) => ({
        ...state,
        listMaintenancePerformance: payload,
        loading: false,
      }),
    )
    .handleAction(getListMaintenancePerformanceActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      deleteMaintenancePerformanceActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      deleteMaintenancePerformanceActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(deleteMaintenancePerformanceActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      getDetailMaintenancePerformance.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getDetailMaintenancePerformance.success,
      (state, { payload }) => ({
        ...state,
        detailMaintenancePerformance: payload,
        loading: false,
      }),
    )
    .handleAction(getDetailMaintenancePerformance.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      createMaintenancePerformanceActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      createMaintenancePerformanceActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(createMaintenancePerformanceActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateMaintenancePerformanceActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateMaintenancePerformanceActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(updateMaintenancePerformanceActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(clearMaintenancePerformance, (state) => ({
      ...state,
      detailMaintenancePerformance: null,
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

    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
    }));

export default maintenancePerformanceReducer;
