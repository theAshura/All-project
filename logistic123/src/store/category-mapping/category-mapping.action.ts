import {
  GetCategoryMappingsResponse,
  CreateCategoryMappingParams,
  UpdateCategoryMappingParams,
  CategoryMappingDetailResponse,
} from 'models/api/category-mapping/category-mapping.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteCategoryMapping {
  id: string;
  isDetail?: boolean;
  getListCategoryMapping: () => void;
}

export const getListCategoryMappingActions = createAsyncAction(
  `@CategoryMapping/GET_LIST_AUDIT_TYPE_ACTIONS`,
  `@CategoryMapping/GET_LIST_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@CategoryMapping/GET_LIST_AUDIT_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, GetCategoryMappingsResponse, void>();

export const deleteCategoryMappingActions = createAsyncAction(
  `@CategoryMapping/DELETE_AUDIT_TYPE_ACTIONS`,
  `@CategoryMapping/DELETE_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@CategoryMapping/DELETE_AUDIT_TYPE_ACTIONS_FAIL`,
)<ParamsDeleteCategoryMapping, CommonApiParam, void>();

export const createCategoryMappingActions = createAsyncAction(
  `@CategoryMapping/CREATE_AUDIT_TYPE_ACTIONS`,
  `@CategoryMapping/CREATE_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@CategoryMapping/CREATE_AUDIT_TYPE_ACTIONS_FAIL`,
)<CreateCategoryMappingParams, void, ErrorField[]>();

export const updateCategoryMappingActions = createAsyncAction(
  `@CategoryMapping/UPDATE_AUDIT_TYPE_ACTIONS`,
  `@CategoryMapping/UPDATE_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@CategoryMapping/UPDATE_AUDIT_TYPE_ACTIONS_FAIL`,
)<UpdateCategoryMappingParams, void, ErrorField[]>();

export const getCategoryMappingDetailActions = createAsyncAction(
  `@CategoryMapping/GET_AUDIT_TYPE_DETAIL_ACTIONS`,
  `@CategoryMapping/GET_AUDIT_TYPE_DETAIL_ACTIONS_SUCCESS`,
  `@CategoryMapping/GET_AUDIT_TYPE_DETAIL_ACTIONS_FAIL`,
)<string, CategoryMappingDetailResponse, void>();

export const clearCategoryMappingReducer = createAction(
  `@CategoryMapping/CLEAR_AUDIT_TYPE_REDUCER`,
)<void>();

export const clearCategoryMappingErrorsReducer = createAction(
  `@CategoryMapping/CLEAR_AUDIT_TYPE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@CategoryMapping/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
