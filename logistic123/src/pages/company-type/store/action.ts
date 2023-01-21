import { createAsyncAction } from 'typesafe-actions';
import { CommonApiParam } from 'models/common.model';

import { ResponsesCompanyType, CompanyTypeBody } from '../utils/model';

export const getListCompanyTypeActions = createAsyncAction(
  `@companyType/GET_LIST_COMPANY_TYPE_ACTIONS`,
  `@companyType/GET_LIST_COMPANY_TYPE_ACTIONS_SUCCESS`,
  `@companyType/GET_LIST_COMPANY_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, ResponsesCompanyType, void>();

export const deleteCompanyTypeActions = createAsyncAction(
  `@companyType/DELETE_COMPANY_TYPE_ACTIONS`,
  `@companyType/DELETE_COMPANY_TYPE_ACTIONS_SUCCESS`,
  `@companyType/DELETE_COMPANY_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, void, void>();

export const createCompanyTypeActions = createAsyncAction(
  `@companyType/CREATE_COMPANY_TYPE_ACTIONS`,
  `@companyType/CREATE_COMPANY_TYPE_ACTIONS_SUCCESS`,
  `@companyType/CREATE_COMPANY_TYPE_ACTIONS_FAIL`,
)<CompanyTypeBody, void, void>();

export const updateCompanyTypeActions = createAsyncAction(
  `@companyType/UPDATE_COMPANY_TYPE_ACTIONS`,
  `@companyType/UPDATE_COMPANY_TYPE_ACTIONS_SUCCESS`,
  `@companyType/UPDATE_COMPANY_TYPE_ACTIONS_FAIL`,
)<CompanyTypeBody, void, void>();

export const getCompanyTypeDetailActions = createAsyncAction(
  `@companyType/GET_COMPANY_TYPE_DETAIL_ACTIONS`,
  `@companyType/GET_COMPANY_TYPE_DETAIL_ACTIONS_SUCCESS`,
  `@companyType/GET_DIVISION_DETAIL_ACTIONS_FAIL`,
)<string, any, void>();
