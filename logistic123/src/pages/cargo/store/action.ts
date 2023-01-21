import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetCargosResponse,
  CreateCargoParams,
  UpdateCargoParams,
  CargoDetailResponse,
  CheckExitCodeParams,
  CheckExitResponse,
} from '../utils/model';

interface ParamsDeleteCargo {
  id: string;
  isDetail?: boolean;
  getListCargo: () => void;
}

export const getListCargoActions = createAsyncAction(
  `@Cargo/GET_LIST_CARGO_ACTIONS`,
  `@Cargo/GET_LIST_CARGO_ACTIONS_SUCCESS`,
  `@Cargo/GET_LIST_CARGO_ACTIONS_FAIL`,
)<CommonApiParam, GetCargosResponse, void>();

export const deleteCargoActions = createAsyncAction(
  `@Cargo/DELETE_CARGO_ACTIONS`,
  `@Cargo/DELETE_CARGO_ACTIONS_SUCCESS`,
  `@Cargo/DELETE_CARGO_ACTIONS_FAIL`,
)<ParamsDeleteCargo, CommonApiParam, void>();

export const createCargoActions = createAsyncAction(
  `@Cargo/CREATE_CARGO_ACTIONS`,
  `@Cargo/CREATE_CARGO_ACTIONS_SUCCESS`,
  `@Cargo/CREATE_CARGO_ACTIONS_FAIL`,
)<CreateCargoParams, void, ErrorField[]>();

export const checkExitCodeAction = createAsyncAction(
  `@Cargo/CHECK_EXIT_CODE_ACTIONS`,
  `@Cargo/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@Cargo/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, CheckExitResponse, void>();

export const updateCargoActions = createAsyncAction(
  `@Cargo/UPDATE_CARGO_ACTIONS`,
  `@Cargo/UPDATE_CARGO_ACTIONS_SUCCESS`,
  `@Cargo/UPDATE_CARGO_ACTIONS_FAIL`,
)<UpdateCargoParams, void, ErrorField[]>();

export const getCargoDetailActions = createAsyncAction(
  `@Cargo/GET_CARGO_DETAIL_ACTIONS`,
  `@Cargo/GET_CARGO_DETAIL_ACTIONS_SUCCESS`,
  `@Cargo/GET_CARGO_DETAIL_ACTIONS_FAIL`,
)<string, CargoDetailResponse, void>();

export const clearCargoReducer = createAction(
  `@Cargo/CLEAR_CARGO_REDUCER`,
)<void>();

export const clearCargoErrorsReducer = createAction(
  `@Cargo/CLEAR_CARGO_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@Cargo/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearCargoParamsReducer = createAction(
  `@Cargo/CLEAR_CARGO_PARAMS_REDUCER`,
)<void>();
