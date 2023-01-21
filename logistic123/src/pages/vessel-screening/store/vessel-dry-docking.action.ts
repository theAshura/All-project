import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetListVesselScreeningDryDocking,
  GetListVesselScreeningParams,
  UpdateVesselScreeningParamsDryDocking,
} from 'pages/vessel-screening/utils/models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

// maintenance

export const getListVesselScreeningDryDockingActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_DRY_DOCKING_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_DRY_DOCKING_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_DRY_DOCKING_ACTIONS_FAIL`,
)<GetListVesselScreeningParams, GetListVesselScreeningDryDocking, void>();

export const updateVesselScreeningDryDockingActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_DRY_DOCKING_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_DRY_DOCKING_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_DRY_DOCKING_ACTIONS_FAIL`,
)<UpdateVesselScreeningParamsDryDocking, void, ErrorField[]>();

export const clearVesselScreeningDryDockingReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningDryDockingErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER`,
)<CommonApiParam>();
