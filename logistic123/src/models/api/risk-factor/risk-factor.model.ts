import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface CreatedUser {
  username: string;
}

export interface RiskFactor {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  companyId: string;
  status: string;
  description: string;
  createdUserId: string;
  updatedUserId?: any;
  company: CompanyObject;
  createdUser: CreatedUser;
  updatedUser?: any;
  isNew?: boolean;

  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface GetRiskFactorResponse {
  data: RiskFactor[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
}
export interface GetRiskFactorParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateRiskFactorParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateRiskFactorParams {
  id: string;
  data: CreateRiskFactorParams;
  afterUpdate?: () => void;
}

export interface RiskFactorDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  companyId: string;
  status: string;
  description: string;
  createdUserId: string;
  updatedUserId?: any;
  company: CompanyObject;
  createdUser: CreatedUser;
  updatedUser?: any;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
