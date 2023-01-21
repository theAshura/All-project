import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { CompanyObject } from 'models/common.model';

export interface Port {
  id?: string;
  code?: string;
  name?: string;
  country?: string;
  portType?: string;
  status?: string;
  isBunkerPort?: boolean;
  isEuroFlag?: boolean;
  latitude?: string;
  longitude?: string;
  gmtOffset?: string;
  company?: CompanyObject;
  numDependents?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };

  companyId?: string;
  isNew?: boolean;
  resetForm?: () => void;
}

export interface ListPortResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<Port>;
}
export interface ParamsListPort {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  country?: NewAsyncOptions;
  portType?: string;
}
export interface GetPortParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListPort;
  getList?: () => void;
}

export interface GMT {
  name?: string;
  key?: string;
}

export interface UpdatePortParams {
  id: string;
  body: Port;
}
