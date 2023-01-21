import {
  ListAppTypePropertyResponse,
  AppTypeProperty,
  UpdateAppTypePropertyParams,
} from 'models/api/app-type-property/app-type-property.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListAppTypeProperty: () => void;
}

export const getListAppTypePropertyActions = createAsyncAction(
  `@appTypeProperty/GET_LIST_APP_TYPE_PROPERTY_ACTIONS`,
  `@appTypeProperty/GET_LIST_APP_TYPE_PROPERTY_ACTIONS_SUCCESS`,
  `@appTypeProperty/GET_LIST_APP_TYPE_PROPERTY_ACTIONS_FAIL`,
)<CommonApiParam, ListAppTypePropertyResponse, void>();

export const deleteAppTypePropertyActions = createAsyncAction(
  `@appTypeProperty/DELETE_APP_TYPE_PROPERTY_ACTIONS`,
  `@appTypeProperty/DELETE_APP_TYPE_PROPERTY_ACTIONS_SUCCESS`,
  `@appTypeProperty/DELETE_APP_TYPE_PROPERTY_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createAppTypePropertyActions = createAsyncAction(
  `@appTypeProperty/CREATE_APP_TYPE_PROPERTY_ACTIONS`,
  `@appTypeProperty/CREATE_APP_TYPE_PROPERTY_ACTIONS_SUCCESS`,
  `@appTypeProperty/CREATE_APP_TYPE_PROPERTY_ACTIONS_FAIL`,
)<AppTypeProperty, void, ErrorField[]>();

export const updateAppTypePropertyActions = createAsyncAction(
  `@appTypeProperty/UPDATE_APP_TYPE_PROPERTY_ACTIONS`,
  `@appTypeProperty/UPDATE_APP_TYPE_PROPERTY_ACTIONS_SUCCESS`,
  `@appTypeProperty/UPDATE_APP_TYPE_PROPERTY_ACTIONS_FAIL`,
)<UpdateAppTypePropertyParams, void, ErrorField[]>();

export const getAppTypePropertyDetailActions = createAsyncAction(
  `@appTypeProperty/GET_APP_TYPE_PROPERTY_ACTIONS`,
  `@appTypeProperty/GET_APP_TYPE_PROPERTY_ACTIONS_SUCCESS`,
  `@appTypeProperty/GET_APP_TYPE_PROPERTY_ACTIONS_FAIL`,
)<AppTypeProperty, AppTypeProperty, void>();

export const clearAppTypePropertyReducer = createAction(
  `@appTypeProperty/CLEAR_APP_TYPE_PROPERTY_REDUCER`,
)<void>();

export const clearParamsAppTypePropertyReducer = createAction(
  `@appTypeProperty/CLEAR_PARAMS_APP_TYPE_PROPERTY_REDUCER`,
)<void>();

export const clearAppTypePropertyErrorsReducer = createAction(
  `@appTypeProperty/CLEAR_ERRORS_APP_TYPE_PROPERTY_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@appTypeProperty/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
