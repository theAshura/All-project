import { CommonApiParam, ErrorField } from 'models/common.model';
import { GetListVesselScreeningParams } from 'pages/vessel-screening/utils/models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  GetListVesselScreeningClassDispensations,
  UpdateVesselClassDispensationsParams,
} from 'pages/vessel-screening/utils/models/vessel-class-dispensations.model';

export const getListVesselClassDispensationsActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_ACTIONS_FAIL`,
)<
  GetListVesselScreeningParams,
  GetListVesselScreeningClassDispensations,
  void
>();

export const updateVesselClassDispensationsActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_ACTIONS_FAIL`,
)<UpdateVesselClassDispensationsParams, void, ErrorField[]>();

export const clearVesselScreeningClassDispensationsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningClassDispensationsErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_CLASS_DISPENSATIONS_INFO_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_ACTIONS_CLASS_DISPENSATIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER_CLASS_DISPENSATIONS`,
)<CommonApiParam>();
