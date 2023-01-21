import { createReducer } from 'typesafe-actions';
import { VesselExternalInspectionStoreModel } from '../utils/models/external-inspection.model';
import {
  getListVesselScreeningExternalInspectionActions,
  getVesselScreeningExternalInspectionDetailActions,
  updateExternalInspectionParamsActions,
  clearVesselExternalInspectionErrorsReducer,
  setExternalInspectionDataFilterAction,
  clearVesselExternalInspectionReducer,
  updateExternalInspectionRequestActions,
  getExternalInspectionRequestDetailActions,
} from './vessel-external-inspection.action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: VesselExternalInspectionStoreModel = {
  loading: false,
  params: initParams,
  listExternalInspections: null,
  externalInspectionDetail: null,
  externalInspectionRequestDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const VesselExternalInspectionReducer =
  createReducer<VesselExternalInspectionStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningExternalInspectionActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningExternalInspectionActions.success,
      (state, { payload }) => ({
        ...state,
        listExternalInspections: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListVesselScreeningExternalInspectionActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      getVesselScreeningExternalInspectionDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getVesselScreeningExternalInspectionDetailActions.success,
      (state, { payload }) => ({
        ...state,
        externalInspectionDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getVesselScreeningExternalInspectionDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      getExternalInspectionRequestDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getExternalInspectionRequestDetailActions.success,
      (state, { payload }) => ({
        ...state,
        externalInspectionRequestDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getExternalInspectionRequestDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateExternalInspectionRequestActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateExternalInspectionRequestActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateExternalInspectionRequestActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )
    .handleAction(clearVesselExternalInspectionErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
    }))
    .handleAction(
      updateExternalInspectionParamsActions,
      (state, { payload }) => ({
        ...state,
        params: payload,
        dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
      }),
    )
    .handleAction(
      clearVesselExternalInspectionReducer,
      (state, { payload }) => ({
        ...INITIAL_STATE,
        dataFilter: payload ? null : state?.dataFilter,
      }),
    )
    .handleAction(
      setExternalInspectionDataFilterAction,
      (state, { payload }) => ({
        ...state,
        dataFilter: {
          ...payload,
          typeRange: payload?.dateFilter
            ? state.dataFilter?.typeRange
            : payload.typeRange,
        },
      }),
    );

export default VesselExternalInspectionReducer;
