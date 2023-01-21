import { STATUS_COMMON } from "api/product/product.interface";
import { FileUploads } from "api/upload-file/upload-file.interface";

export interface CropGuideResponse {
  count: number;
  currentPage: number;
  data: CropGuide[];
  totalPage: number;
}

export interface ParamSearchCropGuide {
  page: string;
  limit: string;
  content: string;
  status: STATUS_COMMON | undefined;
}

export interface CropGuide {
  _id: string;
  name: string;
  title: string;
  shortDescription: string;
  detailDescription: string;
  status: string;
  image: FileUploads;
  label: FileUploads;
  video: FileUploads;
  literature: FileUploads;
  website: Website;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Website {
  link?: string;
  name?: string;
}
export interface Literature {
  link: string;
  file: string;
}
export interface CropGuidePostParams {
  name: string;
  title: string;
  shortDescription: string;
  detailDescription: string;
  image: string;
  video: string;
  literature: string;
  status: string;
  website: Website;
  webLink?: string;
  webLinkName?: string;
}

export interface CropGuideDetailResponse {
  _id: string;
  name: string;
  title: string;
  shortDescription: string;
  detailDescription: string;
  status: string;
  image: FileUploads;
  video: FileUploads;
  literature: FileUploads;
  website: Website;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
