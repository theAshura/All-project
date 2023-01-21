import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetListShoreDepartmentResponse,
  CreateShoreBody,
  EditShoreParams,
} from 'models/api/shore-department/shore-department.model';
import {
  CommonApiParam,
  CommonMessageErrorResponse,
} from 'models/common.model';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getList: () => void;
}

export const getListShoreDepartmentAction = createAsyncAction(
  '@shoreDepartment/GET_LIST_SHORE_DEPARTMENT_REQUEST',
  '@shoreDepartment/GET_LIST_SHORE_DEPARTMENT_SUCCESS',
  '@shoreDepartment/GET_LIST_SHORE_DEPARTMENT_FAILURE',
)<CommonApiParam, GetListShoreDepartmentResponse, void>();

export const deleteShoreDepartmentActions = createAsyncAction(
  `@shoreDepartment/DELETE_SHORE_DEPARTMENT_ACTIONS`,
  `@shoreDepartment/DELETE_SHORE_DEPARTMENT_ACTIONS_SUCCESS`,
  `@shoreDepartment/DELETE_SHORE_DEPARTMENT_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createShoreDepartmentAction = createAsyncAction(
  '@shoreDepartment/CREATE_SHORE_DEPARTMENT_REQUEST',
  '@shoreDepartment/CREATE_SHORE_DEPARTMENT_SUCCESS',
  '@shoreDepartment/CREATE_SHORE_DEPARTMENT_FAILURE',
)<CreateShoreBody, void, CommonMessageErrorResponse[]>();

export const editShoreDepartmentAction = createAsyncAction(
  '@shoreDepartment/EDIT_SHORE_DEPARTMENT_REQUEST',
  '@shoreDepartment/EDIT_SHORE_DEPARTMENT_SUCCESS',
  '@shoreDepartment/EDIT_SHORE_DEPARTMENT_FAILURE',
)<EditShoreParams, void, CommonMessageErrorResponse[]>();

export const clearErrorMessages = createAction(
  '@shoreDepartment/CLEAR_ERROR_MESSAGES',
)<void>();

export const clearShoreDepartmentReducer = createAction(
  '@shoreDepartment/CLEAR_SHORE_DEPARTMENT_REDUCER',
)<void>();

export const updateParamsActions = createAction(
  '@shoreDepartment/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
