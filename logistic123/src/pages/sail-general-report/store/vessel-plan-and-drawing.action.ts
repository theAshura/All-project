import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  GetVesselPlanAndDrawingsResponse,
  UpdatePlanAndDrawingsRequestParams,
} from '../utils/models/plan-and-drawing.model';

export const getListVesselPlanAndDrawingActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_PLAN_AND_DRAWING_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_PLAN_AND_DRAWING_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_PLAN_AND_DRAWING_ACTIONS_FAIL`,
)<CommonApiParam, GetVesselPlanAndDrawingsResponse, void>();

export const updateVesselPlanAndDrawingsActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_PLAN_AND_DRAWING_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_PLAN_AND_DRAWING_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_PLAN_AND_DRAWING_INFO_ACTIONS_FAIL`,
)<UpdatePlanAndDrawingsRequestParams, void, ErrorField[]>();

export const clearVesselPlanAndDrawingsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_PLAN_AND_DRAWING_REDUCER`,
)<void | boolean>();

export const clearVesselPlanAndDrawingsErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_PLAN_AND_DRAWING_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_ACTIONS_PLAN_AND_DRAWING`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER_PLAN_AND_DRAWINGS`,
)<CommonApiParam>();
