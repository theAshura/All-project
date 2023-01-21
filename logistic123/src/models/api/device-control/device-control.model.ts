import { CompanyObject } from 'models/common.model';

export interface DeviceControl {
  id?: string;
  appCode?: string;
  deviceId?: string;
  version?: string;
  deviceType?: string;
  deviceModel?: string;
  deviceStatus?: string;
  status?: string;
  companyId?: string;
  lastAsyncDeviceTime?: string;
  lastAsyncServerTime?: string;
  createdUser?: {
    username: string;
  };
  company?: CompanyObject;
  createdAt?: Date;
  updatedUser?: {
    username: string;
  };
  updatedAt?: Date;
}
export interface ListDeviceControlResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<DeviceControl>;
}
export interface UpdateDeviceControlParams {
  id: string;
  body: DeviceControl;
  afterUpdate?: () => void;
}

export interface UpdateDeviceControlStatusParams {
  id: string;
  status: string;
}
