import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetListIncidentResponse,
  CreateIncidentParams,
  IncidentDetail,
  UpdateIncidentParams,
  NumberIncident,
  IncidentPlace,
  TypeOfIncident,
  ReviewStatus,
  RiskDetail,
} from '../utils/models/common.model';

interface ParamsDeleteIncident {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListIncidentActions = createAsyncAction(
  `@incidents/GET_LIST_INCIDENTS_ACTIONS`,
  `@incidents/GET_LIST_INCIDENTS_ACTIONS_SUCCESS`,
  `@incidents/GET_LIST_INCIDENTS_ACTIONS_FAIL`,
)<CommonApiParam, GetListIncidentResponse, void>();

export const getIncidentDetailActions = createAsyncAction(
  `@incidents/GET_INCIDENTS_DETAIL_ACTIONS`,
  `@incidents/GET_INCIDENTS_DETAIL_ACTIONS_SUCCESS`,
  `@incidents/GET_INCIDENTS_DETAIL_ACTIONS_FAIL`,
)<string, IncidentDetail, void>();

export const createIncidentActions = createAsyncAction(
  `@incidents/CREATE_INCIDENTS_ACTIONS`,
  `@incidents/CREATE_INCIDENTS_ACTIONS_SUCCESS`,
  `@incidents/CREATE_INCIDENTS_ACTIONS_FAIL`,
)<CreateIncidentParams, void, ErrorField[]>();

export const updateIncidentsActions = createAsyncAction(
  `@incidents/UPDATE_INCIDENTS_ACTIONS`,
  `@incidents/UPDATE_INCIDENTS_ACTIONS_SUCCESS`,
  `@incidents/UPDATE_INCIDENTS_ACTIONS_FAIL`,
)<UpdateIncidentParams, void, ErrorField[]>();

export const deleteIncidentsActions = createAsyncAction(
  `@incidents/DELETE_INCIDENTS_ACTIONS`,
  `@incidents/DELETE_INCIDENTS_ACTIONS_SUCCESS`,
  `@incidents/DELETE_INCIDENTS_ACTIONS_FAIL`,
)<ParamsDeleteIncident, CommonApiParam, void>();

// summary

export const getNumberIncidentsActions = createAsyncAction(
  `@incidents/GET_NUMBER_INCIDENTS_ACTIONS`,
  `@incidents/GET_NUMBER_INCIDENTS_ACTIONS_SUCCESS`,
  `@incidents/GET_NUMBER_INCIDENTS_ACTIONS_FAIL`,
)<CommonApiParam, NumberIncident[], void>();

export const getIncidentPlaceActions = createAsyncAction(
  `@incidents/GET_INCIDENTS_PLACE_ACTIONS`,
  `@incidents/GET_INCIDENTS_PLACE_ACTIONS_SUCCESS`,
  `@incidents/GET_INCIDENTS_PLACE_ACTIONS_FAIL`,
)<CommonApiParam, IncidentPlace[], void>();

export const getTypeOfIncidentActions = createAsyncAction(
  `@incidents/GET_TYPE_OF_INCIDENTS_ACTIONS`,
  `@incidents/GET_TYPE_OF_INCIDENTS_ACTIONS_SUCCESS`,
  `@incidents/GET_TYPE_OF_INCIDENTS_ACTIONS_FAIL`,
)<CommonApiParam, TypeOfIncident[], void>();

export const getReviewStatusActions = createAsyncAction(
  `@incidents/GET_REVIEW_STATUS_INCIDENT_ACTIONS`,
  `@incidents/GET_REVIEW_STATUS_INCIDENT_ACTIONS_SUCCESS`,
  `@incidents/GET_REVIEW_STATUS_INCIDENT_ACTIONS_FAIL`,
)<CommonApiParam, ReviewStatus[], void>();

export const getRiskDetailsActions = createAsyncAction(
  `@incidents/GET_RISK_DETAILS_INCIDENT_ACTIONS`,
  `@incidents/GET_RISK_DETAILS_INCIDENT_ACTIONS_SUCCESS`,
  `@incidents/GET_RISK_DETAILS_INCIDENT_ACTIONS_FAIL`,
)<CommonApiParam, RiskDetail[], void>();

export const clearIncidentReducer = createAction(
  `@incidents/CLEAR_INCIDENTS_REDUCER`,
)<void | boolean>();

export const clearIncidentErrorsReducer = createAction(
  `@incidents/CLEAR_INCIDENTS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@incidents/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@incidents/SET_DATA_FILTER`,
)<CommonApiParam>();
