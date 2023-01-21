import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { CompanyObject } from 'models/common.model';
import { RankMaster } from '../rank-master/rank-master.model';

export interface DepartmentMaster {
  id?: string;
  code?: string;
  name?: string;
  type?: string;
  ranks?: RankMaster[];
  rankIds?: string[];
  status?: string;
  description?: string;
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

export interface ListDepartmentMasterResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<DepartmentMaster>;
}
export interface ParamsListDepartmentMaster {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  country?: NewAsyncOptions;
  portType?: string;
}
export interface GetDepartmentMasterParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListDepartmentMaster;
  getList?: () => void;
}

export interface UpdateDepartmentMasterParams {
  id: string;
  data: DepartmentMaster;
  afterUpdate?: () => void;
}
