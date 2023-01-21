import {
  SailReportInspectionInternal,
  CreateSailReportInspectionInternalParams,
  UpdateSailReportInspectionInternalParams,
  DeleteSailReportInspectionInternalParams,
  GetSailReportInspectionInternalResponse,
} from 'models/api/sail-report-inspection-internal/sail-report-inspection-internal.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const createSailReportInspectionInternalActions = createAsyncAction(
  `@sailReportInspectionInternal/CREATE_INTERNAL_INSPECTIONS_ACTIONS`,
  `@sailReportInspectionInternal/CREATE_INTERNAL_INSPECTIONS_ACTIONS_SUCCESS`,
  `@sailReportInspectionInternal/CREATE_INTERNAL_INSPECTIONS_ACTIONS_FAIL`,
)<CreateSailReportInspectionInternalParams, void, ErrorField[]>();

export const updateSailReportInspectionInternalActions = createAsyncAction(
  `@sailReportInspectionInternal/UPDATE_INTERNAL_INSPECTIONS_ACTIONS`,
  `@sailReportInspectionInternal/UPDATE_INTERNAL_INSPECTIONS_ACTIONS_SUCCESS`,
  `@sailReportInspectionInternal/UPDATE_INTERNAL_INSPECTIONS_ACTIONS_FAIL`,
)<UpdateSailReportInspectionInternalParams, void, ErrorField[]>();

export const getSailReportInspectionInternalDetailActions = createAsyncAction(
  `@sailReportInspectionInternal/GET_INTERNAL_INSPECTIONS_DETAIL_ACTIONS`,
  `@sailReportInspectionInternal/GET_INTERNAL_INSPECTIONS_DETAIL_ACTIONS_SUCCESS`,
  `@sailReportInspectionInternal/GET_INTERNAL_INSPECTIONS_DETAIL_ACTIONS_FAIL`,
)<string, SailReportInspectionInternal, void>();

export const clearInternalInspectionsReducer = createAction(
  `@sailReportInspectionInternal/CLEAR_INTERNAL_INSPECTIONS_REDUCER`,
)<void>();

export const clearInternalInspectionsErrorsReducer = createAction(
  `@sailReportInspectionInternal/CLEAR_INTERNAL_INSPECTIONS_ERRORS_REDUCER`,
)<void>();

export const getListSailReportInspectionInternalActions = createAsyncAction(
  `@sailReportInspectionInternal/GET_LIST_SAIL_REPORT_INSPECTION_INTERNAL_ACTIONS`,
  `@sailReportInspectionInternal/GET_LIST_SAIL_REPORT_INSPECTION_INTERNAL_SUCCESS`,
  `@sailReportInspectionInternal/GET_LIST_SAIL_REPORT_INSPECTION_INTERNAL_FAIL`,
)<CommonApiParam, GetSailReportInspectionInternalResponse, void>();

export const deleteSailReportInspectionInternalActions = createAsyncAction(
  `@sailReportInspectionInternal/DELETE_SAIL_REPORT_INSPECTION_INTERNAL_ACTIONS`,
  `@sailReportInspectionInternal/DELETE_SAIL_REPORT_INSPECTION_INTERNAL_ACTIONS_SUCCESS`,
  `@sailReportInspectionInternal/DELETE_SAIL_REPORT_INSPECTION_INTERNAL_FAIL`,
)<DeleteSailReportInspectionInternalParams, CommonApiParam, void>();

export const clearSailReportInspectionInternalReducer = createAction(
  `@sailReportInspectionInternal/CLEAR_SAIL_REPORT_INSPECTION_INTERNAL_REDUCER`,
)<void>();

export const clearSailReportInspectionInternalErrorsReducer = createAction(
  `@sailReportInspectionInternal/CLEAR_SAIL_REPORT_INSPECTION_INTERNAL_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@sailReportInspectionInternal/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@sailReportInspectionInternal/SET_DATA_FILTER`,
)<CommonApiParam>();
