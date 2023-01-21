import {
  GetIncidentInvestigationsResponse,
  CreateIncidentInvestigationParams,
  UpdateIncidentInvestigationParams,
  IncidentInvestigationDetailResponse,
} from 'models/api/incident-investigation/incident-investigation.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteIncidentInvestigation {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListIncidentInvestigationActions = createAsyncAction(
  `@IncidentInvestigation/GET_LIST_INCIDENT_INVESTIGATION_ACTIONS`,
  `@IncidentInvestigation/GET_LIST_INCIDENT_INVESTIGATION_ACTIONS_SUCCESS`,
  `@IncidentInvestigation/GET_LIST_INCIDENT_INVESTIGATION_ACTIONS_FAIL`,
)<CommonApiParam, GetIncidentInvestigationsResponse, void>();

export const deleteIncidentInvestigationActions = createAsyncAction(
  `@IncidentInvestigation/DELETE_INCIDENT_INVESTIGATION_ACTIONS`,
  `@IncidentInvestigation/DELETE_INCIDENT_INVESTIGATION_ACTIONS_SUCCESS`,
  `@IncidentInvestigation/DELETE_INCIDENT_INVESTIGATION_ACTIONS_FAIL`,
)<ParamsDeleteIncidentInvestigation, CommonApiParam, void>();

export const createIncidentInvestigationActions = createAsyncAction(
  `@IncidentInvestigation/CREATE_INCIDENT_INVESTIGATION_ACTIONS`,
  `@IncidentInvestigation/CREATE_INCIDENT_INVESTIGATION_ACTIONS_SUCCESS`,
  `@IncidentInvestigation/CREATE_INCIDENT_INVESTIGATION_ACTIONS_FAIL`,
)<CreateIncidentInvestigationParams, void, ErrorField[]>();

export const updateIncidentInvestigationActions = createAsyncAction(
  `@IncidentInvestigation/UPDATE_INCIDENT_INVESTIGATION_ACTIONS`,
  `@IncidentInvestigation/UPDATE_INCIDENT_INVESTIGATION_ACTIONS_SUCCESS`,
  `@IncidentInvestigation/UPDATE_INCIDENT_INVESTIGATION_ACTIONS_FAIL`,
)<UpdateIncidentInvestigationParams, void, ErrorField[]>();

export const getIncidentInvestigationDetailActions = createAsyncAction(
  `@IncidentInvestigation/GET_INCIDENT_INVESTIGATION_DETAIL_ACTIONS`,
  `@IncidentInvestigation/GET_INCIDENT_INVESTIGATION_DETAIL_ACTIONS_SUCCESS`,
  `@IncidentInvestigation/GET_INCIDENT_INVESTIGATION_DETAIL_ACTIONS_FAIL`,
)<string, IncidentInvestigationDetailResponse, void>();

export const clearIncidentInvestigationReducer = createAction(
  `@IncidentInvestigation/CLEAR_INCIDENT_INVESTIGATION_REDUCER`,
)<void>();

export const clearIncidentInvestigationErrorsReducer = createAction(
  `@IncidentInvestigation/CLEAR_INCIDENT_INVESTIGATION_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@IncidentInvestigation/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@IncidentInvestigation/SET_DATA_FILTER`,
)<CommonApiParam>();
