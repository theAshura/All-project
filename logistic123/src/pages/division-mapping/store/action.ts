import { createAsyncAction } from 'typesafe-actions';
import { GetListDivision } from '../utils/model';

export const getListDivisionMappingActions = createAsyncAction(
  `@divisionMapping/GET_LIST_DIVISION_MAPPING_ACTIONS`,
  `@divisionMapping/GET_LIST_DIVISION_MAPPING_ACTIONS_SUCCESS`,
  `@divisionMapping/GET_LIST_DIVISION_MAPPING_ACTIONS_FAIL`,
)<GetListDivision, any, void>();

export const deleteDivisionMappingActions = createAsyncAction(
  `@divisionMapping/DELETE_DIVISION_MAPPING_ACTIONS`,
  `@divisionMapping/DELETE_DIVISION_MAPPING_ACTIONS_SUCCESS`,
  `@divisionMapping/DELETE_DIVISION_MAPPING_ACTIONS_FAIL`,
)<any, void, void>();

export const createDivisionMappingActions = createAsyncAction(
  `@divisionMapping/CREATE_DIVISION_MAPPING_ACTIONS`,
  `@divisionMapping/CREATE_DIVISION_MAPPING_ACTIONS_SUCCESS`,
  `@divisionMapping/CREATE_DIVISION_MAPPING_ACTIONS_FAIL`,
)<any, void, void>();

export const updateDivisionMappingActions = createAsyncAction(
  `@divisionMapping/UPDATE_DIVISION_MAPPING_ACTIONS`,
  `@divisionMapping/UPDATE_DIVISION_MAPPING_ACTIONS_SUCCESS`,
  `@divisionMapping/UPDATE_DIVISION_MAPPING_ACTIONS_FAIL`,
)<any, void, void>();

export const getDivisionMappingDetailActions = createAsyncAction(
  `@divisionMapping/GET_DIVISION_MAPPING_DETAIL_ACTIONS`,
  `@divisionMapping/GET_DIVISION_MAPPING_DETAIL_ACTIONS_SUCCESS`,
  `@divisionMapping/GET_DIVISION_MAPPING_DETAIL_ACTIONS_FAIL`,
)<string, any, void>();
