import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';

export interface MobileConfig {
  id?: string;
  shoreUrlIP?: string;
  shoreUrlActual?: string;
  companyName?: string;
  companyCode?: string;
  serverTime?: Date;
  type?: string;
  groupCode?: string;
  groupName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isNew?: boolean;
  resetForm?: () => void;
}

export interface ListMobileConfigResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<MobileConfig>;
}
export interface ParamsListMobileConfig {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  country?: NewAsyncOptions;
  portType?: string;
}
export interface GetMobileConfigParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListMobileConfig;
  getList?: () => void;
}

export interface UpdateMobileConfigParams {
  id: string;
  body: MobileConfig;
}
