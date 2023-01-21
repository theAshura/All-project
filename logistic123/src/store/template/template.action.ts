import {
  ListTemplateResponse,
  TemplateDetail,
} from 'models/api/template/template.model';

import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  ids: string[];
  getList?: () => void;
}

export const getListTemplateActions = createAsyncAction(
  `@template/GET_LIST_TEMPLATE_ACTIONS`,
  `@template/GET_LIST_TEMPLATE_ACTIONS_SUCCESS`,
  `@template/GET_LIST_TEMPLATE_ACTIONS_FAIL`,
)<CommonApiParam, ListTemplateResponse, void>();

export const deleteTemplateActions = createAsyncAction(
  `@template/DELETE_TEMPLATE_ACTIONS`,
  `@template/DELETE_TEMPLATE_ACTIONS_SUCCESS`,
  `@template/DELETE_TEMPLATE_ACTIONS_FAIL`,
)<ParamsDelete, void, void>();

export const createTemplateActions = createAsyncAction(
  `@template/CREATE_TEMPLATE_ACTIONS`,
  `@template/CREATE_TEMPLATE_ACTIONS_SUCCESS`,
  `@template/CREATE_TEMPLATE_ACTIONS_FAIL`,
)<TemplateDetail, ListTemplateResponse, ErrorField[]>();

export const updateTemplateActions = createAsyncAction(
  `@template/UPDATE_TEMPLATE_ACTIONS`,
  `@template/UPDATE_TEMPLATE_ACTIONS_SUCCESS`,
  `@template/UPDATE_TEMPLATE_ACTIONS_FAIL`,
)<TemplateDetail, TemplateDetail, ErrorField[]>();

export const getTemplateDetailActions = createAsyncAction(
  `@template/GET_TEMPLATE_ACTIONS`,
  `@template/GET_TEMPLATE_ACTIONS_SUCCESS`,
  `@template/GET_TEMPLATE_ACTIONS_FAIL`,
)<{ templateId: string; content?: string }, TemplateDetail, void>();

export const clearTemplateReducer = createAction(
  `@template/CLEAR_TEMPLATE_REDUCER`,
)<void>();

export const clearParamsTemplateReducer = createAction(
  `@template/CLEAR_PARAMS_TEMPLATE_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@template/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

// NOTED: New template actions
export const getListTemplateDictionaryActions = createAsyncAction(
  `@template/GET_LIST_TEMPLATE_DICTIONARY_ACTIONS`,
  `@template/GET_LIST_TEMPLATE_DICTIONARY_ACTIONS_SUCCESS`,
  `@template/GET_LIST_TEMPLATE_DICTIONARY_ACTIONS_FAIL`,
)<CommonApiParam, ListTemplateResponse, void>();

export const deleteTemplateDictionaryActions = createAsyncAction(
  `@template/DELETE_TEMPLATE_DICTIONARY_ACTIONS`,
  `@template/DELETE_TEMPLATE_DICTIONARY_ACTIONS_SUCCESS`,
  `@template/DELETE_TEMPLATE_DICTIONARY_ACTIONS_FAIL`,
)<ParamsDelete, void, void>();

export const createTemplateDictionaryActions = createAsyncAction(
  `@template/CREATE_TEMPLATE_DICTIONARY_ACTIONS`,
  `@template/CREATE_TEMPLATE_DICTIONARY_ACTIONS_SUCCESS`,
  `@template/CREATE_TEMPLATE_DICTIONARY_ACTIONS_FAIL`,
)<TemplateDetail, ListTemplateResponse, ErrorField[]>();

export const updateTemplateDictionaryActions = createAsyncAction(
  `@template/UPDATE_TEMPLATE_DICTIONARY_ACTIONS`,
  `@template/UPDATE_TEMPLATE_DICTIONARY_ACTIONS_SUCCESS`,
  `@template/UPDATE_TEMPLATE_DICTIONARY_ACTIONS_FAIL`,
)<TemplateDetail, TemplateDetail, ErrorField[]>();

export const getTemplateDetailDictionaryActions = createAsyncAction(
  `@template/GET_TEMPLATE_DICTIONARY_ACTIONS`,
  `@template/GET_TEMPLATE_DICTIONARY_ACTIONS_SUCCESS`,
  `@template/GET_TEMPLATE_DICTIONARY_ACTIONS_FAIL`,
)<
  { templateId: string; content?: string; handleSuccess?: () => void },
  TemplateDetail,
  void
>();

export const clearTemplateDictionaryReducer = createAction(
  `@template/CLEAR_TEMPLATE_DICTIONARY_REDUCER`,
)<void>();

export const clearParamsTemplateDictionaryReducer = createAction(
  `@template/CLEAR_PARAMS_TEMPLATE_DICTIONARY_REDUCER`,
)<void>();
