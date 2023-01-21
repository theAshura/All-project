import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { CompanyObject } from 'models/common.model';

export interface Type {
  id: string;
  name: string;
}
export interface AuthorityMaster {
  id?: string;
  code?: string;
  name?: string;
  status?: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
  eventTypeIds?: string[];
  inspectionTypeIds?: string[];
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
  inspectionTypes?: NewAsyncOptions[] | Type[];
  eventTypes?: NewAsyncOptions[] | Type[];
}

export interface ListAuthorityMasterResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<AuthorityMaster>;
}
export interface ParamsListAuthorityMaster {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  eventTypeId?: string;
}
export interface GetAuthorityMasterParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListAuthorityMaster;
  getList?: () => void;
}
