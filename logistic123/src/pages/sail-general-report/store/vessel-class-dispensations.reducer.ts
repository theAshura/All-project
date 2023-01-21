import { VesselClassDispensationsStoreModel } from 'pages/vessel-screening/utils/models/vessel-class-dispensations.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselScreeningClassDispensationsErrorsReducer,
  clearVesselScreeningClassDispensationsReducer,
  getListVesselClassDispensationsActions,
  updateParamsActions,
  setDataFilterAction,
  updateVesselClassDispensationsActions,
} from './vessel-class-dispensations.action';

const INITIAL_STATE: VesselClassDispensationsStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  list: null,
  dataFilter: null,
  errors: undefined,
};

const vesselClassDispensationsReducer =
  createReducer<VesselClassDispensationsStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselClassDispensationsActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselClassDispensationsActions.success,
      (state, { payload }) => ({
        ...state,
        list: payload,
        loading: false,
      }),
    )
    .handleAction(getListVesselClassDispensationsActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateVesselClassDispensationsActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(updateVesselClassDispensationsActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateVesselClassDispensationsActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )

    .handleAction(
      clearVesselScreeningClassDispensationsErrorsReducer,
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
      clearVesselScreeningClassDispensationsReducer,
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

export default vesselClassDispensationsReducer;
