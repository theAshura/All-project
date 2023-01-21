import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetPlanDrawingsResponse,
  CreatePlanDrawingParams,
  UpdatePlanDrawingParams,
  PlanDrawingDetailResponse,
  CheckExitCodeParams,
  CheckExitResponse,
} from '../utils/model';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  handelSuccess: () => void;
}

export const getListPlanDrawingActions = createAsyncAction(
  `@planDrawing/GET_LIST_PLAN_DRAWING_ACTIONS`,
  `@planDrawing/GET_LIST_PLAN_DRAWING_ACTIONS_SUCCESS`,
  `@planDrawing/GET_LIST_PLAN_DRAWING_ACTIONS_FAIL`,
)<CommonApiParam, GetPlanDrawingsResponse, void>();

export const deletePlanDrawingActions = createAsyncAction(
  `@planDrawing/DELETE_PLAN_DRAWING_ACTIONS`,
  `@planDrawing/DELETE_PLAN_DRAWING_ACTIONS_SUCCESS`,
  `@planDrawing/DELETE_PLAN_DRAWING_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createPlanDrawingActions = createAsyncAction(
  `@planDrawing/CREATE_PLAN_DRAWING_ACTIONS`,
  `@planDrawing/CREATE_PLAN_DRAWING_ACTIONS_SUCCESS`,
  `@planDrawing/CREATE_PLAN_DRAWING_ACTIONS_FAIL`,
)<CreatePlanDrawingParams, void, ErrorField[]>();

export const checkExitCodeAction = createAsyncAction(
  `@planDrawing/CHECK_EXIT_CODE_ACTIONS`,
  `@planDrawing/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@planDrawing/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, CheckExitResponse, void>();

export const updatePlanDrawingActions = createAsyncAction(
  `@planDrawing/UPDATE_PLAN_DRAWING_ACTIONS`,
  `@planDrawing/UPDATE_PLAN_DRAWING_ACTIONS_SUCCESS`,
  `@planDrawing/UPDATE_PLAN_DRAWING_ACTIONS_FAIL`,
)<UpdatePlanDrawingParams, void, ErrorField[]>();

export const getPlanDrawingDetailActions = createAsyncAction(
  `@planDrawing/GET_PLAN_DRAWING_DETAIL_ACTIONS`,
  `@planDrawing/GET_PLAN_DRAWING_DETAIL_ACTIONS_SUCCESS`,
  `@planDrawing/GET_PLAN_DRAWING_DETAIL_ACTIONS_FAIL`,
)<string, PlanDrawingDetailResponse, void>();

export const clearPlanDrawingReducer = createAction(
  `@planDrawing/CLEAR_PLAN_DRAWING_REDUCER`,
)<void>();

export const clearPlanDrawingErrorsReducer = createAction(
  `@planDrawing/CLEAR_PLAN_DRAWING_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@planDrawing/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearPlanDrawingParamsReducer = createAction(
  `@planDrawing/CLEAR_PLAN_DRAWING_PARAMS_REDUCER`,
)<void>();
