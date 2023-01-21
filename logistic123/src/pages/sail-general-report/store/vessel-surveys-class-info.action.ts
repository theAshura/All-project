import { CommonApiParam, ErrorField } from 'models/common.model';
import { GetListVesselScreeningParams } from 'pages/vessel-screening/utils/models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  GetListVesselScreeningSurveysClassInfo,
  UpdateVesselSurveysClassInfoParams,
} from 'pages/vessel-screening/utils/models/vessel-surveys-class-info.model';

export const getListVesselSurveysClassInfoActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_SURVEYS_CLASS_INFO_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_SURVEYS_CLASS_INFO_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_SURVEYS_CLASS_INFO_ACTIONS_FAIL`,
)<GetListVesselScreeningParams, GetListVesselScreeningSurveysClassInfo, void>();

export const updateVesselSurveysClassInfoActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_SURVEYS_CLASS_INFO_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_SURVEYS_CLASS_INFO_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_SURVEYS_CLASS_INFO_ACTIONS_FAIL`,
)<UpdateVesselSurveysClassInfoParams, void, ErrorField[]>();

export const clearVesselScreeningSurveysClassInfoReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_SURVEYS_CLASS_INFO_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningSurveysClassInfoErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_SURVEYS_CLASS_INFO_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER`,
)<CommonApiParam>();
