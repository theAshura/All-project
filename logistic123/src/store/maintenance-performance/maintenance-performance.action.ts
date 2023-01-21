import {
  CreateMaintenancePerformanceParams,
  DeleteMaintenancePerformanceParams,
  GetDetailMaintenancePerformance,
  GetMaintenancePerformanceResponse,
  UpdateMaintenancePerformanceParams,
} from 'models/api/maintenance-performance/maintenance-performance.model';
import { CommonApiParam } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

export const getListMaintenancePerformanceActions = createAsyncAction(
  `@MaintenancePerformance/GET_LIST_MAINTENANCE_PERFORMANCE_ACTIONS`,
  `@MaintenancePerformance/GET_LIST_MAINTENANCE_PERFORMANCE_ACTIONS_SUCCESS`,
  `@MaintenancePerformance/GET_LIST_MAINTENANCE_PERFORMANCE_ACTIONS_FAIL`,
)<CommonApiParam, GetMaintenancePerformanceResponse, void>();

export const createMaintenancePerformanceActions = createAsyncAction(
  `@MaintenancePerformance/CREATE_MAINTENANCE_PERFORMANCE_ACTIONS`,
  `@MaintenancePerformance/CREATE_MAINTENANCE_PERFORMANCE_ACTIONS_SUCCESS`,
  `@MaintenancePerformance/CREATE_MAINTENANCE_PERFORMANCE_ACTIONS_FAIL`,
)<CreateMaintenancePerformanceParams, void, void>();

export const updateMaintenancePerformanceActions = createAsyncAction(
  `@MaintenancePerformance/UPDATE_MAINTENANCE_PERFORMANCE_ACTIONS`,
  `@MaintenancePerformance/UPDATE_MAINTENANCE_PERFORMANCE_ACTIONS_SUCCESS`,
  `@MaintenancePerformance/UPDATE_MAINTENANCE_PERFORMANCE_ACTIONS_FAIL`,
)<UpdateMaintenancePerformanceParams, void, void>();

export const deleteMaintenancePerformanceActions = createAsyncAction(
  `@MaintenancePerformance/DELETE_MAINTENANCE_PERFORMANCE_ACTIONS`,
  `@MaintenancePerformance/DELETE_MAINTENANCE_PERFORMANCE_ACTIONS_SUCCESS`,
  `@MaintenancePerformance/DELETE_MAINTENANCE_PERFORMANCE_ACTIONS_FAIL`,
)<DeleteMaintenancePerformanceParams, void, void>();

export const getDetailMaintenancePerformance = createAsyncAction(
  `@MaintenancePerformance/GET_DETAIL_MAINTENANCE_PERFORMANCE_ACTIONS`,
  `@MaintenancePerformance/GET_DETAIL_MAINTENANCE_PERFORMANCE_ACTIONS_SUCCESS`,
  `@MaintenancePerformance/GET_DETAIL_MAINTENANCE_PERFORMANCE_ACTIONS_FAIL`,
)<string, GetDetailMaintenancePerformance, void>();

export const clearMaintenancePerformance = createAction(
  `@MaintenancePerformance/CLEAR_MAINTENANCE_PERFORMANCE_ACTIONS`,
)<void>();

export const setDataFilterAction = createAction(
  `@MaintenancePerformance/SET_DATA_FILTER`,
)<CommonApiParam>();

export const updateParamsActions = createAction(
  '@MaintenancePerformance/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
