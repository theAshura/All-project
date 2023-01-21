import {
  GetFleetsResponse,
  GetCompanysParams,
  GetCompanysResponse,
  CreateFleetParams,
  UpdateFleetParams,
  FleetDetailResponse,
} from 'models/api/fleet/fleet.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteFleet {
  id: string;
  isDetail?: boolean;
  getListFleet: () => void;
}

export const getListFleetActions = createAsyncAction(
  `@fleet/GET_LIST_FLEET_ACTIONS`,
  `@fleet/GET_LIST_FLEET_ACTIONS_SUCCESS`,
  `@fleet/GET_LIST_FLEET_ACTIONS_FAIL`,
)<CommonApiParam, GetFleetsResponse, void>();

export const getListCompanyActions = createAsyncAction(
  `@fleet/GET_LIST_COMPANY_ACTIONS`,
  `@fleet/GET_LIST_COMPANY_ACTIONS_SUCCESS`,
  `@fleet/GET_LIST_COMPANY_ACTIONS_FAIL`,
)<GetCompanysParams, GetCompanysResponse, void>();

export const deleteFleetActions = createAsyncAction(
  `@fleet/DELETE_FLEET_ACTIONS`,
  `@fleet/DELETE_FLEET_ACTIONS_SUCCESS`,
  `@fleet/DELETE_FLEET_ACTIONS_FAIL`,
)<ParamsDeleteFleet, CommonApiParam, void>();

export const createFleetActions = createAsyncAction(
  `@fleet/CREATE_FLEET_ACTIONS`,
  `@fleet/CREATE_FLEET_ACTIONS_SUCCESS`,
  `@fleet/CREATE_FLEET_ACTIONS_FAIL`,
)<CreateFleetParams, void, ErrorField[]>();

export const updateFleetActions = createAsyncAction(
  `@fleet/UPDATE_FLEET_ACTIONS`,
  `@fleet/UPDATE_FLEET_ACTIONS_SUCCESS`,
  `@fleet/UPDATE_FLEET_ACTIONS_FAIL`,
)<UpdateFleetParams, void, ErrorField[]>();

export const getFleetDetailActions = createAsyncAction(
  `@fleet/GET_FLEET_DETAIL_ACTIONS`,
  `@fleet/GET_FLEET_DETAIL_ACTIONS_SUCCESS`,
  `@fleet/GET_FLEET_DETAIL_ACTIONS_FAIL`,
)<string, FleetDetailResponse, void>();

export const clearFleetReducer = createAction(
  `@fleet/CLEAR_FLEET_REDUCER`,
)<void>();

export const clearFleetErrorsReducer = createAction(
  `@fleet/CLEAR_FLEET_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@fleet/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearFleetParamsReducer = createAction(
  `@fleet/CLEAR_FLEET_PARAMS_REDUCER`,
)<void>();
