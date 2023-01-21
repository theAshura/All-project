import {
  GetLocationsResponse,
  CreateLocationParams,
  UpdateLocationParams,
  LocationDetailResponse,
} from 'models/api/location/location.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteLocation {
  id: string;
  isDetail?: boolean;
  getListLocation: () => void;
}

export const getListLocationActions = createAsyncAction(
  `@location/GET_LIST_LOCATION_ACTIONS`,
  `@location/GET_LIST_LOCATION_ACTIONS_SUCCESS`,
  `@location/GET_LIST_LOCATION_ACTIONS_FAIL`,
)<CommonApiParam, GetLocationsResponse, void>();

export const deleteLocationActions = createAsyncAction(
  `@location/DELETE_LOCATION_ACTIONS`,
  `@location/DELETE_LOCATION_ACTIONS_SUCCESS`,
  `@location/DELETE_LOCATION_ACTIONS_FAIL`,
)<ParamsDeleteLocation, CommonApiParam, void>();

export const createLocationActions = createAsyncAction(
  `@location/CREATE_LOCATION_ACTIONS`,
  `@location/CREATE_LOCATION_ACTIONS_SUCCESS`,
  `@location/CREATE_LOCATION_ACTIONS_FAIL`,
)<CreateLocationParams, void, ErrorField[]>();

export const updateLocationActions = createAsyncAction(
  `@location/UPDATE_LOCATION_ACTIONS`,
  `@location/UPDATE_LOCATION_ACTIONS_SUCCESS`,
  `@location/UPDATE_LOCATION_ACTIONS_FAIL`,
)<UpdateLocationParams, void, ErrorField[]>();

export const getLocationDetailActions = createAsyncAction(
  `@location/GET_LOCATION_DETAIL_ACTIONS`,
  `@location/GET_LOCATION_DETAIL_ACTIONS_SUCCESS`,
  `@location/GET_LOCATION_DETAIL_ACTIONS_FAIL`,
)<string, LocationDetailResponse, void>();

export const clearLocationReducer = createAction(
  `@location/CLEAR_LOCATION_REDUCER`,
)<void>();

export const clearLocationErrorsReducer = createAction(
  `@location/CLEAR_LOCATION_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@location/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
