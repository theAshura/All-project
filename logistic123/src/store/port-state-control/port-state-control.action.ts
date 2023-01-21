import {
  GetPortStateControlsResponse,
  CreatePortStateControlParams,
  UpdatePortStateControlParams,
  PortStateControlDetailResponse,
} from 'models/api/port-state-control/port-state-control.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeletePortStateControl {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListPortStateControlActions = createAsyncAction(
  `@PortStateControl/GET_LIST_PORT_STATE_CONTROL_ACTIONS`,
  `@PortStateControl/GET_LIST_PORT_STATE_CONTROL_ACTIONS_SUCCESS`,
  `@PortStateControl/GET_LIST_PORT_STATE_CONTROL_ACTIONS_FAIL`,
)<CommonApiParam, GetPortStateControlsResponse, void>();

export const deletePortStateControlActions = createAsyncAction(
  `@PortStateControl/DELETE_PORT_STATE_CONTROL_ACTIONS`,
  `@PortStateControl/DELETE_PORT_STATE_CONTROL_ACTIONS_SUCCESS`,
  `@PortStateControl/DELETE_PORT_STATE_CONTROL_ACTIONS_FAIL`,
)<ParamsDeletePortStateControl, CommonApiParam, void>();

export const createPortStateControlActions = createAsyncAction(
  `@PortStateControl/CREATE_PORT_STATE_CONTROL_ACTIONS`,
  `@PortStateControl/CREATE_PORT_STATE_CONTROL_ACTIONS_SUCCESS`,
  `@PortStateControl/CREATE_PORT_STATE_CONTROL_ACTIONS_FAIL`,
)<CreatePortStateControlParams, void, ErrorField[]>();

export const updatePortStateControlActions = createAsyncAction(
  `@PortStateControl/UPDATE_PORT_STATE_CONTROL_ACTIONS`,
  `@PortStateControl/UPDATE_PORT_STATE_CONTROL_ACTIONS_SUCCESS`,
  `@PortStateControl/UPDATE_PORT_STATE_CONTROL_ACTIONS_FAIL`,
)<UpdatePortStateControlParams, void, ErrorField[]>();

export const getPortStateControlDetailActions = createAsyncAction(
  `@PortStateControl/GET_PORT_STATE_CONTROL_DETAIL_ACTIONS`,
  `@PortStateControl/GET_PORT_STATE_CONTROL_DETAIL_ACTIONS_SUCCESS`,
  `@PortStateControl/GET_PORT_STATE_CONTROL_DETAIL_ACTIONS_FAIL`,
)<CommonApiParam, PortStateControlDetailResponse, void>();

export const clearPortStateControlReducer = createAction(
  `@PortStateControl/CLEAR_PORT_STATE_CONTROL_REDUCER`,
)<void>();

export const clearPortStateControlErrorsReducer = createAction(
  `@PortStateControl/CLEAR_PORT_STATE_CONTROL_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@PortStateControl/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@PortStateControl/SET_DATA_FILTER`,
)<CommonApiParam>();
