import {
  InternalInspectionsRequests,
  VesselScreeningInternalInspection,
  GetVesselScreeningInternalInspectionsResponse,
  UpdateInternalInspectionRequestParams,
} from 'pages/vessel-screening/utils/models/internal-inspection.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const clearVesselInternalInspectionReducer = createAction(
  `@VesselScreening/CLEAR_INTERNAL_INSPECTION_REDUCER`,
)<void | boolean>();

export const clearVesselInternalInspectionErrorsReducer = createAction(
  `@VesselScreening/CLEAR_INTERNAL_INSPECTION_ERRORS_REDUCER`,
)<void>();

export const updateInternalInspectionParamsActions = createAction(
  `@VesselScreening/UPDATE_INTERNAL_INSPECTION_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setInternalInspectionDataFilterAction = createAction(
  `@VesselScreening/SET_INTERNAL_INSPECTION_DATA_FILTER`,
)<CommonApiParam>();

export const getListVesselScreeningInternalInspectionActions =
  createAsyncAction(
    `@VesselScreening/GET_LIST_INTERNAL_INSPECTION_ACTIONS`,
    `@VesselScreening/GET_LIST_INTERNAL_INSPECTION_ACTIONS_SUCCESS`,
    `@VesselScreening/GET_LIST_INTERNAL_INSPECTION_ACTIONS_FAIL`,
  )<CommonApiParam, GetVesselScreeningInternalInspectionsResponse, void>();

export const getVesselScreeningInternalInspectionDetailActions =
  createAsyncAction(
    `@VesselScreening/GET_INTERNAL_INSPECTION_DETAIL_ACTIONS`,
    `@VesselScreening/GET_INTERNAL_INSPECTION_DETAIL_ACTIONS_SUCCESS`,
    `@VesselScreening/GET_INTERNAL_INSPECTION_DETAIL_ACTIONS_FAIL`,
  )<CommonApiParam, VesselScreeningInternalInspection, void>();

export const getInternalInspectionRequestDetailActions = createAsyncAction(
  `@VesselScreening/GET_INTERNAL_INSPECTION_REQUEST_DETAIL_ACTIONS`,
  `@VesselScreening/GET_INTERNAL_INSPECTION_REQUEST_DETAIL_ACTIONS_SUCCESS`,
  `@VesselScreening/GET_INTERNAL_INSPECTION_REQUEST_DETAIL_ACTIONS_FAIL`,
)<CommonApiParam, InternalInspectionsRequests, void>();

export const updateInternalInspectionRequestActions = createAsyncAction(
  `@VesselScreening/UPDATE_INTERNAL_INSPECTION_REQUEST_ACTIONS`,
  `@VesselScreening/UPDATE_INTERNAL_INSPECTION_REQUEST_ACTIONS_SUCCESS`,
  `@VesselScreening/UPDATE_INTERNAL_INSPECTION_REQUEST_ACTIONS_FAIL`,
)<UpdateInternalInspectionRequestParams, void, ErrorField[]>();
