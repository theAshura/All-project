import {
  ExternalInspectionsRequests,
  VesselScreeningExternalInspection,
  GetVesselScreeningExternalInspectionsResponse,
  UpdateExternalInspectionRequestParams,
} from 'pages/vessel-screening/utils/models/external-inspection.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const clearVesselExternalInspectionReducer = createAction(
  `@VesselScreening/CLEAR_EXTERNAL_INSPECTION_REDUCER`,
)<void | boolean>();

export const clearVesselExternalInspectionErrorsReducer = createAction(
  `@VesselScreening/CLEAR_EXTERNAL_INSPECTION_ERRORS_REDUCER`,
)<void>();

export const updateExternalInspectionParamsActions = createAction(
  `@VesselScreening/UPDATE_EXTERNAL_INSPECTION_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setExternalInspectionDataFilterAction = createAction(
  `@VesselScreening/SET_EXTERNAL_INSPECTION_DATA_FILTER`,
)<CommonApiParam>();

export const getListVesselScreeningExternalInspectionActions =
  createAsyncAction(
    `@VesselScreening/GET_LIST_EXTERNAL_INSPECTION_ACTIONS`,
    `@VesselScreening/GET_LIST_EXTERNAL_INSPECTION_ACTIONS_SUCCESS`,
    `@VesselScreening/GET_LIST_EXTERNAL_INSPECTION_ACTIONS_FAIL`,
  )<CommonApiParam, GetVesselScreeningExternalInspectionsResponse, void>();

export const getVesselScreeningExternalInspectionDetailActions =
  createAsyncAction(
    `@VesselScreening/GET_EXTERNAL_INSPECTION_DETAIL_ACTIONS`,
    `@VesselScreening/GET_EXTERNAL_INSPECTION_DETAIL_ACTIONS_SUCCESS`,
    `@VesselScreening/GET_EXTERNAL_INSPECTION_DETAIL_ACTIONS_FAIL`,
  )<CommonApiParam, VesselScreeningExternalInspection, void>();

export const getExternalInspectionRequestDetailActions = createAsyncAction(
  `@VesselScreening/GET_EXTERNAL_INSPECTION_REQUEST_DETAIL_ACTIONS`,
  `@VesselScreening/GET_EXTERNAL_INSPECTION_REQUEST_DETAIL_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_EXTERNAL_INSPECTION_REQUEST_DETAIL_ACTIONS_FAIL`,
)<CommonApiParam, ExternalInspectionsRequests, void>();

export const updateExternalInspectionRequestActions = createAsyncAction(
  `@VesselScreening/UPDATE_EXTERNAL_INSPECTION_ACTIONS`,
  `@VesselScreening/UPDATE_EXTERNAL_INSPECTION_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_EXTERNAL_INSPECTION_ACTIONS_FAIL`,
)<UpdateExternalInspectionRequestParams, void, ErrorField[]>();
