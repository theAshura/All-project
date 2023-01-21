export interface Group {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  description: string;
  numCompanies: number;
}

export interface GetCompanyDetail {
  id?: string;
  afterCreate?: () => void;
}
export interface CompanyManagement {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  groupId?: string;
  country?: string;
  stateOrProvince?: string;
  townOrCity?: string;
  address?: string;
  phone?: string;
  logo?: string;
  fax?: string;
  email?: string;
  createdBy?: string;
  parentId?: any;
  companyIMO?: string;
  group: Group;
  firstName: string;
  lastName: string;
  numVessels?: number;
  companyLevel?: string;
}

export interface ListCompanyManagementResponse {
  page?: number;
  pageSize?: number;
  totalPage?: number;
  totalItem?: number;
  data?: Array<CompanyManagement>;
}
export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  groupId?: string;
  status?: string;
  sort?: string;
}
export interface GetCompanyManagementParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface GetCompanysParams {
  page?: number;
  content?: string;
  pageSize?: number;
  status?: string;
  type?: string;
}
