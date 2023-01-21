import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface AuditType {
  id: string;
  name: string;
  code: string;
  scope: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  company: CompanyObject;
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface GetAuditTypesResponse {
  data: AuditType[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  scope?: string;
  sort?: string;
}
export interface GetAuditTypesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateAuditTypeParams {
  name: string;
  code: string;
  scope: string;
  afterCreate?: () => void;
}

export interface UpdateAuditTypeParams {
  id: string;
  data: CreateAuditTypeParams;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface AuditTypeDetailResponse {
  id: string;
  code: string;
  name: string;
  scope: string;
  status: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
