import { LocationStoreModel } from 'models/store/location/location.model';
import { createReducer } from 'typesafe-actions';
import {
  getListLocationActions,
  deleteLocationActions,
  updateLocationActions,
  createLocationActions,
  getLocationDetailActions,
  clearLocationReducer,
  updateParamsActions,
  clearLocationErrorsReducer,
} from './location.action';

const INITIAL_STATE: LocationStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listLocations: undefined,
  locationDetail: null,
  errorList: undefined,
};

const locationReducer = createReducer<LocationStoreModel>(INITIAL_STATE)
  .handleAction(getListLocationActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListLocationActions.success, (state, { payload }) => ({
    ...state,
    listLocations: payload,
    loading: false,
  }))
  .handleAction(getListLocationActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteLocationActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteLocationActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteLocationActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateLocationActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateLocationActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateLocationActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createLocationActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createLocationActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createLocationActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getLocationDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getLocationDetailActions.success, (state, { payload }) => ({
    ...state,
    locationDetail: payload,
    loading: false,
  }))
  .handleAction(getLocationDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearLocationErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearLocationReducer, () => ({
    ...INITIAL_STATE,
  }));

export default locationReducer;
