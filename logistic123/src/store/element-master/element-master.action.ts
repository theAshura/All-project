import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  StandardMaster,
  GetStandardMastersResponse,
  BulkUpdateElementMasterParams,
  ElementMaster,
  GetElementMastersResponse,
} from 'models/api/element-master/element-master.model';

interface ParamsDeleteElementMaster {
  id: string;
  isDetail?: boolean;
  getListElementMaster: () => void;
}

interface ParamsDeleteStandardMaster {
  id: string;
  isDetail?: boolean;
  data: BulkUpdateElementMasterParams;
  getListStandardMaster: () => void;
}

export const getListStandardMasterActions = createAsyncAction(
  `@ElementMaster/GET_LIST_STANDARD_MASTER_ACTIONS`,
  `@ElementMaster/GET_LIST_STANDARD_MASTER_ACTIONS_SUCCESS`,
  `@ElementMaster/GET_LIST_STANDARD_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, GetStandardMastersResponse, void>();

export const getListStandardMasterNoElementActions = createAsyncAction(
  `@ElementMaster/GET_LIST_STANDARD_MASTER_NO_ELEMENT_ACTIONS`,
  `@ElementMaster/GET_LIST_STANDARD_MASTER_NO_ELEMENT_ACTIONS_SUCCESS`,
  `@ElementMaster/GET_LIST_STANDARD_MASTER_NO_ELEMENT_ACTIONS_FAIL`,
)<CommonApiParam, GetStandardMastersResponse, void>();

export const getStandardMasterDetailActions = createAsyncAction(
  `@ElementMaster/GET_STANDARD_MASTER_DETAIL_ACTIONS`,
  `@ElementMaster/GET_STANDARD_MASTER_DETAIL_ACTIONS_SUCCESS`,
  `@ElementMaster/GET_STANDARD_MASTER_DETAIL_ACTIONS_FAIL`,
)<string, StandardMaster, void>();

export const deleteStandardMasterActions = createAsyncAction(
  `@ElementMaster/DELETE_STANDARD_MASTER_ACTIONS`,
  `@ElementMaster/DELETE_STANDARD_MASTER_ACTIONS_SUCCESS`,
  `@ElementMaster/DELETE_STANDARD_MASTER_ACTIONS_FAIL`,
)<ParamsDeleteStandardMaster, void, ErrorField[]>();

export const getListElementMasterActions = createAsyncAction(
  `@ElementMaster/GET_LIST_ELEMENT_MASTER_ACTIONS`,
  `@ElementMaster/GET_LIST_ELEMENT_MASTER_ACTIONS_SUCCESS`,
  `@ElementMaster/GET_LIST_ELEMENT_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, GetElementMastersResponse, void>();

export const updateElementMasterActions = createAsyncAction(
  `@ElementMaster/UPDATE_ELEMENT_MASTER_ACTIONS`,
  `@ElementMaster/UPDATE_ELEMENT_MASTER_ACTIONS_SUCCESS`,
  `@ElementMaster/UPDATE_ELEMENT_MASTER_ACTIONS_FAIL`,
)<BulkUpdateElementMasterParams, void, ErrorField[]>();

export const getElementMasterDetailActions = createAsyncAction(
  `@ElementMaster/GET_ELEMENT_MASTER_DETAIL_ACTIONS`,
  `@ElementMaster/GET_ELEMENT_MASTER_DETAIL_ACTIONS_SUCCESS`,
  `@ElementMaster/GET_ELEMENT_MASTER_DETAIL_ACTIONS_FAIL`,
)<string, ElementMaster, void>();

export const deleteElementMasterActions = createAsyncAction(
  `@ElementMaster/DELETE_ELEMENT_MASTER_ACTIONS`,
  `@ElementMaster/DELETE_ELEMENT_MASTER_ACTIONS_SUCCESS`,
  `@ElementMaster/DELETE_ELEMENT_MASTER_ACTIONS_FAIL`,
)<ParamsDeleteElementMaster, void, void>();

export const clearElementMasterReducer = createAction(
  `@ElementMaster/CLEAR_ELEMENT_MASTER_REDUCER`,
)<void | boolean>();

export const clearElementMasterErrorsReducer = createAction(
  `@ElementMaster/CLEAR_ELEMENT_MASTER_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@ElementMaster/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();

export const setDataFilterAction = createAction(
  `@ElementMaster/SET_DATA_FILTER`,
)<CommonApiParam>();
