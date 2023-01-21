import { VesselOtherTechRecordsStoreModel } from 'pages/vessel-screening/utils/models/common.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselScreeningOtherTechRecordsErrorsReducer,
  getListVesselScreeningOtherTechRecordsActions,
  updateVesselScreeningOtherTechRecordsActions,
  updateParamsActions,
  clearVesselScreeningOtherTechRecordsReducer,
  setDataFilterAction,
} from './vessel-other-tech-records.action';

const INITIAL_STATE: VesselOtherTechRecordsStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  list: null,
  dataFilter: null,
  errors: undefined,
};

const vesselOtherTechRecordsPerformanceReducer =
  createReducer<VesselOtherTechRecordsStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningOtherTechRecordsActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningOtherTechRecordsActions.success,
      (state, { payload }) => ({
        ...state,
        list: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListVesselScreeningOtherTechRecordsActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(
      updateVesselScreeningOtherTechRecordsActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateVesselScreeningOtherTechRecordsActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateVesselScreeningOtherTechRecordsActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )

    .handleAction(
      clearVesselScreeningOtherTechRecordsErrorsReducer,
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
      clearVesselScreeningOtherTechRecordsReducer,
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

export default vesselOtherTechRecordsPerformanceReducer;
