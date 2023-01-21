import {
  CreateConditionClassDispensationsParams,
  GetConditionOfClassResponse,
  UpdateConditionOfClassParams,
  ConditionOfClassDetailResponse,
} from 'models/api/condition-of-class/condition-of-class.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteConditionOfClass {
  id: string;
  isDetail?: boolean;
  getListConditionOfClass: () => void;
}

export const getListConditionOfClassActions = createAsyncAction(
  `@conditionOfClass/GET_LIST_CONDITION_OF_CLASS_ACTIONS`,
  `@conditionOfClass/GET_LIST_CONDITION_OF_CLASS_ACTIONS_SUCCESS`,
  `@conditionOfClass/GET_LIST_CONDITION_OF_CLASS_ACTIONS_FAIL`,
)<CommonApiParam, GetConditionOfClassResponse, void>();

export const createConditionOfClassActions = createAsyncAction(
  `@conditionOfClass/CREATE_CONDITION_OF_CLASS_ACTIONS`,
  `@conditionOfClass/CREATE_CONDITION_OF_CLASS_ACTIONS_SUCCESS`,
  `@conditionOfClass/CREATE_CONDITION_OF_CLASS_ACTIONS_FAIL`,
)<CreateConditionClassDispensationsParams, void, ErrorField[]>();

export const deleteConditionOfClassActions = createAsyncAction(
  `@conditionOfClass/DELETE_CONDITION_OF_CLASS_ACTIONS`,
  `@conditionOfClass/DELETE_CONDITION_OF_CLASS_ACTIONS_SUCCESS`,
  `@conditionOfClass/DELETE_CONDITION_OF_CLASS_ACTIONS_FAIL`,
)<ParamsDeleteConditionOfClass, CommonApiParam, void>();

export const updateConditionOfClassActions = createAsyncAction(
  `@conditionOfClass/UPDATE_CONDITION_OF_CLASS_ACTIONS`,
  `@conditionOfClass/UPDATE_CONDITION_OF_CLASS_ACTIONS_SUCCESS`,
  `@conditionOfClass/UPDATE_CONDITION_OF_CLASS_ACTIONS_FAIL`,
)<UpdateConditionOfClassParams, void, ErrorField[]>();

export const getConditionOfClassDetailActions = createAsyncAction(
  `@conditionOfClass/GET_CONDITION_OF_CLASS_DETAIL_ACTIONS`,
  `@conditionOfClass/GET_CONDITION_OF_CLASS_DETAIL_ACTIONS_SUCCESS`,
  `@conditionOfClass/GET_CONDITION_OF_CLASS_DETAIL_ACTIONS_FAIL`,
)<string, ConditionOfClassDetailResponse, void>();

export const clearConditionOfClassReducer = createAction(
  `@conditionOfClass/CLEAR_CONDITION_OF_CLASS_REDUCER`,
)<void>();

export const clearConditionOfClassErrorsReducer = createAction(
  `@conditionOfClass/CLEAR_CONDITION_OF_CLASS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@conditionOfClass/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearConditionOfClassParamsReducer = createAction(
  `@conditionOfClass/CLEAR_CONDITION_OF_CLASS_PARAMS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@conditionOfClass/SET_DATA_FILTER`,
)<CommonApiParam>();
