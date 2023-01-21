import { ErrorField } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface ByUser {
  username: string;
}
export interface FeatureConfig {
  id: string;
  moduleName: string;
  companyCode: string;
  fieldType: string;
  fieldId: string;
  fieldLabel: string;
  description: string;
  dataType: string;
  maxLength: string;
  minLength: string;
  enumValues: string;
  status: string;
  fieldRequired: string;
  invisible: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdUser: ByUser;
  updatedUser: ByUser;
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface GetFeatureConfigsResponse {
  data: FeatureConfig[];
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
export interface GetFeatureConfigsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateFeatureConfigParams {
  name: string;
  code: string;
  scope: string;
  afterCreate?: () => void;
}

export interface UpdateFeatureConfigParams {
  id: string;
  data: CreateFeatureConfigParams;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface FeatureConfigDetailResponse {
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
