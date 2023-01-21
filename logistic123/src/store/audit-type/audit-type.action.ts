import {
  GetAuditTypesResponse,
  CreateAuditTypeParams,
  UpdateAuditTypeParams,
  AuditTypeDetailResponse,
} from 'models/api/audit-type/audit-type.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteAuditType {
  id: string;
  isDetail?: boolean;
  getListAuditType: () => void;
}

export const getListAuditTypeActions = createAsyncAction(
  `@auditType/GET_LIST_AUDIT_TYPE_ACTIONS`,
  `@auditType/GET_LIST_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@auditType/GET_LIST_AUDIT_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, GetAuditTypesResponse, void>();

export const deleteAuditTypeActions = createAsyncAction(
  `@auditType/DELETE_AUDIT_TYPE_ACTIONS`,
  `@auditType/DELETE_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@auditType/DELETE_AUDIT_TYPE_ACTIONS_FAIL`,
)<ParamsDeleteAuditType, CommonApiParam, void>();

export const createAuditTypeActions = createAsyncAction(
  `@auditType/CREATE_AUDIT_TYPE_ACTIONS`,
  `@auditType/CREATE_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@auditType/CREATE_AUDIT_TYPE_ACTIONS_FAIL`,
)<CreateAuditTypeParams, void, ErrorField[]>();

export const updateAuditTypeActions = createAsyncAction(
  `@auditType/UPDATE_AUDIT_TYPE_ACTIONS`,
  `@auditType/UPDATE_AUDIT_TYPE_ACTIONS_SUCCESS`,
  `@auditType/UPDATE_AUDIT_TYPE_ACTIONS_FAIL`,
)<UpdateAuditTypeParams, void, ErrorField[]>();

export const getAuditTypeDetailActions = createAsyncAction(
  `@auditType/GET_AUDIT_TYPE_DETAIL_ACTIONS`,
  `@auditType/GET_AUDIT_TYPE_DETAIL_ACTIONS_SUCCESS`,
  `@auditType/GET_AUDIT_TYPE_DETAIL_ACTIONS_FAIL`,
)<string, AuditTypeDetailResponse, void>();

export const clearAuditTypeReducer = createAction(
  `@auditType/CLEAR_AUDIT_TYPE_REDUCER`,
)<void>();

export const clearAuditTypeErrorsReducer = createAction(
  `@auditType/CLEAR_AUDIT_TYPE_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  '@auditType/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
