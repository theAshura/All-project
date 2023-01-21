import { createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import { VesselScreeningStoreModel } from '../utils/models/common.model';
import {
  getListVesselScreeningActions,
  createVesselScreeningActions,
  clearVesselScreeningErrorsReducer,
  clearVesselScreeningReducer,
  updateParamsActions,
  setDataFilterAction,
  getVesselScreeningDetailActions,
  updateVesselShipParticularActions,
} from './action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: VesselScreeningStoreModel = {
  loading: false,
  disable: false,
  params: initParams,
  vesselScreeningDetail: null,
  listVesselScreening: null,
  errorList: undefined,
  dataFilter: null,
};

const VesselScreeningReducer = createReducer<VesselScreeningStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListVesselScreeningActions.request, (state, { payload }) => {
    let params = cloneDeep(payload);
    if (payload?.isNotSaveSearch) {
      params = omit(payload, ['status', 'isNotSaveSearch']);
    }
    return {
      ...state,
      params: {
        ...params,
        pageSize:
          payload.pageSize === -1 ? state.params?.pageSize : payload?.pageSize,
      },
      loading:
        payload?.isRefreshLoading === false || payload?.isRefreshLoading
          ? payload?.isRefreshLoading
          : true,
    };
  })
  .handleAction(
    getListVesselScreeningActions.success,
    (state, { payload }) => ({
      ...state,
      listVesselScreening: payload,
      loading: false,
    }),
  )
  .handleAction(getListVesselScreeningActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createVesselScreeningActions.request, (state) => ({
    ...state,
    errorList: undefined,
  }))
  .handleAction(createVesselScreeningActions.success, (state) => ({
    ...state,
    params: initParams,
    loading: false,
  }))
  .handleAction(createVesselScreeningActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(updateVesselShipParticularActions.request, (state) => ({
    ...state,
    errorList: undefined,
  }))
  .handleAction(updateVesselShipParticularActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateVesselShipParticularActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getVesselScreeningDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(
    getVesselScreeningDetailActions.success,
    (state, { payload }) => ({
      ...state,
      vesselScreeningDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getVesselScreeningDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearVesselScreeningErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))
  .handleAction(clearVesselScreeningReducer, (state, { payload }) => ({
    ...state,
    dataFilter: payload ? null : state?.dataFilter,
  }))
  .handleAction(setDataFilterAction, (state, { payload }) => ({
    ...state,
    dataFilter: {
      ...payload,
      typeRange: payload?.dateFilter
        ? state.dataFilter?.typeRange
        : payload.typeRange,
    },
  }));

export default VesselScreeningReducer;
