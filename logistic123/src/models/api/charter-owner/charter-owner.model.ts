import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface CharterOwner {
  id: string;
  name: string;
  code: string;
  status: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  updatedBy?: string;
  updatedName?: string;
  company?: CompanyObject;
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface GetCharterOwnersResponse {
  data: CharterOwner[];
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
export interface GetCharterOwnersParams {
  isRefreshLoading?: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateCharterOwnerParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateCharterOwnerParams {
  id: string;
  data: CreateCharterOwnerParams;
  afterUpdate?: () => void;
}

export interface CharterOwnerDetailResponse {
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
