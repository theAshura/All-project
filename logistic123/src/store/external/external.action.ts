import {
  CreateExternalParams,
  UpdateExternalParams,
} from 'models/api/external/external.model';
import { CommonApiParam } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

export const getLisExternalActions = createAsyncAction(
  `@external/GET_LIST_EXTERNAL_ACTIONS`,
  `@external/GET_LIST_EXTERNAL_ACTIONS_SUCCESS`,
  `@external/GET_LIST_EXTERNAL_ACTIONS_FAIL`,
)<CommonApiParam, any, void>();

export const createExternalActions = createAsyncAction(
  `@external/CREATE_EXTERNAL_ACTIONS`,
  `@external/CREATE_EXTERNAL_ACTIONS_SUCCESS`,
  `@external/CREATE_EXTERNAL_ACTIONS_FAIL`,
)<CreateExternalParams, void, void>();

export const updateExternalActions = createAsyncAction(
  `@external/UPDATE_EXTERNAL_ACTIONS`,
  `@external/UPDATE_EXTERNAL_ACTIONS_SUCCESS`,
  `@external/UPDATE_EXTERNAL_ACTIONS_FAIL`,
)<UpdateExternalParams, void, void>();

export const deleteExternalActions = createAsyncAction(
  `@external/DELETE_EXTERNAL_ACTIONS`,
  `@external/DELETE_EXTERNAL_ACTIONS_SUCCESS`,
  `@external/DELETE_EXTERNAL_ACTIONS_FAIL`,
)<any, void, void>();

export const getDetailExternal = createAsyncAction(
  `@external/GET_DETAIL_EXTERNAL_ACTIONS`,
  `@external/GET_DETAIL_EXTERNAL_ACTIONS_SUCCESS`,
  `@external/GET_DETAIL_EXTERNAL_ACTIONS_FAIL`,
)<string, any, void>();

export const clearExternalAction = createAction(
  `@external/CLEAR_EXTERNAL_ACTIONS`,
)<void>();

export const clearExternalErrorsReducer = createAction(
  `@external/CLEAR_EXTERNAL_ERRORS_REDUCER`,
)<void>();
