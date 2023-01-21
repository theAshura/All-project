import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetCargoTypesResponse,
  CreateCargoTypeParams,
  UpdateCargoTypeParams,
  CargoTypeDetailResponse,
  CheckExitCodeParams,
  CheckExitResponse,
} from '../utils/model';

interface ParamsDeleteCargoType {
  id: string;
  isDetail?: boolean;
  getListCargoType: () => void;
}

export const getListCargoTypeActions = createAsyncAction(
  `@CargoType/GET_LIST_CARGO_ACTIONS`,
  `@CargoType/GET_LIST_CARGO_ACTIONS_SUCCESS`,
  `@CargoType/GET_LIST_CARGO_ACTIONS_FAIL`,
)<CommonApiParam, GetCargoTypesResponse, void>();

export const deleteCargoTypeActions = createAsyncAction(
  `@CargoType/DELETE_CARGO_ACTIONS`,
  `@CargoType/DELETE_CARGO_ACTIONS_SUCCESS`,
  `@CargoType/DELETE_CARGO_ACTIONS_FAIL`,
)<ParamsDeleteCargoType, CommonApiParam, void>();

export const createCargoTypeActions = createAsyncAction(
  `@CargoType/CREATE_CARGO_ACTIONS`,
  `@CargoType/CREATE_CARGO_ACTIONS_SUCCESS`,
  `@CargoType/CREATE_CARGO_ACTIONS_FAIL`,
)<CreateCargoTypeParams, void, ErrorField[]>();

export const checkExitCodeAction = createAsyncAction(
  `@CargoType/CHECK_EXIT_CODE_ACTIONS`,
  `@CargoType/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@CargoType/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, CheckExitResponse, void>();

export const updateCargoTypeActions = createAsyncAction(
  `@CargoType/UPDATE_CARGO_ACTIONS`,
  `@CargoType/UPDATE_CARGO_ACTIONS_SUCCESS`,
  `@CargoType/UPDATE_CARGO_ACTIONS_FAIL`,
)<UpdateCargoTypeParams, void, ErrorField[]>();

export const getCargoTypeDetailActions = createAsyncAction(
  `@CargoType/GET_CARGO_DETAIL_ACTIONS`,
  `@CargoType/GET_CARGO_DETAIL_ACTIONS_SUCCESS`,
  `@CargoType/GET_CARGO_DETAIL_ACTIONS_FAIL`,
)<string, CargoTypeDetailResponse, void>();

export const clearCargoTypeReducer = createAction(
  `@CargoType/CLEAR_CARGO_REDUCER`,
)<void>();

export const clearCargoTypeErrorsReducer = createAction(
  `@CargoType/CLEAR_CARGO_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@CargoType/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearCargoTypeParamsReducer = createAction(
  `@CargoType/CLEAR_CARGO_PARAMS_REDUCER`,
)<void>();
