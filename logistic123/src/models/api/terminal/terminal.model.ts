import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface PortMaster {
  code: string;
  name: string;
  country?: string;
}
export interface Terminal {
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
  portMasterId: string;
  portMaster: PortMaster;
  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface GetTerminalResponse {
  data: Terminal[];
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
export interface GetTerminalParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateTerminalParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateTerminalParams {
  id: string;
  data: CreateTerminalParams;
  afterUpdate?: () => void;
}

export interface TerminalDetailResponse {
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
