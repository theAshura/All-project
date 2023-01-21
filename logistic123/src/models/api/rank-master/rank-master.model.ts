import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { CompanyObject } from 'models/common.model';

export interface RankMaster {
  id?: string;
  code?: string;
  name?: string;
  type?: string;
  status?: string;
  description?: string;
  companyId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  company?: CompanyObject;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface ListRankMasterResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<RankMaster>;
}
export interface ParamsListRankMaster {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  country?: NewAsyncOptions;
  portType?: string;
}
export interface GetRankMasterParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListRankMaster;
  getList?: () => void;
}

export interface UpdateRankMasterParams {
  id: string;
  data: RankMaster;
  afterUpdate?: () => void;
}
