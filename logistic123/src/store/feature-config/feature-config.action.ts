import {
  GetFeatureConfigsResponse,
  CreateFeatureConfigParams,
  UpdateFeatureConfigParams,
  FeatureConfigDetailResponse,
} from 'models/api/feature-config/feature-config.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteFeatureConfig {
  id: string;
  isDetail?: boolean;
  getListFeatureConfig: () => void;
}

export const getListFeatureConfigActions = createAsyncAction(
  `@featureConfig/GET_LIST_FEATURE_CONFIG_ACTIONS`,
  `@featureConfig/GET_LIST_FEATURE_CONFIG_ACTIONS_SUCCESS`,
  `@featureConfig/GET_LIST_FEATURE_CONFIG_ACTIONS_FAIL`,
)<CommonApiParam, GetFeatureConfigsResponse, void>();

export const deleteFeatureConfigActions = createAsyncAction(
  `@featureConfig/DELETE_FEATURE_CONFIG_ACTIONS`,
  `@featureConfig/DELETE_FEATURE_CONFIG_ACTIONS_SUCCESS`,
  `@featureConfig/DELETE_FEATURE_CONFIG_ACTIONS_FAIL`,
)<ParamsDeleteFeatureConfig, CommonApiParam, void>();

export const createFeatureConfigActions = createAsyncAction(
  `@featureConfig/CREATE_FEATURE_CONFIG_ACTIONS`,
  `@featureConfig/CREATE_FEATURE_CONFIG_ACTIONS_SUCCESS`,
  `@featureConfig/CREATE_FEATURE_CONFIG_ACTIONS_FAIL`,
)<CreateFeatureConfigParams, void, ErrorField[]>();

export const updateFeatureConfigActions = createAsyncAction(
  `@featureConfig/UPDATE_FEATURE_CONFIG_ACTIONS`,
  `@featureConfig/UPDATE_FEATURE_CONFIG_ACTIONS_SUCCESS`,
  `@featureConfig/UPDATE_FEATURE_CONFIG_ACTIONS_FAIL`,
)<UpdateFeatureConfigParams, void, ErrorField[]>();

export const getFeatureConfigDetailActions = createAsyncAction(
  `@featureConfig/GET_FEATURE_CONFIG_DETAIL_ACTIONS`,
  `@featureConfig/GET_FEATURE_CONFIG_DETAIL_ACTIONS_SUCCESS`,
  `@featureConfig/GET_FEATURE_CONFIG_DETAIL_ACTIONS_FAIL`,
)<string, FeatureConfigDetailResponse, void>();

export const clearFeatureConfigReducer = createAction(
  `@featureConfig/CLEAR_FEATURE_CONFIG_REDUCER`,
)<void>();

export const clearFeatureConfigErrorsReducer = createAction(
  `@featureConfig/CLEAR_FEATURE_CONFIG_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@featureConfig/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
