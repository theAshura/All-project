import {
  CreateSecondCategoryParams,
  GetSecondCategoryResponse,
  SecondCategoryDetailResponse,
  SecondCategory,
  UpdateSecondCategoryParams,
} from 'models/api/second-category/second-category.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteSecondCategory {
  id: string;
  isDetail?: boolean;
  getListSecondCategory: () => void;
}

export const getListSecondCategoryActions = createAsyncAction(
  `@secondCategory/GET_LIST_SECOND_CATEGORY_ACTIONS`,
  `@secondCategory/GET_LIST_SECOND_CATEGORY_ACTIONS_SUCCESS`,
  `@secondCategory/GET_LIST_SECOND_CATEGORY_ACTIONS_FAIL`,
)<CommonApiParam, GetSecondCategoryResponse, void>();

export const getListSecondCategoryByMainIdActions = createAsyncAction(
  `@secondCategory/GET_LIST_SECOND_CATEGORY_BY_MAIN_ID_ACTIONS`,
  `@secondCategory/GET_LIST_SECOND_CATEGORY_BY_MAIN_ID_ACTIONS_SUCCESS`,
  `@secondCategory/GET_LIST_SECOND_CATEGORY_BY_MAIN_ID_ACTIONS_FAIL`,
)<CommonApiParam, SecondCategory[], void>();

export const deleteSecondCategoryActions = createAsyncAction(
  `@secondCategory/DELETE_SECOND_CATEGORY_ACTIONS`,
  `@secondCategory/DELETE_SECOND_CATEGORY_ACTIONS_SUCCESS`,
  `@secondCategory/DELETE_SECOND_CATEGORY_ACTIONS_FAIL`,
)<ParamsDeleteSecondCategory, CommonApiParam, void>();

export const createSecondCategoryActions = createAsyncAction(
  `@secondCategory/CREATE_SECOND_CATEGORY_ACTIONS`,
  `@secondCategory/CREATE_SECOND_CATEGORY_ACTIONS_SUCCESS`,
  `@secondCategory/CREATE_SECOND_CATEGORY_ACTIONS_FAIL`,
)<CreateSecondCategoryParams, void, ErrorField[]>();

export const updateSecondCategoryActions = createAsyncAction(
  `@secondCategory/UPDATE_SECOND_CATEGORY_ACTIONS`,
  `@secondCategory/UPDATE_SECOND_CATEGORY_ACTIONS_SUCCESS`,
  `@secondCategory/UPDATE_SECOND_CATEGORY_ACTIONS_FAIL`,
)<UpdateSecondCategoryParams, void, ErrorField[]>();

export const getSecondCategoryDetailActions = createAsyncAction(
  `@secondCategory/GET_SECOND_CATEGORY_DETAIL_ACTIONS`,
  `@secondCategory/GET_SECOND_CATEGORY_DETAIL_ACTIONS_SUCCESS`,
  `@secondCategory/GET_SECOND_CATEGORY_DETAIL_ACTIONS_FAIL`,
)<string, SecondCategoryDetailResponse, void>();

export const clearSecondCategoryReducer = createAction(
  `@secondCategory/CLEAR_SECOND_CATEGORY_REDUCER`,
)<void>();

export const clearSecondCategoryErrorsReducer = createAction(
  `@secondCategory/CLEAR_SECOND_CATEGORY_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@secondCategory/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
