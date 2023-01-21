import { createReducer } from 'typesafe-actions';
import { VesselOtherSMSStoreModel } from '../utils/models/other-sms.model';
import {
  getListVesselScreeningOtherSMSActions,
  updateOtherSMSParamsActions,
  clearVesselOtherSMSErrorsReducer,
  setOtherSMSDataFilterAction,
  clearVesselOtherSMSReducer,
  updateOtherSMSRequestActions,
  getOtherSMSRequestDetailActions,
} from './vessel-other-sms.action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: VesselOtherSMSStoreModel = {
  loading: false,
  params: initParams,
  listOtherSMS: null,
  otherSMSRequestDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const VesselOtherSMSReducer = createReducer<VesselOtherSMSStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListVesselScreeningOtherSMSActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListVesselScreeningOtherSMSActions.success,
    (state, { payload }) => ({
      ...state,
      listOtherSMS: payload,
      loading: false,
    }),
  )
  .handleAction(getListVesselScreeningOtherSMSActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getOtherSMSRequestDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getOtherSMSRequestDetailActions.success,
    (state, { payload }) => ({
      ...state,
      otherSMSRequestDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getOtherSMSRequestDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateOtherSMSRequestActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateOtherSMSRequestActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateOtherSMSRequestActions.failure, (state, { payload }) => ({
    ...state,
    errors: payload,
    loading: false,
  }))
  .handleAction(clearVesselOtherSMSErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))
  .handleAction(updateOtherSMSParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))
  .handleAction(clearVesselOtherSMSReducer, (state, { payload }) => ({
    ...INITIAL_STATE,
    dataFilter: payload ? null : state?.dataFilter,
  }))
  .handleAction(setOtherSMSDataFilterAction, (state, { payload }) => ({
    ...state,
    dataFilter: {
      ...payload,
      typeRange: payload?.dateFilter
        ? state.dataFilter?.typeRange
        : payload.typeRange,
    },
  }));

export default VesselOtherSMSReducer;
