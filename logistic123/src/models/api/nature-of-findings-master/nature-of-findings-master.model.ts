import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { CompanyObject } from 'models/common.model';

export interface InspMapNatFinding {
  id: string;
  isPrimaryFinding: boolean;
}
export interface NatureOfFindingsMaster {
  id?: string;
  code?: string;
  name?: string;
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
  inspMapNatFinding?: InspMapNatFinding[];
  isNew?: boolean;
  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface ListNatureOfFindingsMasterResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<NatureOfFindingsMaster>;
}
export interface ParamsListNatureOfFindingsMaster {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  country?: NewAsyncOptions;
  portType?: string;
}

export interface UpdateNatureOfFindingsMasterParams {
  id: string;
  body: NatureOfFindingsMaster;
  afterUpdate?: () => void;
}
