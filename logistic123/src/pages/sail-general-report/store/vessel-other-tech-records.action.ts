import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetListVesselScreeningOtherTechRecords,
  GetListVesselScreeningParams,
  UpdateVesselScreeningParamsOtherTechRecords,
} from 'pages/vessel-screening/utils/models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

export const getListVesselScreeningOtherTechRecordsActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_OTHER_TECH_RECORDS_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_OTHER_TECH_RECORDS_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_OTHER_TECH_RECORDS_ACTIONS_FAIL`,
)<GetListVesselScreeningParams, GetListVesselScreeningOtherTechRecords, void>();

export const updateVesselScreeningOtherTechRecordsActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_OTHER_TECH_RECORDS_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_OTHER_TECH_RECORDS_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_OTHER_TECH_RECORDS_ACTIONS_FAIL`,
)<UpdateVesselScreeningParamsOtherTechRecords, void, ErrorField[]>();

export const clearVesselScreeningOtherTechRecordsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_OTHER_TECH_RECORDS_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningOtherTechRecordsErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_OTHER_TECH_RECORDS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_OTHER_TECH_RECORDS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER_OTHER_TECH_RECORDS`,
)<CommonApiParam>();
