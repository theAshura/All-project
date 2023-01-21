import { VesselIncidentInvestigationStoreModel } from 'pages/vessel-screening/utils/models/common.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselScreeningIncidentInvestigationErrorsReducer,
  getListVesselScreeningIncidentInvestigationActions,
  updateVesselScreeningIncidentInvestigationActions,
  updateParamsActions,
  clearVesselScreeningIncidentInvestigationReducer,
  setDataFilterAction,
} from './vessel-incident-investigation.action';

const INITIAL_STATE: VesselIncidentInvestigationStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  list: null,
  dataFilter: null,
  errors: undefined,
};

const vesselIncidentInvestigationPerformanceReducer =
  createReducer<VesselIncidentInvestigationStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningIncidentInvestigationActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningIncidentInvestigationActions.success,
      (state, { payload }) => ({
        ...state,
        list: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListVesselScreeningIncidentInvestigationActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(
      updateVesselScreeningIncidentInvestigationActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateVesselScreeningIncidentInvestigationActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateVesselScreeningIncidentInvestigationActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )

    .handleAction(
      clearVesselScreeningIncidentInvestigationErrorsReducer,
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
      clearVesselScreeningIncidentInvestigationReducer,
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

export default vesselIncidentInvestigationPerformanceReducer;
