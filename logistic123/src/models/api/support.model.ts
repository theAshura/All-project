import { Country } from 'models/store/support.model';

export interface GetCountryParams {
  content?: string;
}

export interface GetCountryResponsive {
  data: Country[];
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
}

export interface Image {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  mimetype: string;
  type: string;
  key: string;
  prefix: string;
  originName: string;
  size: number;
  module: any;
  sizes: string[];
  status: string;
  link: string;
}

export interface GetProvinceParams {
  countryId: string;
  data?: GetCountryParams;
}
