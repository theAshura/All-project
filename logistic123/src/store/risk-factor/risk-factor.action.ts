import {
  CreateRiskFactorParams,
  GetRiskFactorResponse,
  RiskFactor,
  RiskFactorDetailResponse,
  UpdateRiskFactorParams,
} from 'models/api/risk-factor/risk-factor.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteRiskFactor {
  id: string;
  isDetail?: boolean;
  getListRiskFactor: () => void;
}

export const getListRiskFactorActions = createAsyncAction(
  `@riskFactor/GET_LIST_RISK_FACTOR_ACTIONS`,
  `@riskFactor/GET_LIST_RISK_FACTOR_ACTIONS_SUCCESS`,
  `@riskFactor/GET_LIST_RISK_FACTOR_ACTIONS_FAIL`,
)<CommonApiParam, GetRiskFactorResponse, void>();

export const getListRiskFactorByMainIdActions = createAsyncAction(
  `@riskFactor/GET_LIST_RISK_FACTOR_BY_MAIN_ID_ACTIONS`,
  `@riskFactor/GET_LIST_RISK_FACTOR_BY_MAIN_ID_ACTIONS_SUCCESS`,
  `@riskFactor/GET_LIST_RISK_FACTOR_BY_MAIN_ID_ACTIONS_FAIL`,
)<CommonApiParam, RiskFactor[], void>();

export const deleteRiskFactorActions = createAsyncAction(
  `@riskFactor/DELETE_RISK_FACTOR_ACTIONS`,
  `@riskFactor/DELETE_RISK_FACTOR_ACTIONS_SUCCESS`,
  `@riskFactor/DELETE_RISK_FACTOR_ACTIONS_FAIL`,
)<ParamsDeleteRiskFactor, CommonApiParam, void>();

export const createRiskFactorActions = createAsyncAction(
  `@riskFactor/CREATE_RISK_FACTOR_ACTIONS`,
  `@riskFactor/CREATE_RISK_FACTOR_ACTIONS_SUCCESS`,
  `@riskFactor/CREATE_RISK_FACTOR_ACTIONS_FAIL`,
)<CreateRiskFactorParams, void, ErrorField[]>();

export const updateRiskFactorActions = createAsyncAction(
  `@riskFactor/UPDATE_RISK_FACTOR_ACTIONS`,
  `@riskFactor/UPDATE_RISK_FACTOR_ACTIONS_SUCCESS`,
  `@riskFactor/UPDATE_RISK_FACTOR_ACTIONS_FAIL`,
)<UpdateRiskFactorParams, void, ErrorField[]>();

export const getRiskFactorDetailActions = createAsyncAction(
  `@riskFactor/GET_RISK_FACTOR_DETAIL_ACTIONS`,
  `@riskFactor/GET_RISK_FACTOR_DETAIL_ACTIONS_SUCCESS`,
  `@riskFactor/GET_RISK_FACTOR_DETAIL_ACTIONS_FAIL`,
)<string, RiskFactorDetailResponse, void>();

export const clearRiskFactorReducer = createAction(
  `@riskFactor/CLEAR_RISK_FACTOR_REDUCER`,
)<void>();

export const clearRiskFactorErrorsReducer = createAction(
  `@riskFactor/CLEAR_RISK_FACTOR_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@riskFactor/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
