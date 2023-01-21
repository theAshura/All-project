import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  ListAuthorityMasterResponse,
  AuthorityMaster,
} from 'models/api/authority-master/authority-master.model';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  getListAuthorityMaster: () => void;
}

export const getListAuthorityMasterActions = createAsyncAction(
  `@authorityMaster/GET_LIST_AUTHORITY_MASTER_ACTIONS`,
  `@authorityMaster/GET_LIST_AUTHORITY_MASTER_ACTIONS_SUCCESS`,
  `@authorityMaster/GET_LIST_AUTHORITY_MASTER_ACTIONS_FAIL`,
)<CommonApiParam, ListAuthorityMasterResponse, void>();

export const deleteAuthorityMasterActions = createAsyncAction(
  `@authorityMaster/DELETE_AUTHORITY_MASTER_ACTIONS`,
  `@authorityMaster/DELETE_AUTHORITY_MASTER_ACTIONS_SUCCESS`,
  `@authorityMaster/DELETE_AUTHORITY_MASTER_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createAuthorityMasterActions = createAsyncAction(
  `@authorityMaster/CREATE_AUTHORITY_MASTER_ACTIONS`,
  `@authorityMaster/CREATE_AUTHORITY_MASTER_ACTIONS_SUCCESS`,
  `@authorityMaster/CREATE_AUTHORITY_MASTER_ACTIONS_FAIL`,
)<AuthorityMaster, void, ErrorField[]>();

export const updateAuthorityMasterActions = createAsyncAction(
  `@authorityMaster/UPDATE_AUTHORITY_MASTER_ACTIONS`,
  `@authorityMaster/UPDATE_AUTHORITY_MASTER_ACTIONS_SUCCESS`,
  `@authorityMaster/UPDATE_AUTHORITY_MASTER_ACTIONS_FAIL`,
)<AuthorityMaster, void, ErrorField[]>();

export const getAuthorityMasterDetailActions = createAsyncAction(
  `@authorityMaster/GET_AUTHORITY_MASTER_ACTIONS`,
  `@authorityMaster/GET_AUTHORITY_MASTER_ACTIONS_SUCCESS`,
  `@authorityMaster/GET_AUTHORITY_MASTER_ACTIONS_FAIL`,
)<AuthorityMaster, AuthorityMaster, void>();

export const clearAuthorityMasterReducer = createAction(
  `@authorityMaster/CLEAR_AUTHORITY_MASTER_REDUCER`,
)<void>();
export const clearAuthorityMasterErrorsReducer = createAction(
  `@authorityMaster/CLEAR_AUTHORITY_MASTER__ERRORS_REDUCER`,
)<void>();

export const clearParamsAuthorityMasterReducer = createAction(
  `@authorityMaster/CLEAR_PARAMS_AUTHORITY_MASTER_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@authorityMaster/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
