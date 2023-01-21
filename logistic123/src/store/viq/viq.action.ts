import {
  GetVIQsResponse,
  CreateViqParams,
  UpdateVIQParams,
  ViqResponse,
  PotentialRisk,
} from 'models/api/viq/viq.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteVIQ {
  id: string;
  isDetail?: boolean;
  afterDelete: () => void;
}

export const getListVIQActions = createAsyncAction(
  `@VIQ/GET_LIST_VIQ_ACTIONS`,
  `@VIQ/GET_LIST_VIQ_ACTIONS_SUCCESS`,
  `@VIQ/GET_LIST_VIQ_ACTIONS_FAIL`,
)<CommonApiParam, GetVIQsResponse, void>();

export const getListPotentialRiskActions = createAsyncAction(
  `@VIQ/GET_LIST_POTENTIAL_RISK_ACTIONS`,
  `@VIQ/GET_LIST_POTENTIAL_RISK_ACTIONS_SUCCESS`,
  `@VIQ/GET_LIST_POTENTIAL_RISK_ACTIONS_FAIL`,
)<void, PotentialRisk[], void>();

// DELETE
export const deleteVIQActions = createAsyncAction(
  `@VIQ/DELETE_VIQ_ACTIONS`,
  `@VIQ/DELETE_VIQ_ACTIONS_SUCCESS`,
  `@VIQ/DELETE_VIQ_ACTIONS_FAIL`,
)<ParamsDeleteVIQ, CommonApiParam, void>();

// CREATE
export const createVIQActions = createAsyncAction(
  `@VIQ/CREATE_VIQ_ACTIONS`,
  `@VIQ/CREATE_VIQ_ACTIONS_SUCCESS`,
  `@VIQ/CREATE_VIQ_ACTIONS_FAIL`,
)<CreateViqParams, ViqResponse, ErrorField[]>();

// UPDATE
export const updateVIQActions = createAsyncAction(
  `@VIQ/UPDATE_VIQ_ACTIONS`,
  `@VIQ/UPDATE_VIQ_ACTIONS_SUCCESS`,
  `@VIQ/UPDATE_VIQ_ACTIONS_FAIL`,
)<UpdateVIQParams, void, ErrorField[]>();

// GET DETAIL
export const getVIQDetailActions = createAsyncAction(
  `@VIQ/GET_VIQ_DETAIL_ACTIONS`,
  `@VIQ/GET_VIQ_DETAIL_ACTIONS_SUCCESS`,
  `@VIQ/GET_VIQ_DETAIL_ACTIONS_FAIL`,
)<string, ViqResponse, void>();

export const clearVIQReducer = createAction(`@VIQ/CLEAR_VIQ_REDUCER`)<void>();

export const clearVIQErrorsReducer = createAction(
  `@VIQ/CLEAR_VIQ_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@VIQ/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
