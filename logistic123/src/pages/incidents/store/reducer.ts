import { createReducer } from 'typesafe-actions';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import { IncidentStoreModel } from '../utils/models/common.model';
import {
  getListIncidentActions,
  createIncidentActions,
  clearIncidentErrorsReducer,
  clearIncidentReducer,
  updateParamsActions,
  setDataFilterAction,
  getIncidentDetailActions,
  updateIncidentsActions,
  deleteIncidentsActions,
  // summary
  getIncidentPlaceActions,
  getNumberIncidentsActions,
  getTypeOfIncidentActions,
  getReviewStatusActions,
  getRiskDetailsActions,
} from './action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: IncidentStoreModel = {
  loading: false,
  disable: false,
  params: initParams,
  incidentDetail: null,
  listIncident: null,
  errorList: undefined,
  dataFilter: null,
  numberIncident: null,
  incidentPlace: null,
  typeOfIncident: null,
  reviewStatus: null,
  riskDetails: null,
};

const IncidentReducer = createReducer<IncidentStoreModel>(INITIAL_STATE)
  .handleAction(getListIncidentActions.request, (state, { payload }) => {
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
  .handleAction(getListIncidentActions.success, (state, { payload }) => ({
    ...state,
    listIncident: payload,
    loading: false,
  }))
  .handleAction(getListIncidentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createIncidentActions.request, (state) => ({
    ...state,
    errorList: undefined,
  }))
  .handleAction(createIncidentActions.success, (state) => ({
    ...state,
    params: initParams,
    loading: false,
  }))
  .handleAction(createIncidentActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getIncidentDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getIncidentDetailActions.success, (state, { payload }) => ({
    ...state,
    incidentDetail: payload,
    loading: false,
  }))
  .handleAction(getIncidentDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateIncidentsActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateIncidentsActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateIncidentsActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(deleteIncidentsActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteIncidentsActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteIncidentsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  // summary

  .handleAction(getNumberIncidentsActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getNumberIncidentsActions.success, (state, { payload }) => ({
    ...state,
    numberIncident: payload,
    loading: false,
  }))
  .handleAction(getNumberIncidentsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getIncidentPlaceActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getIncidentPlaceActions.success, (state, { payload }) => ({
    ...state,
    incidentPlace: payload,
    loading: false,
  }))
  .handleAction(getIncidentPlaceActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getTypeOfIncidentActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getTypeOfIncidentActions.success, (state, { payload }) => ({
    ...state,
    typeOfIncident: payload,
    loading: false,
  }))
  .handleAction(getTypeOfIncidentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getReviewStatusActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getReviewStatusActions.success, (state, { payload }) => ({
    ...state,
    reviewStatus: payload,
    loading: false,
  }))
  .handleAction(getReviewStatusActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getRiskDetailsActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getRiskDetailsActions.success, (state, { payload }) => ({
    ...state,
    riskDetails: payload,
    loading: false,
  }))
  .handleAction(getRiskDetailsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearIncidentErrorsReducer, (state) => ({
    ...state,
    errorList: [],
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))
  .handleAction(clearIncidentReducer, (state, { payload }) => ({
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

export default IncidentReducer;
