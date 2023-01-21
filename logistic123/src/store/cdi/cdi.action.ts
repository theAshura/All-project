import {
  GetCDIsResponse,
  CreateCDIParams,
  UpdateCDIParams,
  CDIDetailResponse,
} from 'models/api/cdi/cdi.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteCDI {
  id: string;
  isDetail?: boolean;
  getListCDI: () => void;
}

export const getListCDIActions = createAsyncAction(
  `@CDIManagement/GET_LIST_CDI_ACTIONS`,
  `@CDIManagement/GET_LIST_CDI_ACTIONS_SUCCESS`,
  `@CDIManagement/GET_LIST_CDI_ACTIONS_FAIL`,
)<CommonApiParam, GetCDIsResponse, void>();

export const deleteCDIActions = createAsyncAction(
  `@CDIManagement/DELETE_CDI_ACTIONS`,
  `@CDIManagement/DELETE_CDI_ACTIONS_SUCCESS`,
  `@CDIManagement/DELETE_CDI_ACTIONS_FAIL`,
)<ParamsDeleteCDI, CommonApiParam, void>();

export const createCDIActions = createAsyncAction(
  `@CDIManagement/CREATE_CDI_ACTIONS`,
  `@CDIManagement/CREATE_CDI_ACTIONS_SUCCESS`,
  `@CDIManagement/CREATE_CDI_ACTIONS_FAIL`,
)<CreateCDIParams, void, ErrorField[]>();

export const updateCDIActions = createAsyncAction(
  `@CDIManagement/UPDATE_CDI_ACTIONS`,
  `@CDIManagement/UPDATE_CDI_ACTIONS_SUCCESS`,
  `@CDIManagement/UPDATE_CDI_ACTIONS_FAIL`,
)<UpdateCDIParams, void, ErrorField[]>();

export const getCDIDetailActions = createAsyncAction(
  `@CDIManagement/GET_CDI_DETAIL_ACTIONS`,
  `@CDIManagement/GET_CDI_DETAIL_ACTIONS_SUCCESS`,
  `@CDIManagement/GET_CDI_DETAIL_ACTIONS_FAIL`,
)<string, CDIDetailResponse, void>();

export const clearCDIReducer = createAction(
  `@CDIManagement/CLEAR_CDI_REDUCER`,
)<void>();

export const clearCDIErrorsReducer = createAction(
  `@CDIManagement/CLEAR_CDI_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@CDI/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
