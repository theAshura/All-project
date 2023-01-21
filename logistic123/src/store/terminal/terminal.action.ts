import {
  CreateTerminalParams,
  GetTerminalResponse,
  Terminal,
  TerminalDetailResponse,
  UpdateTerminalParams,
} from 'models/api/terminal/terminal.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteTerminal {
  id: string;
  isDetail?: boolean;
  getListTerminal: () => void;
}

export const getListTerminalActions = createAsyncAction(
  `@terminal/GET_LIST_TERMINAL_ACTIONS`,
  `@terminal/GET_LIST_TERMINAL_ACTIONS_SUCCESS`,
  `@terminal/GET_LIST_TERMINAL_ACTIONS_FAIL`,
)<CommonApiParam, GetTerminalResponse, void>();

export const getListTerminalByMainIdActions = createAsyncAction(
  `@terminal/GET_LIST_TERMINAL_BY_MAIN_ID_ACTIONS`,
  `@terminal/GET_LIST_TERMINAL_BY_MAIN_ID_ACTIONS_SUCCESS`,
  `@terminal/GET_LIST_TERMINAL_BY_MAIN_ID_ACTIONS_FAIL`,
)<CommonApiParam, Terminal[], void>();

export const deleteTerminalActions = createAsyncAction(
  `@terminal/DELETE_TERMINAL_ACTIONS`,
  `@terminal/DELETE_TERMINAL_ACTIONS_SUCCESS`,
  `@terminal/DELETE_TERMINAL_ACTIONS_FAIL`,
)<ParamsDeleteTerminal, CommonApiParam, void>();

export const createTerminalActions = createAsyncAction(
  `@terminal/CREATE_TERMINAL_ACTIONS`,
  `@terminal/CREATE_TERMINAL_ACTIONS_SUCCESS`,
  `@terminal/CREATE_TERMINAL_ACTIONS_FAIL`,
)<CreateTerminalParams, void, ErrorField[]>();

export const updateTerminalActions = createAsyncAction(
  `@terminal/UPDATE_TERMINAL_ACTIONS`,
  `@terminal/UPDATE_TERMINAL_ACTIONS_SUCCESS`,
  `@terminal/UPDATE_TERMINAL_ACTIONS_FAIL`,
)<UpdateTerminalParams, void, ErrorField[]>();

export const getTerminalDetailActions = createAsyncAction(
  `@terminal/GET_TERMINAL_DETAIL_ACTIONS`,
  `@terminal/GET_TERMINAL_DETAIL_ACTIONS_SUCCESS`,
  `@terminal/GET_TERMINAL_DETAIL_ACTIONS_FAIL`,
)<string, TerminalDetailResponse, void>();

export const clearTerminalReducer = createAction(
  `@terminal/CLEAR_TERMINAL_REDUCER`,
)<void>();

export const clearTerminalErrorsReducer = createAction(
  `@terminal/CLEAR_TERMINAL_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@terminal/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
