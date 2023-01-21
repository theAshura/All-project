import {
  GetShipDepartmentsResponse,
  CreateShipDepartmentParams,
  UpdateShipDepartmentParams,
  ShipDepartmentDetailResponse,
} from 'models/api/ship-department/ship-department.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteShipDepartment {
  id: string;
  isDetail?: boolean;
  getListShipDepartment: () => void;
}

export const getListShipDepartmentActions = createAsyncAction(
  `@shipDepartment/GET_LIST_SHIP_DEPARTMENT_ACTIONS`,
  `@shipDepartment/GET_LIST_SHIP_DEPARTMENT_ACTIONS_SUCCESS`,
  `@shipDepartment/GET_LIST_SHIP_DEPARTMENT_ACTIONS_FAIL`,
)<CommonApiParam, GetShipDepartmentsResponse, void>();

export const deleteShipDepartmentActions = createAsyncAction(
  `@shipDepartment/DELETE_SHIP_DEPARTMENT_ACTIONS`,
  `@shipDepartment/DELETE_SHIP_DEPARTMENT_ACTIONS_SUCCESS`,
  `@shipDepartment/DELETE_SHIP_DEPARTMENT_ACTIONS_FAIL`,
)<ParamsDeleteShipDepartment, CommonApiParam, void>();

export const createShipDepartmentActions = createAsyncAction(
  `@shipDepartment/CREATE_SHIP_DEPARTMENT_ACTIONS`,
  `@shipDepartment/CREATE_SHIP_DEPARTMENT_ACTIONS_SUCCESS`,
  `@shipDepartment/CREATE_SHIP_DEPARTMENT_ACTIONS_FAIL`,
)<CreateShipDepartmentParams, void, ErrorField[]>();

export const updateShipDepartmentActions = createAsyncAction(
  `@shipDepartment/UPDATE_SHIP_DEPARTMENT_ACTIONS`,
  `@shipDepartment/UPDATE_SHIP_DEPARTMENT_ACTIONS_SUCCESS`,
  `@shipDepartment/UPDATE_SHIP_DEPARTMENT_ACTIONS_FAIL`,
)<UpdateShipDepartmentParams, void, ErrorField[]>();

export const getShipDepartmentDetailActions = createAsyncAction(
  `@shipDepartment/GET_SHIP_DEPARTMENT_DETAIL_ACTIONS`,
  `@shipDepartment/GET_SHIP_DEPARTMENT_DETAIL_ACTIONS_SUCCESS`,
  `@shipDepartment/GET_SHIP_DEPARTMENT_DETAIL_ACTIONS_FAIL`,
)<string, ShipDepartmentDetailResponse, void>();

export const clearShipDepartmentReducer = createAction(
  `@shipDepartment/CLEAR_SHIP_DEPARTMENT_REDUCER`,
)<void>();

export const clearShipDepartmentErrorsReducer = createAction(
  `@shipDepartment/CLEAR_SHIP_DEPARTMENT_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@shipDepartment/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
