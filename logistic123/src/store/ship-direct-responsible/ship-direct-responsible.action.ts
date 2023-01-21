import {
  GetShipDirectResponsiblesResponse,
  CreateShipDirectResponsibleParams,
  UpdateShipDirectResponsibleParams,
  ShipDirectResponsibleDetailResponse,
} from 'models/api/ship-direct-responsible/ship-direct-responsible.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteShipDirectResponsible {
  id: string;
  isDetail?: boolean;
  getListShipDirectResponsible: () => void;
}

export const getListShipDirectResponsibleActions = createAsyncAction(
  `@shipDirectResponsible/GET_LIST_SHIP_DIRECT_RESPONSIBLE_ACTIONS`,
  `@shipDirectResponsible/GET_LIST_SHIP_DIRECT_RESPONSIBLE_ACTIONS_SUCCESS`,
  `@shipDirectResponsible/GET_LIST_SHIP_DIRECT_RESPONSIBLE_ACTIONS_FAIL`,
)<CommonApiParam, GetShipDirectResponsiblesResponse, void>();

export const deleteShipDirectResponsibleActions = createAsyncAction(
  `@shipDirectResponsible/DELETE_SHIP_DIRECT_RESPONSIBLE_ACTIONS`,
  `@shipDirectResponsible/DELETE_SHIP_DIRECT_RESPONSIBLE_ACTIONS_SUCCESS`,
  `@shipDirectResponsible/DELETE_SHIP_DIRECT_RESPONSIBLE_ACTIONS_FAIL`,
)<ParamsDeleteShipDirectResponsible, CommonApiParam, void>();

export const createShipDirectResponsibleActions = createAsyncAction(
  `@shipDirectResponsible/CREATE_SHIP_DIRECT_RESPONSIBLE_ACTIONS`,
  `@shipDirectResponsible/CREATE_SHIP_DIRECT_RESPONSIBLE_ACTIONS_SUCCESS`,
  `@shipDirectResponsible/CREATE_SHIP_DIRECT_RESPONSIBLE_ACTIONS_FAIL`,
)<CreateShipDirectResponsibleParams, void, ErrorField[]>();

export const updateShipDirectResponsibleActions = createAsyncAction(
  `@shipDirectResponsible/UPDATE_SHIP_DIRECT_RESPONSIBLE_ACTIONS`,
  `@shipDirectResponsible/UPDATE_SHIP_DIRECT_RESPONSIBLE_ACTIONS_SUCCESS`,
  `@shipDirectResponsible/UPDATE_SHIP_DIRECT_RESPONSIBLE_ACTIONS_FAIL`,
)<UpdateShipDirectResponsibleParams, void, ErrorField[]>();

export const getShipDirectResponsibleDetailActions = createAsyncAction(
  `@shipDirectResponsible/GET_SHIP_DIRECT_RESPONSIBLE_DETAIL_ACTIONS`,
  `@shipDirectResponsible/GET_SHIP_DIRECT_RESPONSIBLE_DETAIL_ACTIONS_SUCCESS`,
  `@shipDirectResponsible/GET_SHIP_DIRECT_RESPONSIBLE_DETAIL_ACTIONS_FAIL`,
)<string, ShipDirectResponsibleDetailResponse, void>();

export const clearShipDirectResponsibleReducer = createAction(
  `@shipDirectResponsible/CLEAR_SHIP_DIRECT_RESPONSIBLE_REDUCER`,
)<void>();

export const clearShipDirectResponsibleErrorsReducer = createAction(
  `@shipDirectResponsible/CLEAR_SHIP_DIRECT_RESPONSIBLE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@shipDirectResponsible/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
