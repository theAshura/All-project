import { CommonApiParam, CommonErrorResponse } from 'models/common.model';
import { createAsyncAction } from 'typesafe-actions';
import {
  CreateRepeateFindingCalculationParams,
  GetRepeateFindingCalculationResponse,
  RepeateFindingCalculationDetailResponse,
  UpdateRepeateFindingCalculationParams,
} from '../utils/model';

interface ParamsDeleteRepeateFindingCalculation {
  id: string;
  isDetail?: boolean;
  getListRepeateFindingCalculation: () => void;
}

export const getListRepeateFindingCalculationActions = createAsyncAction(
  `@repeateFindingCalculation/GET_LIST_repeateFindingCalculation_ACTIONS`,
  `@repeateFindingCalculation/GET_LIST_repeateFindingCalculation_ACTIONS_SUCCESS`,
  `@repeateFindingCalculation/GET_LIST_repeateFindingCalculation_ACTIONS_FAIL`,
)<CommonApiParam, GetRepeateFindingCalculationResponse, void>();

export const createRepeateFindingCalculationActions = createAsyncAction(
  `@repeateFindingCalculation/CREATE_repeateFindingCalculation_ACTIONS`,
  `@repeateFindingCalculation/CREATE_repeateFindingCalculation_ACTIONS_SUCCESS`,
  `@repeateFindingCalculation/CREATE_repeateFindingCalculation_ACTIONS_FAIL`,
)<CreateRepeateFindingCalculationParams, void, CommonErrorResponse>();

export const deleteRepeateFindingCalculationActions = createAsyncAction(
  `@repeateFindingCalculation/DELETE_repeateFindingCalculation_ACTIONS`,
  `@repeateFindingCalculation/DELETE_repeateFindingCalculation_ACTIONS_SUCCESS`,
  `@repeateFindingCalculation/DELETE_repeateFindingCalculation_ACTIONS_FAIL`,
)<ParamsDeleteRepeateFindingCalculation, CommonApiParam, void>();

export const getRepeateFindingCalculationDetailActions = createAsyncAction(
  `@repeateFindingCalculation/GET_repeateFindingCalculation_DETAIL_ACTIONS`,
  `@repeateFindingCalculation/GET_repeateFindingCalculation_DETAIL_ACTIONS_SUCCESS`,
  `@repeateFindingCalculation/GET_repeateFindingCalculation_DETAIL_ACTIONS_FAIL`,
)<string, RepeateFindingCalculationDetailResponse, void>();

export const updateRepeateFindingCalculationActions = createAsyncAction(
  `@repeateFindingCalculation/UPDATE_repeateFindingCalculation_ACTIONS`,
  `@repeateFindingCalculation/UPDATE_repeateFindingCalculation_ACTIONS_SUCCESS`,
  `@repeateFindingCalculation/UPDATE_repeateFindingCalculation_ACTIONS_FAIL`,
)<UpdateRepeateFindingCalculationParams, void, CommonErrorResponse>();
