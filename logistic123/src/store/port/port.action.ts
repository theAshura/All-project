import {
  GMT,
  ListPortResponse,
  Port,
  UpdatePortParams,
} from 'models/api/port/port.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListPort: () => void;
}

export const getListPortActions = createAsyncAction(
  `@port/GET_LIST_PORT_ACTIONS`,
  `@port/GET_LIST_PORT_ACTIONS_SUCCESS`,
  `@port/GET_LIST_PORT_ACTIONS_FAIL`,
)<CommonApiParam, ListPortResponse, void>();

export const deletePortActions = createAsyncAction(
  `@port/DELETE_PORT_ACTIONS`,
  `@port/DELETE_PORT_ACTIONS_SUCCESS`,
  `@port/DELETE_PORT_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createPortActions = createAsyncAction(
  `@port/CREATE_PORT_ACTIONS`,
  `@port/CREATE_PORT_ACTIONS_SUCCESS`,
  `@port/CREATE_PORT_ACTIONS_FAIL`,
)<Port, void, ErrorField[]>();

export const updatePortActions = createAsyncAction(
  `@port/UPDATE_PORT_ACTIONS`,
  `@port/UPDATE_PORT_ACTIONS_SUCCESS`,
  `@port/UPDATE_PORT_ACTIONS_FAIL`,
)<UpdatePortParams, void, ErrorField[]>();

export const getPortDetailActions = createAsyncAction(
  `@port/GET_PORT_ACTIONS`,
  `@port/GET_PORT_ACTIONS_SUCCESS`,
  `@port/GET_PORT_ACTIONS_FAIL`,
)<Port, Port, void>();

export const getGMTActions = createAsyncAction(
  `@port/GET_LIST_GMT_ACTIONS`,
  `@port/GET_LIST_GMT_ACTIONS_SUCCESS`,
  `@port/GET_LIST_GMT_ACTIONS_FAIL`,
)<void, GMT, void>();

export const clearPortReducer = createAction(
  `@port/CLEAR_PORT_REDUCER`,
)<void>();

export const clearParamsPortReducer = createAction(
  `@port/CLEAR_PARAMS_PORT_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@port/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const getListPortStrongPreferenceActions = createAsyncAction(
  `@port/GET_LIST_PORT_STRONG_PREFERENCE_ACTIONS`,
  `@port/GET_LIST_PORT_STRONG_PREFERENCE_ACTIONS_SUCCESS`,
  `@port/GET_LIST_PORT_STRONG_PREFERENCE_ACTIONS_FAIL`,
)<CommonApiParam, ListPortResponse, void>();
