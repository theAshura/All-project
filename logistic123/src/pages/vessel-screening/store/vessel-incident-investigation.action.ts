import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetListVesselScreeningIncidentInvestigation,
  GetListVesselScreeningParams,
  UpdateVesselScreeningParamsIncidentInvestigation,
} from 'pages/vessel-screening/utils/models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

// maintenance

export const getListVesselScreeningIncidentInvestigationActions =
  createAsyncAction(
    `@VesselScreening/GET_LIST_VESSEL_SCREENING_INCIDENT_INVESTIGATION_ACTIONS`,
    `@VesselScreening/GET_LIST_VESSEL_SCREENING_INCIDENT_INVESTIGATION_ACTIONS_SUCCESS`,
    `@VesselScreening/GET_LIST_VESSEL_SCREENING_INCIDENT_INVESTIGATION_ACTIONS_FAIL`,
  )<
    GetListVesselScreeningParams,
    GetListVesselScreeningIncidentInvestigation,
    void
  >();

export const updateVesselScreeningIncidentInvestigationActions =
  createAsyncAction(
    `@VesselScreening/UPDATE_VESSEL_SCREENING_INCIDENT_INVESTIGATION_ACTIONS`,
    `@VesselScreening/UPDATE_VESSEL_SCREENING_INCIDENT_INVESTIGATION_ACTIONS_SUCCESS`,
    `@VesselScreening/UPDATE_VESSEL_SCREENING_INCIDENT_INVESTIGATION_ACTIONS_FAIL`,
  )<UpdateVesselScreeningParamsIncidentInvestigation, void, ErrorField[]>();

export const clearVesselScreeningIncidentInvestigationReducer = createAction(
  `@VesselScreening/CLEAR_VESSEL_SCREENING_INCIDENT_INVESTIGATION_REDUCER`,
)<void | boolean>();

export const clearVesselScreeningIncidentInvestigationErrorsReducer =
  createAction(
    `@VesselScreening/CLEAR_VESSEL_SCREENING_INCIDENT_INVESTIGATION_ERRORS_REDUCER`,
  )<void>();

export const updateParamsActions = createAction(
  `@VesselScreening/UPDATE_PARAMS_INCIDENT_INVESTIGATION_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@VesselScreening/SET_DATA_FILTER_INCIDENT_INVESTIGATION`,
)<CommonApiParam>();
