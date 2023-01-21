import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { CompanyObject } from 'models/common.model';

export interface AppTypeProperty {
  id?: string;
  appCode?: string;
  appName?: string;
  eligibleSyncLocation?: string;
  autoPurge?: number;
  autoDeactive?: number;
  fileValidity?: number;
  dataLifeSpan?: number;
  USBPath?: string;
  isAutoFlush?: boolean;
  enableVesselFieldAudit?: boolean;
  networkMode?: string;
  downloadLimit?: number;
  androidVersion?: string;
  iOSVersion?: string;
  windowsVersion?: string;
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
}
export interface ListAppTypePropertyResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<AppTypeProperty>;
}
export interface ParamsListAppTypeProperty {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  country?: NewAsyncOptions;
  portType?: string;
}
export interface GetAppTypePropertyParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListAppTypeProperty;
  getList?: () => void;
}

export interface UpdateAppTypePropertyParams {
  id: string;
  body: AppTypeProperty;
}
