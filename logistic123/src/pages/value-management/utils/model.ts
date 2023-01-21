import { ErrorField, CommonApiParam, CompanyObject } from 'models/common.model';

export interface DataByUser {
  username: string;
  company?: CompanyObject;
}

export interface GetValueManagement {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  number: number;
  status: string;
  description: string;
  companyId: string;
  company?: CompanyObject;
  createdUserId: string;
  updatedUserId: string;
  createdUser?: DataByUser;
  updatedUser?: DataByUser;
}

export interface GetValueManagementsResponse {
  data: GetValueManagement[];
  page?: number;
  pageSize?: number;
  totalPage?: number;
  totalItem?: number;
}

export interface GetValueManagementsParams {
  isRefreshLoading: boolean;
  paramsList: CommonApiParam;
  handleSuccess?: () => void;
}

export interface CreateValueManagementParams {
  number: number;
  code: string;
  status: string;
  description?: string;
  isNew?: boolean;
  handleSuccess?: () => void;
}

export interface UpdateValueManagementParams {
  id: string;
  data: CreateValueManagementParams;
  handleSuccess?: () => void;
}

export interface ValueManagementResponse {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}

export interface ValueManagementStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listValueManagements: GetValueManagementsResponse;
  valueManagementDetail: ValueManagementResponse;
  errorList: ErrorField[];
}
