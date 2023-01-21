import {
  GetOwnerBusinessResponse,
  CreateOwnerBusinessParams,
  UpdateOwnerBusinessParams,
  OwnerBusinessDetailResponse,
} from 'models/api/owner-business/owner-business.model';
import { CommonApiParam, ErrorField } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteOwnerBusiness {
  id: string;
  isDetail?: boolean;
  getListOwnerBusiness: () => void;
}

export const getListOwnerBusiness = createAsyncAction(
  `@ownerBusiness/GET_LIST_OWNER_BUSINESS_ACTIONS`,
  `@ownerBusiness/GET_LIST_OWNER_BUSINESS_ACTIONS_SUCCESS`,
  `@ownerBusiness/GET_LIST_OWNER_BUSINESS_ACTIONS_FAIL`,
)<CommonApiParam, GetOwnerBusinessResponse, void>();

export const deleteOwnerBusiness = createAsyncAction(
  `@ownerBusiness/DELETE_OWNER_BUSINESS_ACTIONS`,
  `@ownerBusiness/DELETE_OWNER_BUSINESS_ACTIONS_SUCCESS`,
  `@ownerBusiness/DELETE_OWNER_BUSINESS_ACTIONS_FAIL`,
)<ParamsDeleteOwnerBusiness, CommonApiParam, void>();

export const createOwnerBusiness = createAsyncAction(
  `@ownerBusiness/CREATE_OWNER_BUSINESS_ACTIONS`,
  `@ownerBusiness/CREATE_OWNER_BUSINESS_ACTIONS_SUCCESS`,
  `@ownerBusiness/CREATE_OWNER_BUSINESS_ACTIONS_FAIL`,
)<CreateOwnerBusinessParams, void, ErrorField[]>();

export const updateOwnerBusiness = createAsyncAction(
  `@ownerBusiness/UPDATE_OWNER_BUSINESS_ACTIONS`,
  `@ownerBusiness/UPDATE_OWNER_BUSINESS_ACTIONS_SUCCESS`,
  `@ownerBusiness/UPDATE_OWNER_BUSINESS_ACTIONS_FAIL`,
)<UpdateOwnerBusinessParams, void, ErrorField[]>();

export const getOwnerBusinessDetailActions = createAsyncAction(
  `@ownerBusiness/GET_OWNER_BUSINESS_DETAIL_ACTIONS`,
  `@ownerBusiness/GET_OWNER_BUSINESS_DETAIL_ACTIONS_SUCCESS`,
  `@ownerBusiness/GET_OWNER_BUSINESS_DETAIL_ACTIONS_FAIL`,
)<string, OwnerBusinessDetailResponse, void>();

export const clearOwnerBusinessReducer = createAction(
  `@ownerBusiness/CLEAR_OWNER_BUSINESS_REDUCER`,
)<void>();

export const clearOwnerBusinessErrorsReducer = createAction(
  `@ownerBusiness/CLEAR_OWNER_BUSINESS_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@ownerBusiness/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
