import {
  GetInspectionMappingsResponse,
  CreateInspectionMappingParams,
  UpdateInspectionMappingParams,
  InspectionMappingDetailResponse,
  GetNatureOfFindingsResponse,
} from 'models/api/inspection-mapping/inspection-mapping.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteInspectionMapping {
  id: string;
  isDetail?: boolean;
  getListInspectionMapping: () => void;
}

export const getListInspectionMappingActions = createAsyncAction(
  `@inspectionMapping/GET_LIST_INSPECTION_MAPPING_ACTIONS`,
  `@inspectionMapping/GET_LIST_INSPECTION_MAPPING_ACTIONS_SUCCESS`,
  `@inspectionMapping/GET_LIST_INSPECTION_MAPPING_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionMappingsResponse, void>();

export const getListNatureOfFindingActions = createAsyncAction(
  `@inspectionMapping/GET_LIST_NATURE_OF_FINDING_ACTIONS`,
  `@inspectionMapping/GET_LIST_NATURE_OF_FINDING_ACTIONS_SUCCESS`,
  `@inspectionMapping/GET_LIST_NATURE_OF_FINDING_ACTIONS_FAIL`,
)<CommonApiParam, GetNatureOfFindingsResponse, void>();

export const deleteInspectionMappingActions = createAsyncAction(
  `@inspectionMapping/DELETE_INSPECTION_MAPPING_ACTIONS`,
  `@inspectionMapping/DELETE_INSPECTION_MAPPING_ACTIONS_SUCCESS`,
  `@inspectionMapping/DELETE_INSPECTION_MAPPING_ACTIONS_FAIL`,
)<ParamsDeleteInspectionMapping, CommonApiParam, void>();

export const createInspectionMappingActions = createAsyncAction(
  `@inspectionMapping/CREATE_INSPECTION_MAPPING_ACTIONS`,
  `@inspectionMapping/CREATE_INSPECTION_MAPPING_ACTIONS_SUCCESS`,
  `@inspectionMapping/CREATE_INSPECTION_MAPPING_ACTIONS_FAIL`,
)<CreateInspectionMappingParams, void, ErrorField[]>();

export const updateInspectionMappingActions = createAsyncAction(
  `@inspectionMapping/UPDATE_INSPECTION_MAPPING_ACTIONS`,
  `@inspectionMapping/UPDATE_INSPECTION_MAPPING_ACTIONS_SUCCESS`,
  `@inspectionMapping/UPDATE_INSPECTION_MAPPING_ACTIONS_FAIL`,
)<UpdateInspectionMappingParams, void, ErrorField[]>();

export const getInspectionMappingDetailActions = createAsyncAction(
  `@inspectionMapping/GET_INSPECTION_MAPPING_DETAIL_ACTIONS`,
  `@inspectionMapping/GET_INSPECTION_MAPPING_DETAIL_ACTIONS_SUCCESS`,
  `@inspectionMapping/GET_INSPECTION_MAPPING_DETAIL_ACTIONS_FAIL`,
)<string, InspectionMappingDetailResponse, void>();

export const clearInspectionMappingReducer = createAction(
  `@inspectionMapping/CLEAR_INSPECTION_MAPPING_REDUCER`,
)<void | boolean>();

export const clearInspectionMappingErrorsReducer = createAction(
  `@inspectionMapping/CLEAR_INSPECTION_MAPPING_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@inspectionMapping/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@reportOfFinding/SET_DATA_FILTER`,
)<CommonApiParam>();
