import { createReducer } from 'typesafe-actions';
import { VesselInternalInspectionStoreModel } from '../utils/models/internal-inspection.model';
import {
  getListVesselScreeningInternalInspectionActions,
  getVesselScreeningInternalInspectionDetailActions,
  updateInternalInspectionParamsActions,
  clearVesselInternalInspectionErrorsReducer,
  setInternalInspectionDataFilterAction,
  updateInternalInspectionRequestActions,
  clearVesselInternalInspectionReducer,
  getInternalInspectionRequestDetailActions,
} from './vessel-internal-inspection.action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: VesselInternalInspectionStoreModel = {
  loading: false,
  params: initParams,
  listInternalInspections: null,
  internalInspectionDetail: null,
  internalInspectionRequestDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const VesselInternalInspectionReducer =
  createReducer<VesselInternalInspectionStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningInternalInspectionActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningInternalInspectionActions.success,
      (state, { payload }) => ({
        ...state,
        listInternalInspections: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListVesselScreeningInternalInspectionActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      getVesselScreeningInternalInspectionDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getVesselScreeningInternalInspectionDetailActions.success,
      (state, { payload }) => ({
        ...state,
        internalInspectionDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getVesselScreeningInternalInspectionDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      getInternalInspectionRequestDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getInternalInspectionRequestDetailActions.success,
      (state, { payload }) => ({
        ...state,
        internalInspectionRequestDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getInternalInspectionRequestDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateInternalInspectionRequestActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateInternalInspectionRequestActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateInternalInspectionRequestActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )
    .handleAction(clearVesselInternalInspectionErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
    }))
    .handleAction(
      updateInternalInspectionParamsActions,
      (state, { payload }) => ({
        ...state,
        params: payload,
        dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
      }),
    )
    .handleAction(
      clearVesselInternalInspectionReducer,
      (state, { payload }) => ({
        ...INITIAL_STATE,
        dataFilter: payload ? null : state?.dataFilter,
      }),
    )
    .handleAction(
      setInternalInspectionDataFilterAction,
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

export default VesselInternalInspectionReducer;
