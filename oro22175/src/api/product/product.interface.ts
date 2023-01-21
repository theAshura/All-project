import { FileUploads } from "api/upload-file/upload-file.interface";
// product request

export interface ProductRequest {
  name: string;
  shortDescription?: string;
  detailDescription?: string;
  image: string;
  label: string;
  video?: string;
  literature: string;
  website1?: Website;
  website2?: Website;
  applications: string[];
  status: string;
  webLink1?: string;
  webLinkName1?: string;
  webLink2?: string;
  webLinkName2?: string;
}

// product response
export interface ProductResponse {
  count: number;
  currentPage: number;
  data: Product[];
  totalPage: number;
}

// product detail response

export interface ProductDetailResponse {
  _id: string;
  name: string;
  shortDescription: string;
  detailDescription: string;
  image: FileUploads;
  label: FileUploads;
  video: FileUploads;
  literature: FileUploads;
  website1: Website;
  website2: Website;
  status: string;
  applications: Application[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ParamSearchProducts {
  page: string;
  limit: string;
  content: string;
  applicationId: string;
  status: STATUS_COMMON | undefined;
}

export interface Website {
  link?: string;
  name?: string;
}

export interface Application {
  _id: string;
  name: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  detailDescription: string;
  image: FileUploads;
  label: FileUploads;
  video: FileUploads;
  literature: FileUploads;
  website1: Website;
  website2: Website;
  status: string;
  applications: Application[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export enum STATUS_COMMON {
  ACTIVE = "active",
  IN_ACTIVE = "inactive",
  ALL = "all",
}
