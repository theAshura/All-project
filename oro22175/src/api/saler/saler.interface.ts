import { STATUS_COMMON } from "api/product/product.interface";

export enum NAME {
  ASC = "asc",
  DESC = "des",
}

export interface ListSalerParams {
  page?: string;
  limit?: string;
  content?: string;
  name?: NAME;
  status?: STATUS_COMMON;
  stateId?: string;
}
export interface GetListSalerResponse {
  count: number;
  currentPage: number;
  data: DataSaler[];
  totalPage: number;
}
export interface PostSalerParams {
  name?: string;
  avatar?: string;
  phoneNumber?: string;
  email?: string;
  states?: string[];
  status: STATUS_COMMON;
}
export interface ParamSearchSaler {
  page?: string;
  limit?: string;
  content?: string;
  statesId?: string;
  status?: STATUS_COMMON | undefined;
}
export interface DataSaler {
  _id: string;
  name: string;
  avatar: Avatar;
  phoneNumber: string;
  email: string;
  states: State[];
  status: STATUS_COMMON;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Avatar {
  _id: string;
  fileName: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface StateParams {
  page?: string;
  limit?: string;
  content?: string;
  name?: NAME;
}
export interface State {
  [x: string]: any;
  _id: string;
  name: string;
  abbreviation: string;
  status: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StateResponse {
  count: number;
  currentPage: number;
  data: State[];
  totalPage: number;
}

export enum Status {
  Active = "active",
}
