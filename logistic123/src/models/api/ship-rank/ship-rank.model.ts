import { ErrorField } from 'models/common.model';

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface ShipRank {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  description: null | string;
  status: string;
  companyId: string;
  createdUserId: string | null;
  updatedUserId: string;
  createdUser: {
    username: string;
  };
  updatedUser: {
    username: string;
  };
  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetShipRanksResponse {
  data: ShipRank[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  type?: string;
}
export interface GetShipRanksParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateShipRankParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateShipRankParams {
  id: string;
  data: CreateShipRankParams;
}

export interface ShipDepartment {
  id: string;
  name: string;
}
export interface ShipRankDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  description: null | string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: null | string;
  shipDepartments: ShipDepartment[];
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
