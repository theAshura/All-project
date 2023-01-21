import {
  CreateMainCategoryParams,
  GetMainCategoryResponse,
  MainCategoryDetailResponse,
  UpdateMainCategoryParams,
} from 'models/api/main-category/main-category.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteMainCategory {
  id: string;
  isDetail?: boolean;
  getListMainCategory: () => void;
}

export const getListMainCategoryActions = createAsyncAction(
  `@mainCategory/GET_LIST_MAIN_CATEGORY_ACTIONS`,
  `@mainCategory/GET_LIST_MAIN_CATEGORY_ACTIONS_SUCCESS`,
  `@mainCategory/GET_LIST_MAIN_CATEGORY_ACTIONS_FAIL`,
)<CommonApiParam, GetMainCategoryResponse, void>();

export const deleteMainCategoryActions = createAsyncAction(
  `@mainCategory/DELETE_MAIN_CATEGORY_ACTIONS`,
  `@mainCategory/DELETE_MAIN_CATEGORY_ACTIONS_SUCCESS`,
  `@mainCategory/DELETE_MAIN_CATEGORY_ACTIONS_FAIL`,
)<ParamsDeleteMainCategory, CommonApiParam, void>();

export const createMainCategoryActions = createAsyncAction(
  `@mainCategory/CREATE_MAIN_CATEGORY_ACTIONS`,
  `@mainCategory/CREATE_MAIN_CATEGORY_ACTIONS_SUCCESS`,
  `@mainCategory/CREATE_MAIN_CATEGORY_ACTIONS_FAIL`,
)<CreateMainCategoryParams, void, ErrorField[]>();

export const updateMainCategoryActions = createAsyncAction(
  `@mainCategory/UPDATE_MAIN_CATEGORY_ACTIONS`,
  `@mainCategory/UPDATE_MAIN_CATEGORY_ACTIONS_SUCCESS`,
  `@mainCategory/UPDATE_MAIN_CATEGORY_ACTIONS_FAIL`,
)<UpdateMainCategoryParams, void, ErrorField[]>();

export const getMainCategoryDetailActions = createAsyncAction(
  `@mainCategory/GET_MAIN_CATEGORY_DETAIL_ACTIONS`,
  `@mainCategory/GET_MAIN_CATEGORY_DETAIL_ACTIONS_SUCCESS`,
  `@mainCategory/GET_MAIN_CATEGORY_DETAIL_ACTIONS_FAIL`,
)<string, MainCategoryDetailResponse, void>();

export const clearMainCategoryReducer = createAction(
  `@mainCategory/CLEAR_MAIN_CATEGORY_REDUCER`,
)<void>();

export const clearMainCategoryErrorsReducer = createAction(
  `@mainCategory/CLEAR_MAIN_CATEGORY_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@mainCategory/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
