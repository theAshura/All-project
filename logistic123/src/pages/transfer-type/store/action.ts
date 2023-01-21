import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  GetTransferTypesResponse,
  GetCompanysParams,
  GetCompanysResponse,
  CreateTransferTypeParams,
  UpdateTransferTypeParams,
  TransferTypeDetailResponse,
  CheckExitCodeParams,
  checkExitResponse,
} from '../utils/model';

interface ParamsDeleteTransferType {
  id: string;
  isDetail?: boolean;
  getListTransferType: () => void;
}

export const getListTransferTypeActions = createAsyncAction(
  `@TransferType/GET_LIST_TRANSFER_TYPE_ACTIONS`,
  `@TransferType/GET_LIST_TRANSFER_TYPE_ACTIONS_SUCCESS`,
  `@TransferType/GET_LIST_TRANSFER_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, GetTransferTypesResponse, void>();

export const getListCompanyActions = createAsyncAction(
  `@TransferType/GET_LIST_COMPANY_ACTIONS`,
  `@TransferType/GET_LIST_COMPANY_ACTIONS_SUCCESS`,
  `@TransferType/GET_LIST_COMPANY_ACTIONS_FAIL`,
)<GetCompanysParams, GetCompanysResponse, void>();

export const deleteTransferTypeActions = createAsyncAction(
  `@TransferType/DELETE_TRANSFER_TYPE_ACTIONS`,
  `@TransferType/DELETE_TRANSFER_TYPE_ACTIONS_SUCCESS`,
  `@TransferType/DELETE_TRANSFER_TYPE_ACTIONS_FAIL`,
)<ParamsDeleteTransferType, CommonApiParam, void>();

export const createTransferTypeActions = createAsyncAction(
  `@TransferType/CREATE_TRANSFER_TYPE_ACTIONS`,
  `@TransferType/CREATE_TRANSFER_TYPE_ACTIONS_SUCCESS`,
  `@TransferType/CREATE_TRANSFER_TYPE_ACTIONS_FAIL`,
)<CreateTransferTypeParams, void, ErrorField[]>();

export const checkExitCodeAction = createAsyncAction(
  `@TransferType/CHECK_EXIT_CODE_ACTIONS`,
  `@TransferType/CHECK_EXIT_CODE_ACTIONS_SUCCESS`,
  `@TransferType/CHECK_EXIT_CODE_ACTIONS_FAIL`,
)<CheckExitCodeParams, checkExitResponse, void>();

export const updateTransferTypeActions = createAsyncAction(
  `@TransferType/UPDATE_TRANSFER_TYPE_ACTIONS`,
  `@TransferType/UPDATE_TRANSFER_TYPE_ACTIONS_SUCCESS`,
  `@TransferType/UPDATE_TRANSFER_TYPE_ACTIONS_FAIL`,
)<UpdateTransferTypeParams, void, ErrorField[]>();

export const getTransferTypeDetailActions = createAsyncAction(
  `@TransferType/GET_TRANSFER_TYPE_DETAIL_ACTIONS`,
  `@TransferType/GET_TRANSFER_TYPE_DETAIL_ACTIONS_SUCCESS`,
  `@TransferType/GET_TRANSFER_TYPE_DETAIL_ACTIONS_FAIL`,
)<string, TransferTypeDetailResponse, void>();

export const clearTransferTypeReducer = createAction(
  `@TransferType/CLEAR_TRANSFER_TYPE_REDUCER`,
)<void>();

export const clearTransferTypeErrorsReducer = createAction(
  `@TransferType/CLEAR_TRANSFER_TYPE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@TransferType/UPDATE_PARAMS_LIST',
)<CommonApiParam>();

export const clearTransferTypeParamsReducer = createAction(
  `@TransferType/CLEAR_TRANSFER_TYPE_PARAMS_REDUCER`,
)<void>();
