import {
  GetCharterOwnersResponse,
  CreateCharterOwnerParams,
  UpdateCharterOwnerParams,
  CharterOwnerDetailResponse,
} from 'models/api/charter-owner/charter-owner.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteCharterOwner {
  id: string;
  isDetail?: boolean;
  getListCharterOwner: () => void;
}

export const getListCharterOwnerActions = createAsyncAction(
  `@charterOwner/GET_LIST_CHARTER_OWNER_ACTIONS`,
  `@charterOwner/GET_LIST_CHARTER_OWNER_ACTIONS_SUCCESS`,
  `@charterOwner/GET_LIST_CHARTER_OWNER_ACTIONS_FAIL`,
)<CommonApiParam, GetCharterOwnersResponse, void>();

export const deleteCharterOwnerActions = createAsyncAction(
  `@charterOwner/DELETE_CHARTER_OWNER_ACTIONS`,
  `@charterOwner/DELETE_CHARTER_OWNER_ACTIONS_SUCCESS`,
  `@charterOwner/DELETE_CHARTER_OWNER_ACTIONS_FAIL`,
)<ParamsDeleteCharterOwner, CommonApiParam, void>();

export const createCharterOwnerActions = createAsyncAction(
  `@charterOwner/CREATE_CHARTER_OWNER_ACTIONS`,
  `@charterOwner/CREATE_CHARTER_OWNER_ACTIONS_SUCCESS`,
  `@charterOwner/CREATE_CHARTER_OWNER_ACTIONS_FAIL`,
)<CreateCharterOwnerParams, void, ErrorField[]>();

export const updateCharterOwnerActions = createAsyncAction(
  `@charterOwner/UPDATE_CHARTER_OWNER_ACTIONS`,
  `@charterOwner/UPDATE_CHARTER_OWNER_ACTIONS_SUCCESS`,
  `@charterOwner/UPDATE_CHARTER_OWNER_ACTIONS_FAIL`,
)<UpdateCharterOwnerParams, void, ErrorField[]>();

export const getCharterOwnerDetailActions = createAsyncAction(
  `@charterOwner/GET_CHARTER_OWNER_DETAIL_ACTIONS`,
  `@charterOwner/GET_CHARTER_OWNER_DETAIL_ACTIONS_SUCCESS`,
  `@charterOwner/GET_CHARTER_OWNER_DETAIL_ACTIONS_FAIL`,
)<string, CharterOwnerDetailResponse, void>();

export const clearCharterOwnerReducer = createAction(
  `@charterOwner/CLEAR_CHARTER_OWNER_REDUCER`,
)<void>();

export const clearCharterOwnerErrorsReducer = createAction(
  `@charterOwner/CLEAR_CHARTER_OWNER_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@charterOwner/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
