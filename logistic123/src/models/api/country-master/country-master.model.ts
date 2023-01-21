import { CommonApiParam, ErrorList } from 'models/common.model';

export interface ListCountryMasterData {
  id: number;
  code: string;
  code3: string;
  name: string;
  nationality: string;
  dialCode: string;
  flagImg: string;
  status: string;
  avatar: any;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListCountryMasterResponse {
  data: ListCountryMasterData[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface CountryMasterStoreModel {
  errorList: ErrorList[];
  loading: boolean;
  params: CommonApiParam;
  listCountryMaster: ListCountryMasterResponse;
  countryMasterDetail: ListCountryMasterData;
}

export interface CountryMasterCreationBody {
  code: string;
  code3: string;
  name: string;
  nationality: string;
  dialCode?: string;
  status?: string;
  avatar?: string;
}
