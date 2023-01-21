import { ActionsType } from 'models/store/role/role.model';
import {
  GetRolesResponse,
  GetPermissionsParams,
  CreateRoleParams,
  RolePermissionDetailResponse,
  Datum,
  UpdateRolePermissionsParams,
} from 'models/api/role/role.model';
import { CommonApiParam, ErrorField } from 'models/common.model';

import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteRole {
  id: string;
  isDetail?: boolean;
  getListRole: () => void;
}

export const getAllActions = createAsyncAction(
  `@roleAndPermission/GET_ALL_ACTIONS`,
  `@roleAndPermission/GET_ALL_ACTIONS_SUCCESS`,
  `@roleAndPermission/GET_ALL_ACTIONS_FAIL`,
)<void, ActionsType[], void>();

export const getListRolesActions = createAsyncAction(
  `@roleAndPermission/GET_LIST_ROLES_ACTIONS`,
  `@roleAndPermission/GET_LIST_ROLES_ACTIONS_SUCCESS`,
  `@roleAndPermission/GET_LIST_ROLES_ACTIONS_FAIL`,
)<CommonApiParam, GetRolesResponse, void>();

export const deleteRoleActions = createAsyncAction(
  `@roleAndPermission/DELETE_ROLE_ACTIONS`,
  `@roleAndPermission/DELETE_ROLE_ACTIONS_SUCCESS`,
  `@roleAndPermission/DELETE_ROLE_ACTIONS_FAIL`,
)<ParamsDeleteRole, CommonApiParam, void>();

export const getPermissionsActions = createAsyncAction(
  `@roleAndPermission/GET_LIST_PERMISSION_ACTIONS`,
  `@roleAndPermission/GET_LIST_PERMISSION_ACTIONS_SUCCESS`,
  `@roleAndPermission/GET_LIST_PERMISSION_ACTIONS_FAIL`,
)<GetPermissionsParams, Datum[], void>();

export const createRoleActions = createAsyncAction(
  `@roleAndPermission/CREATE_ROLE_ACTIONS`,
  `@roleAndPermission/CREATE_ROLE_ACTIONS_SUCCESS`,
  `@roleAndPermission/CREATE_ROLE_ACTIONS_FAIL`,
)<CreateRoleParams, void, ErrorField[]>();

export const updateRoleActions = createAsyncAction(
  `@roleAndPermission/UPDATE_ROLE_ACTIONS`,
  `@roleAndPermission/UPDATE_ROLE_ACTIONS_SUCCESS`,
  `@roleAndPermission/UPDATE_ROLE_ACTIONS_FAIL`,
)<UpdateRolePermissionsParams, void, ErrorField[]>();

export const getRolePermissionDetailActions = createAsyncAction(
  `@roleAndPermission/GET_ROLE_END_PERMISSION_DETAIL_ACTIONS`,
  `@roleAndPermission/GET_ROLE_END_PERMISSION_DETAIL_ACTIONS_SUCCESS`,
  `@roleAndPermission/GET_ROLE_END_PERMISSION_DETAIL_ACTIONS_FAIL`,
)<string, RolePermissionDetailResponse, void>();

export const clearRolesErrorsReducer = createAction(
  `@roleAndPermission/CLEAR_FLEET_ERRORS_REDUCER`,
)<void>();

export const clearAuditTypeReducer = createAction(
  `@auditType/CLEAR_AUDIT_TYPE_REDUCER`,
)<void>();

export const clearRoleAndPermissionReducer = createAction(
  `@roleAndPermission/CLEAR_ROLE_AND_PERMISSION_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@roleAndPermission/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
