import {
  DepartmentMaster,
  ListDepartmentMasterResponse,
  UpdateDepartmentMasterParams,
} from 'models/api/department-master/department-master.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListDepartmentMaster: () => void;
}

export const getListDepartmentMasterActions = createAsyncAction(
  `@psc/GET_LIST_DepartmentMaster_ACTIONS`,
  `@psc/GET_LIST_DepartmentMaster_ACTIONS_SUCCESS`,
  `@psc/GET_LIST_DepartmentMaster_ACTIONS_FAIL`,
)<CommonApiParam, ListDepartmentMasterResponse, void>();

export const deleteDepartmentMasterActions = createAsyncAction(
  `@psc/DELETE_DepartmentMaster_ACTIONS`,
  `@psc/DELETE_DepartmentMaster_ACTIONS_SUCCESS`,
  `@psc/DELETE_DepartmentMaster_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createDepartmentMasterActions = createAsyncAction(
  `@psc/CREATE_DepartmentMaster_ACTIONS`,
  `@psc/CREATE_DepartmentMaster_ACTIONS_SUCCESS`,
  `@psc/CREATE_DepartmentMaster_ACTIONS_FAIL`,
)<DepartmentMaster, void, ErrorField[]>();

export const updateDepartmentMasterActions = createAsyncAction(
  `@psc/UPDATE_DepartmentMaster_ACTIONS`,
  `@psc/UPDATE_DepartmentMaster_ACTIONS_SUCCESS`,
  `@psc/UPDATE_DepartmentMaster_ACTIONS_FAIL`,
)<UpdateDepartmentMasterParams, void, ErrorField[]>();

export const getDepartmentMasterDetailActions = createAsyncAction(
  `@psc/GET_DepartmentMaster_ACTIONS`,
  `@psc/GET_DepartmentMaster_ACTIONS_SUCCESS`,
  `@psc/GET_DepartmentMaster_ACTIONS_FAIL`,
)<DepartmentMaster, DepartmentMaster, void>();

export const clearDepartmentMasterReducer = createAction(
  `@psc/CLEAR_DepartmentMaster_REDUCER`,
)<void>();

export const clearParamsDepartmentMasterReducer = createAction(
  `@psc/CLEAR_PARAMS_DepartmentMaster_REDUCER`,
)<void>();

export const clearDepartmentMasterErrorsReducer = createAction(
  `@psc/CLEAR_ERRORS_DepartmentMaster_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@psc/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
