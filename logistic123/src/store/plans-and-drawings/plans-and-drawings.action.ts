import {
  GetPlansAndDrawingsResponse,
  CreatePlansAndDrawingParams,
  UpdatePlansAndDrawingParams,
  PlansAndDrawingsDetailParams,
  PlansAndDrawing,
} from 'models/api/plans-and-drawings/plans-and-drawings.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeletePlansAndDrawing {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListPlansAndDrawingMasterActions = createAsyncAction(
  `@PlansAndDrawing/GET_LIST_PLANING_AND_DRAWINGS_ACTIONS`,
  `@PlansAndDrawing/GET_LIST_PLANING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@PlansAndDrawing/GET_LIST_PLANING_AND_DRAWINGS_ACTIONS_FAIL`,
)<CommonApiParam, GetPlansAndDrawingsResponse, void>();

export const deletePlansAndDrawingActions = createAsyncAction(
  `@PlansAndDrawing/DELETE_PLANING_AND_DRAWINGS_ACTIONS`,
  `@PlansAndDrawing/DELETE_PLANING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@PlansAndDrawing/DELETE_PLANING_AND_DRAWINGS_ACTIONS_FAIL`,
)<ParamsDeletePlansAndDrawing, CommonApiParam, void>();

export const createPlansAndDrawingActions = createAsyncAction(
  `@PlansAndDrawing/CREATE_PLANING_AND_DRAWINGS_ACTIONS`,
  `@PlansAndDrawing/CREATE_PLANING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@PlansAndDrawing/CREATE_PLANING_AND_DRAWINGS_ACTIONS_FAIL`,
)<CreatePlansAndDrawingParams, void, ErrorField[]>();

export const updatePlansAndDrawingMasterActions = createAsyncAction(
  `@PlansAndDrawing/UPDATE_PLANING_AND_DRAWINGS_ACTIONS`,
  `@PlansAndDrawing/UPDATE_PLANING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@PlansAndDrawing/UPDATE_PLANING_AND_DRAWINGS_ACTIONS_FAIL`,
)<UpdatePlansAndDrawingParams, void, ErrorField[]>();

export const getPlansAndDrawingDetailActions = createAsyncAction(
  `@PlansAndDrawing/GET_PLANING_AND_DRAWINGS_DETAIL_ACTIONS`,
  `@PlansAndDrawing/GET_PLANING_AND_DRAWINGS_DETAIL_ACTIONS_SUCCESS`,
  `@PlansAndDrawing/GET_PLANING_AND_DRAWINGS_DETAIL_ACTIONS_FAIL`,
)<PlansAndDrawingsDetailParams, PlansAndDrawing, void>();

export const clearPlansAndDrawingReducer = createAction(
  `@PlansAndDrawing/CLEAR_PLANING_AND_DRAWINGS_REDUCER`,
)<void>();

export const clearPlansAndDrawingErrorsReducer = createAction(
  `@PlansAndDrawing/CLEAR_PLANING_AND_DRAWINGS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@PlansAndDrawing/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@PlansAndDrawing/SET_DATA_FILTER`,
)<CommonApiParam>();
