import { CompanyObject } from 'models/common.model';

export interface VesselType {
  id?: string;
  code?: string;
  name?: string;
  vettingRiskScore?: number;
  status?: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  icon?: string;
  createdName?: string;
  company?: CompanyObject;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  updatedBy?: string;
  updatedName?: string;
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface ListVesselTypeResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<VesselType>;
}
export interface ParamsListVesselType {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  vettingRiskScore?: number;
}
export interface GetVesselTypeParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListVesselType;
  getList?: () => void;
}

export interface updateVesselTypeParam {
  id: string;
  data: VesselType;
  afterUpdate?: () => void;
}
