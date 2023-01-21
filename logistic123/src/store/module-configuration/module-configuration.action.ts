import { createAsyncAction, createAction } from 'typesafe-actions';
import { CommonApiParam } from 'models/common.model';
import {
  GetListModuleConfigurationData,
  GetListModuleConfigurationResponse,
  LabelConfigDetailResponse,
  ListLabelConfigResponse,
} from 'models/store/module-configuration/module-configuration.model';

export const getListModuleConfigurationActions = createAsyncAction(
  `@ModuleConfiguration/GET_LIST_MODULE_CONFIGURATION_ACTIONS`,
  `@ModuleConfiguration/GET_LIST_MODULE_CONFIGURATION_ACTIONS_SUCCESS`,
  `@ModuleConfiguration/GET_LIST_MODULE_CONFIGURATION_ACTIONS_FAIL`,
)<CommonApiParam, GetListModuleConfigurationResponse, void>();

export const getDetailModuleConfigurationActions = createAsyncAction(
  `@ModuleConfiguration/GET_DETAIL_MODULE_CONFIGURATION_ACTIONS`,
  `@ModuleConfiguration/GET_DETAIL_MODULE_CONFIGURATION_ACTIONS_SUCCESS`,
  `@ModuleConfiguration/GET_DETAIL_MODULE_CONFIGURATION_ACTIONS_FAIL`,
)<CommonApiParam, GetListModuleConfigurationData, void>();

export const updateDetailModuleConfigurationActions = createAsyncAction(
  `@ModuleConfiguration/UPDATE_DETAIL_MODULE_CONFIGURATION_ACTIONS`,
  `@ModuleConfiguration/UPDATE_DETAIL_MODULE_CONFIGURATION_ACTIONS_SUCCESS`,
  `@ModuleConfiguration/UPDATE_DETAIL_MODULE_CONFIGURATION_ACTIONS_FAIL`,
)<CommonApiParam, { message: string }, void>();

export const getListLabelConfigActions = createAsyncAction(
  `@ModuleConfiguration/GET_LIST_LABEL_CONFIGURATION_ACTIONS`,
  `@ModuleConfiguration/GET_LIST_LABEL_CONFIGURATION_ACTIONS_SUCCESS`,
  `@ModuleConfiguration/GET_LIST_LABEL_CONFIGURATION_ACTIONS_FAIL`,
)<CommonApiParam, ListLabelConfigResponse, void>();

export const getDetailLabelConfigActions = createAsyncAction(
  `@ModuleConfiguration/GET_DETAIL_LABEL_CONFIGURATION_ACTIONS`,
  `@ModuleConfiguration/GET_DETAIL_LABEL_CONFIGURATION_ACTIONS_SUCCESS`,
  `@ModuleConfiguration/GET_DETAIL_LABEL_CONFIGURATION_ACTIONS_FAIL`,
)<CommonApiParam, LabelConfigDetailResponse, void>();

export const updateDetailLabelConfigActions = createAsyncAction(
  `@ModuleConfiguration/UPDATE_DETAIL_LABEL_CONFIGURATION_ACTIONS`,
  `@ModuleConfiguration/UPDATE_DETAIL_LABEL_CONFIGURATION_ACTIONS_SUCCESS`,
  `@ModuleConfiguration/UPDATE_DETAIL_LABEL_CONFIGURATION_ACTIONS_FAIL`,
)<CommonApiParam, { message: string }, void>();

export const selectModule = createAction(
  `@ModuleConfiguration/SELECT_MODULE_ACTIONS`,
)<GetListModuleConfigurationData, void>();

export const clearLabelDetail = createAction(
  `@ModuleConfiguration/CLEAR_LABEL_DETAIL_ACTIONS`,
)<void, void>();

export const resetModuleConfigState = createAction(
  `@ModuleConfiguration/RESET_MODULE_CONFIG_STATE_ACTIONS`,
)<void, void>();
