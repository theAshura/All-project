import {
  CreateSurveyClassInfoParams,
  DeleteSurveyClassInfoParams,
  GetDetailSurveyClassInfo,
  GetSurveyClassInfoResponse,
  UpdateSurveyClassInfoParams,
} from 'models/api/survey-class-info/survey-class-info.model';
import {
  ListTemplateResponse,
  TemplateDetail,
} from 'models/api/template/template.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

export const getListSurveyClassInfoActions = createAsyncAction(
  `@surveyClassInfo/GET_LIST_SURVEYS_CLASS_INFO_ACTIONS`,
  `@surveyClassInfo/GET_LIST_SURVEYS_CLASS_INFO_ACTIONS_SUCCESS`,
  `@surveyClassInfo/GET_LIST_SURVEYS_CLASS_INFO_ACTIONS_FAIL`,
)<CommonApiParam, GetSurveyClassInfoResponse, void>();

export const createSurveyClassInfoActions = createAsyncAction(
  `@surveyClassInfo/CREATE_SURVEY_CLASS_INFO_ACTIONS`,
  `@surveyClassInfo/CREATE_SURVEY_CLASS_INFO_ACTIONS_SUCCESS`,
  `@surveyClassInfo/CREATE_SURVEY_CLASS_INFO_ACTIONS_FAIL`,
)<CreateSurveyClassInfoParams, void, void>();
export const updateSurveyClassInfoActions = createAsyncAction(
  `@surveyClassInfo/UPDATE_SURVEY_CLASS_INFO_ACTIONS`,
  `@surveyClassInfo/UPDATE_SURVEY_CLASS_INFO_ACTIONS_SUCCESS`,
  `@surveyClassInfo/UPDATE_SURVEY_CLASS_INFO_ACTIONS_FAIL`,
)<UpdateSurveyClassInfoParams, void, void>();
export const deleteSurveyClassInfoActions = createAsyncAction(
  `@surveyClassInfo/DELETE_SURVEY_CLASS_INFO_ACTIONS`,
  `@surveyClassInfo/DELETE_SURVEY_CLASS_INFO_ACTIONS_SUCCESS`,
  `@surveyClassInfo/DELETE_SURVEY_CLASS_INFO_ACTIONS_FAIL`,
)<DeleteSurveyClassInfoParams, void, void>();
export const getDetailSurveyClassInfo = createAsyncAction(
  `@surveyClassInfo/GET_DETAIL_SURVEY_CLASS_INFO_ACTIONS`,
  `@surveyClassInfo/GET_DETAIL_SURVEY_CLASS_INFO_ACTIONS_SUCCESS`,
  `@surveyClassInfo/GET_DETAIL_SURVEY_CLASS_INFO_ACTIONS_FAIL`,
)<string, GetDetailSurveyClassInfo, void>();
export const clearSurveyClassInfo = createAction(
  `@surveyClassInfo/CLEAR_SURVEY_CLASS_INFO_ACTIONS`,
)<void>();

interface ParamsDelete {
  ids: string[];
  getList?: () => void;
}

export const getSurveyClassInfoListTemplateActions = createAsyncAction(
  `@surveyClassInfo/GET_LIST_TEMPLATE_ACTIONS`,
  `@surveyClassInfo/GET_LIST_TEMPLATE_ACTIONS_SUCCESS`,
  `@surveyClassInfo/GET_LIST_TEMPLATE_ACTIONS_FAIL`,
)<CommonApiParam, ListTemplateResponse, void>();

export const deleteSurveyClassInfoTemplateActions = createAsyncAction(
  `@surveyClassInfo/DELETE_TEMPLATE_ACTIONS`,
  `@surveyClassInfo/DELETE_TEMPLATE_ACTIONS_SUCCESS`,
  `@surveyClassInfo/DELETE_TEMPLATE_ACTIONS_FAIL`,
)<ParamsDelete, void, void>();

export const createSurveyClassInfoTemplateActions = createAsyncAction(
  `@surveyClassInfo/CREATE_TEMPLATE_ACTIONS`,
  `@surveyClassInfo/CREATE_TEMPLATE_ACTIONS_SUCCESS`,
  `@surveyClassInfo/CREATE_TEMPLATE_ACTIONS_FAIL`,
)<TemplateDetail, ListTemplateResponse, ErrorField[]>();

export const updateSurveyClassInfoTemplateActions = createAsyncAction(
  `@surveyClassInfo/UPDATE_TEMPLATE_ACTIONS`,
  `@surveyClassInfo/UPDATE_TEMPLATE_ACTIONS_SUCCESS`,
  `@surveyClassInfo/UPDATE_TEMPLATE_ACTIONS_FAIL`,
)<TemplateDetail, TemplateDetail, ErrorField[]>();

export const getSurveyClassInfoTemplateDetailActions = createAsyncAction(
  `@surveyClassInfo/GET_TEMPLATE_ACTIONS`,
  `@surveyClassInfo/GET_TEMPLATE_ACTIONS_SUCCESS`,
  `@surveyClassInfo/GET_TEMPLATE_ACTIONS_FAIL`,
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
