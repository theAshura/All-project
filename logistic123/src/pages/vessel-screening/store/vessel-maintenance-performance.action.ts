import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetListVesselScreeningMaintenance,
  GetListVesselScreeningParams,
  UpdateVesselScreeningParamsMaintenance,
} from 'pages/vessel-screening/utils/models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

// maintenance

export const getListVesselScreeningMaintenanceActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_MAINTENANCE_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_MAINTENANCE_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_MAINTENANCE_ACTIONS_FAIL`,
)<GetListVesselScreeningParams, GetListVesselScreeningMaintenance, void>();

export const updateVesselScreeningMaintenanceActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_MAINTENANCE_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_MAINTENANCE_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_MAINTENANCE_ACTIONS_FAIL`,
)<UpdateVesselScreeningParamsMaintenance, void, ErrorField[]>();

export const clearVesselScreeningMaintenanceReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningMaintenanceErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER`,
)<CommonApiParam>();
