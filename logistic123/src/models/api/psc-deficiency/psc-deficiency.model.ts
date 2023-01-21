import { CompanyObject } from 'models/common.model';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';

export interface PSCDeficiency {
  id?: string;
  code?: string;
  name?: string;
  status?: string;
  description?: string;
  companyId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  company?: CompanyObject;
  updatedUser?: {
    username?: string;
  };
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface ListPSCDeficiencyResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<PSCDeficiency>;
}
export interface ParamsListPSCDeficiency {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  country?: NewAsyncOptions;
  portType?: string;
}
export interface GetPSCDeficiencyParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListPSCDeficiency;
  getList?: () => void;
}

export interface UpdatePSCDeficiencyParams {
  id: string;
  body: PSCDeficiency;
  afterUpdate?: () => void;
}
