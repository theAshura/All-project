import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface SecondCategory {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  description?: string;
  companyId?: string;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  company?: CompanyObject;
  createdUserId?: string;
  updatedUserId?: string;
  isNew?: boolean;
  acronym?: string;
  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface GetSecondCategoryResponse {
  data: SecondCategory[];
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
export interface GetSecondCategoryParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateSecondCategoryParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateSecondCategoryParams {
  id: string;
  data: CreateSecondCategoryParams;
  afterUpdate?: () => void;
}

export interface SecondCategoryDetailResponse {
  id: string;
  code: string;
  name: string;
  scope: string;
  status: string;
  description?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
