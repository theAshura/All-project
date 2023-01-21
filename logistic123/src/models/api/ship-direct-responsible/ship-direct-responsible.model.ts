import { ErrorField } from 'models/common.model';
import { ReactElement } from 'react';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}
export interface ShipDirectResponsible {
  id: string;
  name: string;
  code: string;
  shipRankId: string;
  shipRank: OptionProps;
  status: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
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
}

export interface GetShipDirectResponsiblesResponse {
  data: ShipDirectResponsible[];
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
}
export interface GetShipDirectResponsiblesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateShipDirectResponsibleParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateShipDirectResponsibleParams {
  id: string;
  data: CreateShipDirectResponsibleParams;
}

export interface ShipDirectResponsibleDetailResponse {
  id: string;
  code: string;
  name: string;
  scope: string;
  shipRankId?: string;
  status: string;
  description?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
