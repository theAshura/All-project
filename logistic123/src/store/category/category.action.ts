import {
  CreateCategoryParams,
  UpdateCategoryParams,
  CategoryDetailResponse,
  Category,
} from 'models/api/category/category.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteCategory {
  id: string;
  isDetail?: boolean;
  getListCategory: () => void;
}

export const getListCategoryActions = createAsyncAction(
  `@category/GET_LIST_CATEGORY_ACTIONS`,
  `@category/GET_LIST_CATEGORY_ACTIONS_SUCCESS`,
  `@category/GET_LIST_CATEGORY_ACTIONS_FAIL`,
)<CommonApiParam, Category[], void>();

export const deleteCategoryActions = createAsyncAction(
  `@category/DELETE_CATEGORY_ACTIONS`,
  `@category/DELETE_CATEGORY_ACTIONS_SUCCESS`,
  `@category/DELETE_CATEGORY_ACTIONS_FAIL`,
)<ParamsDeleteCategory, CommonApiParam, void>();

export const createCategoryActions = createAsyncAction(
  `@category/CREATE_CATEGORY_ACTIONS`,
  `@category/CREATE_CATEGORY_ACTIONS_SUCCESS`,
  `@category/CREATE_CATEGORY_ACTIONS_FAIL`,
)<CreateCategoryParams, void, ErrorField[]>();

export const updateCategoryActions = createAsyncAction(
  `@category/UPDATE_CATEGORY_ACTIONS`,
  `@category/UPDATE_CATEGORY_ACTIONS_SUCCESS`,
  `@category/UPDATE_CATEGORY_ACTIONS_FAIL`,
)<UpdateCategoryParams, void, ErrorField[]>();

export const getCategoryDetailActions = createAsyncAction(
  `@category/GET_CATEGORY_DETAIL_ACTIONS`,
  `@category/GET_CATEGORY_DETAIL_ACTIONS_SUCCESS`,
  `@category/GET_CATEGORY_DETAIL_ACTIONS_FAIL`,
)<string, CategoryDetailResponse, void>();

export const clearCategoryReducer = createAction(
  `@category/CLEAR_CATEGORY_REDUCER`,
)<void>();

export const clearCategoryErrorsReducer = createAction(
  `@category/CLEAR_CATEGORY_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@category/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
