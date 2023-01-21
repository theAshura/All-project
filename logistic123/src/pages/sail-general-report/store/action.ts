import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetVesselScreeningResponse,
  CreateVesselScreeningParams,
  VesselScreeningDetail,
  ShipParticular,
} from '../utils/models/common.model';

export const getListVesselScreeningActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_ACTIONS_FAIL`,
)<CommonApiParam, GetVesselScreeningResponse, void>();

export const getVesselScreeningDetailActions = createAsyncAction(
  `@VesselScreening/GET_VESSEL_SCREENING_DETAIL_ACTIONS`,
  `@VesselScreening/GET_VESSEL_SCREENING_DETAIL_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_VESSEL_SCREENING_DETAIL_ACTIONS_FAIL`,
)<string, VesselScreeningDetail, void>();

export const updateVesselShipParticularActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_DETAIL_SHIP_PARTICULAR_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_DETAIL_SHIP_PARTICULAR_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_DETAIL_SHIP_PARTICULAR_ACTIONS_FAIL`,
)<ShipParticular, void, void>();

export const createVesselScreeningActions = createAsyncAction(
  `@VesselScreening/CREATE_SELF_ASSESSMENT_ACTIONS`,
  `@VesselScreening/CREATE_SELF_ASSESSMENT_ACTIONS_SUCCESS`,
  `@VesselScreening/CREATE_SELF_ASSESSMENT_ACTIONS_FAIL`,
)<CreateVesselScreeningParams, void, ErrorField[]>();

export const clearVesselScreeningReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER`,
)<CommonApiParam>();
