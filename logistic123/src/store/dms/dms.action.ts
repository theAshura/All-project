import {
  DMS,
  GetDMSsResponse,
  GetListFile,
  UpdateDMSParams,
} from 'models/api/dms/dms.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteDMS {
  id: string;
  isDetail?: boolean;
  getListDMS: () => void;
}

export const getListDMSActions = createAsyncAction(
  `@DMS/GET_LIST_DMS_ACTIONS`,
  `@DMS/GET_LIST_DMS_ACTIONS_SUCCESS`,
  `@DMS/GET_LIST_DMS_ACTIONS_FAIL`,
)<CommonApiParam, GetDMSsResponse, void>();

export const deleteDMSActions = createAsyncAction(
  `@DMS/DELETE_DMS_ACTIONS`,
  `@DMS/DELETE_DMS_ACTIONS_SUCCESS`,
  `@DMS/DELETE_DMS_ACTIONS_FAIL`,
)<ParamsDeleteDMS, CommonApiParam, void>();

export const createDMSActions = createAsyncAction(
  `@DMS/CREATE_DMS_ACTIONS`,
  `@DMS/CREATE_DMS_ACTIONS_SUCCESS`,
  `@DMS/CREATE_DMS_ACTIONS_FAIL`,
)<DMS, void, ErrorField[]>();

export const updateDMSActions = createAsyncAction(
  `@DMS/UPDATE_DMS_ACTIONS`,
  `@DMS/UPDATE_DMS_ACTIONS_SUCCESS`,
  `@DMS/UPDATE_DMS_ACTIONS_FAIL`,
)<UpdateDMSParams, void, ErrorField[]>();

export const getDMSDetailActions = createAsyncAction(
  `@DMS/GET_DMS_DETAIL_ACTIONS`,
  `@DMS/GET_DMS_DETAIL_ACTIONS_SUCCESS`,
  `@DMS/GET_DMS_DETAIL_ACTIONS_FAIL`,
)<string, DMS, void>();

export const getListFileActions = createAsyncAction(
  `@DMS/GET_LIST_FILE_ACTIONS`,
  `@DMS/GET_LIST_FILE_ACTIONS_SUCCESS`,
  `@DMS/GET_LIST_FILE_ACTIONS_FAIL`,
)<any, GetListFile[], void>();

export const downloadFileActions = createAsyncAction(
  `@DMS/DOWNLOAD_FILE_ACTIONS`,
  `@DMS/DOWNLOAD_FILE_ACTIONS_SUCCESS`,
  `@DMS/DOWNLOAD_FILE_ACTIONS_FAIL`,
)<string, void, void>();

export const clearDMSReducer = createAction(`@DMS/CLEAR_DMS_REDUCER`)<void>();

export const clearDMSErrorsReducer = createAction(
  `@DMS/CLEAR_DMS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@DMS/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
