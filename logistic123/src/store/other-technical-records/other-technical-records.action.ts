import {
  CreateOtherTechnicalRecordsParams,
  DeleteOtherTechnicalRecordsParams,
  GetDetailOtherTechnicalRecords,
  GetOtherTechnicalRecordsResponse,
  UpdateOtherTechnicalRecordsParams,
} from 'models/api/other-technical-records/other-technical-records.model';
import {
  ListTemplateResponse,
  TemplateDetail,
} from 'models/api/template/template.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDeleteTemplate {
  ids: string[];
  handleSuccess?: () => void;
}

export const getListOtherTechnicalRecordsActions = createAsyncAction(
  `@OtherTechnicalRecords/GET_LIST_OTHER_TECHNICAL_ACTIONS`,
  `@OtherTechnicalRecords/GET_LIST_OTHER_TECHNICAL_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/GET_LIST_OTHER_TECHNICAL_ACTIONS_FAIL`,
)<CommonApiParam, GetOtherTechnicalRecordsResponse, void>();

export const createOtherTechnicalRecordsActions = createAsyncAction(
  `@OtherTechnicalRecords/CREATE_OTHER_TECHNICAL_ACTIONS`,
  `@OtherTechnicalRecords/CREATE_OTHER_TECHNICAL_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/CREATE_OTHER_TECHNICAL_ACTIONS_FAIL`,
)<CreateOtherTechnicalRecordsParams, void, void>();

export const updateOtherTechnicalRecordsActions = createAsyncAction(
  `@OtherTechnicalRecords/UPDATE_OTHER_TECHNICAL_ACTIONS`,
  `@OtherTechnicalRecords/UPDATE_OTHER_TECHNICAL_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/UPDATE_OTHER_TECHNICAL_ACTIONS_FAIL`,
)<UpdateOtherTechnicalRecordsParams, void, void>();

export const deleteOtherTechnicalRecordsActions = createAsyncAction(
  `@OtherTechnicalRecords/DELETE_OTHER_TECHNICAL_ACTIONS`,
  `@OtherTechnicalRecords/DELETE_OTHER_TECHNICAL_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/DELETE_OTHER_TECHNICAL_ACTIONS_FAIL`,
)<DeleteOtherTechnicalRecordsParams, void, void>();

export const getDetailOtherTechnicalRecords = createAsyncAction(
  `@OtherTechnicalRecords/GET_DETAIL_OTHER_TECHNICAL_ACTIONS`,
  `@OtherTechnicalRecords/GET_DETAIL_OTHER_TECHNICAL_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/GET_DETAIL_OTHER_TECHNICAL_ACTIONS_FAIL`,
)<string, GetDetailOtherTechnicalRecords, void>();

export const clearOtherTechnicalRecords = createAction(
  `@OtherTechnicalRecords/CLEAR_OTHER_TECHNICAL_ACTIONS`,
)<void>();

export const setDataFilterAction = createAction(
  `@OtherTechnicalRecords/SET_DATA_FILTER`,
)<CommonApiParam>();

// Template

export const getListOtherTechnicalRecordsTemplateActions = createAsyncAction(
  `@OtherTechnicalRecords/GET_LIST_TEMPLATE_ACTIONS`,
  `@OtherTechnicalRecords/GET_LIST_TEMPLATE_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/GET_LIST_TEMPLATE_ACTIONS_FAIL`,
)<CommonApiParam, ListTemplateResponse, void>();

export const deleteOtherTechnicalRecordsTemplateActions = createAsyncAction(
  `@OtherTechnicalRecords/DELETE_TEMPLATE_ACTIONS`,
  `@OtherTechnicalRecords/DELETE_TEMPLATE_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/DELETE_TEMPLATE_ACTIONS_FAIL`,
)<ParamsDeleteTemplate, void, void>();

export const createOtherTechnicalRecordsTemplateActions = createAsyncAction(
  `@OtherTechnicalRecords/CREATE_TEMPLATE_ACTIONS`,
  `@OtherTechnicalRecords/CREATE_TEMPLATE_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/CREATE_TEMPLATE_ACTIONS_FAIL`,
)<TemplateDetail, ListTemplateResponse, ErrorField[]>();

export const updateOtherTechnicalRecordsTemplateActions = createAsyncAction(
  `@OtherTechnicalRecords/UPDATE_TEMPLATE_ACTIONS`,
  `@OtherTechnicalRecords/UPDATE_TEMPLATE_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/UPDATE_TEMPLATE_ACTIONS_FAIL`,
)<TemplateDetail, TemplateDetail, ErrorField[]>();

export const getOtherTechnicalRecordsTemplateDetailActions = createAsyncAction(
  `@OtherTechnicalRecords/GET_TEMPLATE_ACTIONS`,
  `@OtherTechnicalRecords/GET_TEMPLATE_ACTIONS_SUCCESS`,
  `@OtherTechnicalRecords/GET_TEMPLATE_ACTIONS_FAIL`,
)<{ templateId: string; content?: string }, TemplateDetail, void>();

export const clearTemplateReducer = createAction(
  `@OtherTechnicalRecords/CLEAR_TEMPLATE_REDUCER`,
)<void>();

export const clearParamsTemplateReducer = createAction(
  `@OtherTechnicalRecords/CLEAR_PARAMS_TEMPLATE_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@OtherTechnicalRecords/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
