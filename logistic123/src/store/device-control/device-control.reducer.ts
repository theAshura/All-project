import { DeviceControlState } from 'models/store/device-control/device-control.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsDeviceControlReducer,
  clearDeviceControlErrorsReducer,
  clearDeviceControlReducer,
  createDeviceControlActions,
  deleteDeviceControlActions,
  getListDeviceControlActions,
  getDeviceControlDetailActions,
  updateParamsActions,
  updateDeviceControlActions,
} from './device-control.action';

const INITIAL_STATE: DeviceControlState = {
  loading: false,
  disable: false,
  listDeviceControl: null,
  deviceControlDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const DeviceControlReducer = createReducer<DeviceControlState>(INITIAL_STATE)
  .handleAction(getListDeviceControlActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListDeviceControlActions.success, (state, { payload }) => ({
    ...state,
    listDeviceControl: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getListDeviceControlActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteDeviceControlActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteDeviceControlActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deleteDeviceControlActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createDeviceControlActions.request, (state) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createDeviceControlActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createDeviceControlActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getDeviceControlDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getDeviceControlDetailActions.success,
    (state, { payload }) => ({
      ...state,
      rankMasterDetail: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getDeviceControlDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateDeviceControlActions.request, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateDeviceControlActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateDeviceControlActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(clearDeviceControlReducer, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(clearParamsDeviceControlReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearDeviceControlErrorsReducer, (state) => ({
    ...state,
    errorList: [],
  }));

export default DeviceControlReducer;
