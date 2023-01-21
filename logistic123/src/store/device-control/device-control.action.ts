import {
  ListDeviceControlResponse,
  DeviceControl,
  UpdateDeviceControlParams,
} from 'models/api/device-control/device-control.model';

import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListDeviceControl: () => void;
}

export const getListDeviceControlActions = createAsyncAction(
  `@psc/GET_LIST_DEVICE_CONTROL_ACTIONS`,
  `@psc/GET_LIST_DEVICE_CONTROL_ACTIONS_SUCCESS`,
  `@psc/GET_LIST_DEVICE_CONTROL_ACTIONS_FAIL`,
)<CommonApiParam, ListDeviceControlResponse, void>();

export const deleteDeviceControlActions = createAsyncAction(
  `@psc/DELETE_DEVICE_CONTROL_ACTIONS`,
  `@psc/DELETE_DEVICE_CONTROL_ACTIONS_SUCCESS`,
  `@psc/DELETE_DEVICE_CONTROL_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createDeviceControlActions = createAsyncAction(
  `@psc/CREATE_DEVICE_CONTROL_ACTIONS`,
  `@psc/CREATE_DEVICE_CONTROL_ACTIONS_SUCCESS`,
  `@psc/CREATE_DEVICE_CONTROL_ACTIONS_FAIL`,
)<DeviceControl, void, ErrorField[]>();

export const updateDeviceControlActions = createAsyncAction(
  `@psc/UPDATE_DEVICE_CONTROL_ACTIONS`,
  `@psc/UPDATE_DEVICE_CONTROL_ACTIONS_SUCCESS`,
  `@psc/UPDATE_DEVICE_CONTROL_ACTIONS_FAIL`,
)<UpdateDeviceControlParams, void, ErrorField[]>();

export const getDeviceControlDetailActions = createAsyncAction(
  `@psc/GET_DEVICE_CONTROL_ACTIONS`,
  `@psc/GET_DEVICE_CONTROL_ACTIONS_SUCCESS`,
  `@psc/GET_DEVICE_CONTROL_ACTIONS_FAIL`,
)<DeviceControl, DeviceControl, void>();

export const clearDeviceControlReducer = createAction(
  `@psc/CLEAR_DEVICE_CONTROL_REDUCER`,
)<void>();

export const clearParamsDeviceControlReducer = createAction(
  `@psc/CLEAR_PARAMS_DEVICE_CONTROL_REDUCER`,
)<void>();

export const clearDeviceControlErrorsReducer = createAction(
  `@psc/CLEAR_ERRORS_DEVICE_CONTROL_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@dc/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
