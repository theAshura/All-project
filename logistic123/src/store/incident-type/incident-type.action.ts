import {
  GetIncidentTypesResponse,
  CreateIncidentTypeParams,
  UpdateIncidentTypeParams,
  IncidentTypeDetailResponse,
  CheckExitCodeParams,
  checkExitResponse,
} from 'models/api/incident-type/incident-type.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteIncidentType {
  id: string;
  isDetail?: boolean;
  getListIncidentType: () => void;
}

export const getListIncidentTypeActions = createAsyncAction(
  `@incidentType/GET_LIST_INCIDENT_TYPE_ACTIONS`,
  `@incidentType/GET_LIST_INCIDENT_TYPE_ACTIONS_SUCCESS`,
  `@incidentType/GET_LIST_INCIDENT_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, GetIncidentTypesResponse, void>();

export const deleteIncidentTypeActions = createAsyncAction(
  `@incidentType/DELETE_INCIDENT_TYPE_ACTIONS`,
  `@incidentType/DELETE_INCIDENT_TYPE_ACTIONS_SUCCESS`,
  `@incidentType/DELETE_INCIDENT_TYPE_ACTIONS_FAIL`,
)<ParamsDeleteIncidentType, CommonApiParam, void>();

export const createIncidentTypeActions = createAsyncAction(
  `@incidentType/CREATE_INCIDENT_TYPE_ACTIONS`,
  `@incidentType/CREATE_INCIDENT_TYPE_ACTIONS_SUCCESS`,
  `@incidentType/CREATE_INCIDENT_TYPE_ACTIONS_FAIL`,
)<CreateIncidentTypeParams, void, ErrorField[]>();

export const updateIncidentTypeActions = createAsyncAction(
  `@incidentType/UPDATE_INCIDENT_TYPE_ACTIONS`,
  `@incidentType/UPDATE_INCIDENT_TYPE_ACTIONS_SUCCESS`,
  `@incidentType/UPDATE_INCIDENT_TYPE_ACTIONS_FAIL`,
)<UpdateIncidentTypeParams, void, ErrorField[]>();

export const getIncidentTypeDetailActions = createAsyncAction(
  `@incidentType/GET_INCIDENT_TYPE_DETAIL_ACTIONS`,
  `@incidentType/GET_INCIDENT_TYPE_DETAIL_ACTIONS_SUCCESS`,
  `@incidentType/GET_INCIDENT_TYPE_DETAIL_ACTIONS_FAIL`,
)<string, IncidentTypeDetailResponse, void>();

export const checkExitCodeAction = createAsyncAction(
  `@incidentType/CHECK_EXIT_CODE_ACTIONS`,
  `@incidentType/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@incidentType/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, checkExitResponse, void>();

export const clearIncidentTypeReducer = createAction(
  `@incidentType/CLEAR_INCIDENT_TYPE_REDUCER`,
)<void>();

export const clearIncidentTypeErrorsReducer = createAction(
  `@incidentType/CLEAR_INCIDENT_TYPE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@incidentType/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
