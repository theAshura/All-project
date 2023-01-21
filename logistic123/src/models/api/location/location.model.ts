import { ErrorField, CompanyObject } from 'models/common.model';

export enum status {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface Location {
  id: string;
  name: string;
  code: string;
  status: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
  company?: CompanyObject;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  acronym?: string;
  updatedBy?: string;
  updatedName?: string;
  isNew?: boolean;

  resetForm?: () => void;
}

export interface GetLocationsResponse {
  data: Location[];
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
export interface GetLocationsParams {
  isRefreshLoading?: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateLocationParams {
  name: string;
  code: string;
  status: string;
  description?: string;
  afterCreate?: () => void;
}

export interface UpdateLocationParams {
  id: string;
  data: CreateLocationParams;
  afterUpdate?: () => void;
}

export interface LocationDetailResponse {
  id: string;
  code: string;
  name: string;
  status: string;
  description?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
