import { createAsyncAction, createAction } from 'typesafe-actions';
import { MessageErrorResponse } from 'models/store/MessageError.model';
import {
  CreateManagementParams,
  UpdateCompanyManagementParams,
  CompanyManagementDetail,
} from 'models/store/company/company.model';
import { AvatarType, CommonApiParam } from 'models/common.model';
import {
  GetCompanyDetail,
  ListCompanyManagementResponse,
} from '../../models/api/company/company.model';

interface ParamsDelete {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export const getListCompanyManagementActions = createAsyncAction(
  `@companyManagement/GET_LIST_COMPANY_ACTIONS`,
  `@companyManagement/GET_LIST_COMPANY_ACTIONS_SUCCESS`,
  `@companyManagement/GET_LIST_COMPANY_ACTIONS_FAIL`,
)<CommonApiParam, ListCompanyManagementResponse, void>();

export const deleteCompanyManagementActions = createAsyncAction(
  `@companyManagement/DELETE_COMPANY_ACTIONS`,
  `@companyManagement/DELETE_COMPANY_ACTIONS_SUCCESS`,
  `@companyManagement/DELETE_COMPANY_ACTIONS_FAIL`,
)<ParamsDelete, CommonApiParam, void>();

export const createCompanyManagementActions = createAsyncAction(
  `@companyManagement/CREATE_COMPANY_ACTIONS`,
  `@companyManagement/CREATE_COMPANY_ACTIONS_SUCCESS`,
  `@companyManagement/CREATE_COMPANY_ACTIONS_FAIL`,
)<CreateManagementParams, void, MessageErrorResponse[]>();

export const updateCompanyManagementActions = createAsyncAction(
  `@companyManagement/UPDATE_COMPANY_ACTIONS`,
  `@companyManagement/UPDATE_COMPANY_ACTIONS_SUCCESS`,
  `@companyManagement/UPDATE_COMPANY_ACTIONS_FAIL`,
)<UpdateCompanyManagementParams, void, MessageErrorResponse[]>();

export const getCompanyManagementDetailActions = createAsyncAction(
  `@companyManagement/GET_COMPANY_ACTIONS`,
  `@companyManagement/GET_COMPANY_ACTIONS_SUCCESS`,
  `@companyManagement/GET_COMPANY_ACTIONS_FAIL`,
)<GetCompanyDetail, CompanyManagementDetail, void>();

export const uploadFileActions = createAsyncAction(
  `@companyManagement/UPLOAD_FILE_ACTIONS`,
  `@companyManagement/UPLOAD_FILE_ACTIONS_SUCCESS`,
  `@companyManagement/UPLOAD_FILE_ACTIONS_FAIL`,
)<FormData, AvatarType, void>();

export const clearCompanyManagementReducer = createAction(
  'group/CLEAR_COMPANY',
)<void>();

export const updateParamsActions = createAction(
  '@companyManagement/UPDATE_PARAMS_LIST',
)<CommonApiParam>();
