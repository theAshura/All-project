import {
  CreateThirdCategoryParams,
  GetThirdCategoryResponse,
  ThirdCategoryDetailResponse,
  UpdateThirdCategoryParams,
} from 'models/api/third-category/third-category.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteThirdCategory {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListThirdCategoryActions = createAsyncAction(
  `@thirdCategory/GET_LIST_THIRD_CATEGORY_ACTIONS`,
  `@thirdCategory/GET_LIST_THIRD_CATEGORY_ACTIONS_SUCCESS`,
  `@thirdCategory/GET_LIST_THIRD_CATEGORY_ACTIONS_FAIL`,
)<CommonApiParam, GetThirdCategoryResponse, void>();

export const deleteThirdCategoryActions = createAsyncAction(
  `@thirdCategory/DELETE_THIRD_CATEGORY_ACTIONS`,
  `@thirdCategory/DELETE_THIRD_CATEGORY_ACTIONS_SUCCESS`,
  `@thirdCategory/DELETE_THIRD_CATEGORY_ACTIONS_FAIL`,
)<ParamsDeleteThirdCategory, CommonApiParam, void>();

export const createThirdCategoryActions = createAsyncAction(
  `@thirdCategory/CREATE_THIRD_CATEGORY_ACTIONS`,
  `@thirdCategory/CREATE_THIRD_CATEGORY_ACTIONS_SUCCESS`,
  `@thirdCategory/CREATE_THIRD_CATEGORY_ACTIONS_FAIL`,
)<CreateThirdCategoryParams, void, ErrorField[]>();

export const updateThirdCategoryActions = createAsyncAction(
  `@thirdCategory/UPDATE_THIRD_CATEGORY_ACTIONS`,
  `@thirdCategory/UPDATE_THIRD_CATEGORY_ACTIONS_SUCCESS`,
  `@thirdCategory/UPDATE_THIRD_CATEGORY_ACTIONS_FAIL`,
)<UpdateThirdCategoryParams, void, ErrorField[]>();

export const getThirdCategoryDetailActions = createAsyncAction(
  `@thirdCategory/GET_THIRD_CATEGORY_DETAIL_ACTIONS`,
  `@thirdCategory/GET_THIRD_CATEGORY_DETAIL_ACTIONS_SUCCESS`,
  `@thirdCategory/GET_THIRD_CATEGORY_DETAIL_ACTIONS_FAIL`,
)<string, ThirdCategoryDetailResponse, void>();

export const clearThirdCategoryReducer = createAction(
  `@thirdCategory/CLEAR_THIRD_CATEGORY_REDUCER`,
)<void>();

export const clearThirdCategoryErrorsReducer = createAction(
  `@thirdCategory/CLEAR_THIRD_CATEGORY_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@thirdCategory/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
