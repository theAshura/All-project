import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetListVesselScreeningPortStateControl,
  GetListVesselScreeningParams,
  UpdateVesselScreeningParamsPortStateControl,
  PortStateControlRequest,
} from 'pages/vessel-screening/utils/models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

// PortStateControl

export const getListVesselScreeningPortStateControlActions = createAsyncAction(
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_PORT_STATE_CONTROL_ACTIONS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_PORT_STATE_CONTROL_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_LIST_VESSEL_SCREENING_PORT_STATE_CONTROL_ACTIONS_FAIL`,
)<GetListVesselScreeningParams, GetListVesselScreeningPortStateControl, void>();

export const updateVesselScreeningPortStateControlActions = createAsyncAction(
  `@VesselScreening/UPDATE_VESSEL_SCREENING_PORT_STATE_CONTROL_ACTIONS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_PORT_STATE_CONTROL_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_VESSEL_SCREENING_PORT_STATE_CONTROL_ACTIONS_FAIL`,
)<UpdateVesselScreeningParamsPortStateControl, void, ErrorField[]>();

export const getVesselPortStateControlRequestDetailActions = createAsyncAction(
  `@VesselScreening/GET_PORT_STATE_CONTROL_REQUEST_DETAIL_ACTIONS`,
  `@VesselScreening/GET_PORT_STATE_CONTROL_REQUEST_DETAIL_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_PORT_STATE_CONTROL_REQUEST_DETAIL_ACTIONS_FAIL`,
)<CommonApiParam, PortStateControlRequest, void>();

export const clearVesselScreeningPortStateControlReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_PORT_STATE_CONTROL_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningPortStateControlErrorsReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_PORT_STATE_CONTROL_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_PORT_STATE_CONTROL_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER_PORT_STATE_CONTROL`,
)<CommonApiParam>();
