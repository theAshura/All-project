import {
  GetAnalysisSectionResponse,
  GetListActivityResponse,
  GetRemarksByDateResponse,
  RemarkParam,
} from 'models/api/home-page/home-page.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction } from 'typesafe-actions';

export const getListActivityActions = createAsyncAction(
  `@homepage/GET_LIST_ACTIVITY_ACTIONS`,
  `@homepage/GET_LIST_ACTIVITY_ACTIONS_SUCCESS`,
  `@homepage/GET_LIST_ACTIVITY_ACTIONS_FAIL`,
)<CommonApiParam, GetListActivityResponse, void>();

export const getAnalysisDataActions = createAsyncAction(
  `@homepage/GET_ANALYSIS_DATA_ACTIONS`,
  `@homepage/GET_ANALYSIS_DATA_ACTIONS_SUCCESS`,
  `@homepage/GET_ANALYSIS_DATA_ACTIONS_FAIL`,
)<void, GetAnalysisSectionResponse, void>();

export const createRemarkActions = createAsyncAction(
  `@homepage/CREATE_REMARK_ACTIONS`,
  `@homepage/CREATE_REMARK_ACTIONS_SUCCESS`,
  `@homepage/CREATE_REMARK_ACTIONS_FAIL`,
)<RemarkParam, void, ErrorField[]>();

export const getRemarksByDateActions = createAsyncAction(
  `@homepage/GET_REMARK_BY_DATE_ACTIONS`,
  `@homepage/GET_REMARK_BY_DATE_ACTIONS_SUCCESS`,
  `@homepage/GET_REMARK_BY_DATE_ACTIONS_FAIL`,
)<CommonApiParam | void, GetRemarksByDateResponse, void>();

export const updateRemarksByDateActions = createAsyncAction(
  `@homepage/UPDATE_REMARK_BY_DATE_ACTIONS`,
  `@homepage/UPDATE_REMARK_BY_DATE_ACTIONS_SUCCESS`,
  `@homepage/UPDATE_REMARK_BY_DATE_ACTIONS_FAIL`,
)<CommonApiParam | void, void, void>();

export const deleteRemarksByDateActions = createAsyncAction(
  `@homepage/DELETE_REMARK_BY_DATE_ACTIONS`,
  `@homepage/DELETE_REMARK_BY_DATE_ACTIONS_SUCCESS`,
  `@homepage/DELETE_REMARK_BY_DATE_ACTIONS_FAIL`,
)<CommonApiParam | void, void, void>();
