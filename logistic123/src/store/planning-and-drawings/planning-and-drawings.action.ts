import {
  GetPlanningAndDrawingsResponse,
  CreatePlanningAndDrawingsParams,
  UpdatePlanningAndDrawingsParams,
  GetPlanningAndDrawingsMasterResponse,
  GetPlanningAndDrawingsBodyResponse,
} from 'models/api/planning-and-drawings/planning-and-drawings.model';
import { PlansAndDrawingDetailResponse } from 'models/api/plans-and-drawings/plans-and-drawings.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeletePlanningAndDrawings {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListPlanningAndDrawingsActions = createAsyncAction(
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_ACTIONS`,
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_ACTIONS_FAIL`,
)<CommonApiParam, GetPlanningAndDrawingsResponse, void>();

export const getListPlanningAndDrawingsMasterActions = createAsyncAction(
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_MASTER_ACTIONS`,
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_MASTER_ACTIONS_SUCCESS`,
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, GetPlanningAndDrawingsMasterResponse, void>();

export const getListPlanningAndDrawingsBodyActions = createAsyncAction(
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_BODY_ACTIONS`,
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_BODY_ACTIONS_SUCCESS`,
  `@planningAndDrawings/GET_LIST_PLANNING_AND_DRAWINGS_BODY_ACTIONS_FAIL`,
)<CommonApiParam, GetPlanningAndDrawingsBodyResponse, void>();

export const createPlanningAndDrawingsActions = createAsyncAction(
  `@planningAndDrawings/CREATE_PLANNING_AND_DRAWINGS_ACTIONS`,
  `@planningAndDrawings/CREATE_PLANNING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@planningAndDrawings/CREATE_PLANNING_AND_DRAWINGS_ACTIONS_FAIL`,
)<CreatePlanningAndDrawingsParams, void, ErrorField[]>();

export const deletePlanningAndDrawingsActions = createAsyncAction(
  `@planningAndDrawings/DELETE_PLANNING_AND_DRAWINGS_ACTIONS`,
  `@planningAndDrawings/DELETE_PLANNING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@planningAndDrawings/DELETE_PLANNING_AND_DRAWINGS_ACTIONS_FAIL`,
)<ParamsDeletePlanningAndDrawings, CommonApiParam, void>();

export const updatePlanningAndDrawingsActions = createAsyncAction(
  `@planningAndDrawings/UPDATE_PLANNING_AND_DRAWINGS_ACTIONS`,
  `@planningAndDrawings/UPDATE_PLANNING_AND_DRAWINGS_ACTIONS_SUCCESS`,
  `@planningAndDrawings/UPDATE_PLANNING_AND_DRAWINGS_ACTIONS_FAIL`,
)<UpdatePlanningAndDrawingsParams, void, ErrorField[]>();

export const getPlanningAndDrawingsDetailActions = createAsyncAction(
  `@planningAndDrawings/GET_PLANNING_AND_DRAWINGS_DETAIL_ACTIONS`,
  `@planningAndDrawings/GET_PLANNING_AND_DRAWINGS_DETAIL_ACTIONS_SUCCESS`,
  `@planningAndDrawings/GET_PLANNING_AND_DRAWINGS_DETAIL_ACTIONS_FAIL`,
)<string, PlansAndDrawingDetailResponse, void>();

export const clearPlanningAndDrawingsReducer = createAction(
  `@planningAndDrawings/CLEAR_PLANNING_AND_DRAWINGS_REDUCER`,
)<void>();

export const clearPlanningAndDrawingsErrorsReducer = createAction(
  `@planningAndDrawings/CLEAR_PLANNING_AND_DRAWINGS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@planningAndDrawings/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearPlanningAndDrawingsParamsReducer = createAction(
  `@planningAndDrawings/CLEAR_PLANNING_AND_DRAWINGS_PARAMS_REDUCER`,
)<void>();

export const setDataFilterAction = createAction(
  `@planningAndDrawings/SET_DATA_FILTER`,
)<CommonApiParam>();
