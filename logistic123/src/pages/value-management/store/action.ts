import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetValueManagementsResponse,
  CreateValueManagementParams,
  UpdateValueManagementParams,
  ValueManagementResponse,
} from '../utils/model';

interface ParamsDeleteValueManagement {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListValueManagementActions = createAsyncAction(
  `@ValueManagement/GET_LIST_VALUE_MANAGEMENT_ACTIONS`,
  `@ValueManagement/GET_LIST_VALUE_MANAGEMENT_ACTIONS_SUCCESS`,
  `@ValueManagement/GET_LIST_VALUE_MANAGEMENT_ACTIONS_FAIL`,
)<CommonApiParam, GetValueManagementsResponse, void>();

export const deleteValueManagementActions = createAsyncAction(
  `@ValueManagement/DELETE_VALUE_MANAGEMENT_ACTIONS`,
  `@ValueManagement/DELETE_VALUE_MANAGEMENT_ACTIONS_SUCCESS`,
  `@ValueManagement/DELETE_VALUE_MANAGEMENT_ACTIONS_FAIL`,
)<ParamsDeleteValueManagement, CommonApiParam, void>();

export const createValueManagementActions = createAsyncAction(
  `@ValueManagement/CREATE_VALUE_MANAGEMENT_ACTIONS`,
  `@ValueManagement/CREATE_VALUE_MANAGEMENT_ACTIONS_SUCCESS`,
  `@ValueManagement/CREATE_VALUE_MANAGEMENT_ACTIONS_FAIL`,
)<CreateValueManagementParams, void, ErrorField[]>();

export const updateValueManagementActions = createAsyncAction(
  `@ValueManagement/UPDATE_VALUE_MANAGEMENT_ACTIONS`,
  `@ValueManagement/UPDATE_VALUE_MANAGEMENT_ACTIONS_SUCCESS`,
  `@ValueManagement/UPDATE_VALUE_MANAGEMENT_ACTIONS_FAIL`,
)<UpdateValueManagementParams, void, ErrorField[]>();

export const getValueManagementDetailActions = createAsyncAction(
  `@ValueManagement/GET_VALUE_MANAGEMENT_DETAIL_ACTIONS`,
  `@ValueManagement/GET_VALUE_MANAGEMENT_DETAIL_ACTIONS_SUCCESS`,
  `@ValueManagement/GET_VALUE_MANAGEMENT_DETAIL_ACTIONS_FAIL`,
)<string, ValueManagementResponse, void>();

export const clearValueManagementReducer = createAction(
  `@ValueManagement/CLEAR_VALUE_MANAGEMENT_REDUCER`,
)<void>();

export const clearValueManagementErrorsReducer = createAction(
  `@ValueManagement/CLEAR_VALUE_MANAGEMENT_ERRORS_REDUCER`,
)<void>();

export const clearValueManagementParamsReducer = createAction(
  `@ValueManagement/CLEAR_VALUE_MANAGEMENT_PARAMS_REDUCER`,
)<void>();
