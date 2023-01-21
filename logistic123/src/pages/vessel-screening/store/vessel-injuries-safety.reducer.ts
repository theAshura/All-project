import { createReducer } from 'typesafe-actions';
import { VesselInjuriesSafetyStoreModel } from '../utils/models/injuries-safety.model';
import {
  getListVesselScreeningInjuriesSafetyActions,
  updateInjuriesSafetyParamsActions,
  clearVesselInjuriesSafetyErrorsReducer,
  setInjuriesSafetyDataFilterAction,
  clearVesselInjuriesSafetyReducer,
  updateInjuriesSafetyRequestActions,
  getInjuriesSafetyRequestDetailActions,
} from './vessel-injuries-safety.action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: VesselInjuriesSafetyStoreModel = {
  loading: false,
  params: initParams,
  listInjuriesSafety: null,
  injuriesSafetyDetail: null,
  injuriesSafetyRequestDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const VesselInjuriesSafetyReducer =
  createReducer<VesselInjuriesSafetyStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselScreeningInjuriesSafetyActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselScreeningInjuriesSafetyActions.success,
      (state, { payload }) => ({
        ...state,
        listInjuriesSafety: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListVesselScreeningInjuriesSafetyActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(getInjuriesSafetyRequestDetailActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getInjuriesSafetyRequestDetailActions.success,
      (state, { payload }) => ({
        ...state,
        injuriesSafetyRequestDetail: payload,
        loading: false,
      }),
    )
    .handleAction(getInjuriesSafetyRequestDetailActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateInjuriesSafetyRequestActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateInjuriesSafetyRequestActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateInjuriesSafetyRequestActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )
    .handleAction(clearVesselInjuriesSafetyErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
    }))
    .handleAction(updateInjuriesSafetyParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
      dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
    }))
    .handleAction(clearVesselInjuriesSafetyReducer, (state, { payload }) => ({
      ...INITIAL_STATE,
      dataFilter: payload ? null : state?.dataFilter,
    }))
    .handleAction(setInjuriesSafetyDataFilterAction, (state, { payload }) => ({
      ...state,
      dataFilter: {
        ...payload,
        typeRange: payload?.dateFilter
          ? state.dataFilter?.typeRange
          : payload.typeRange,
      },
    }));

export default VesselInjuriesSafetyReducer;
