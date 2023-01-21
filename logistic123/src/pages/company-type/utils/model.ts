export interface CompanyTypeBody {
  id?: string;
  industry?: string;
  industryCode: string;
  companyType: string;
  actors: string[];
  status: string;
}

export interface CompanyType {
  id: string;
  createdAt: string;
  updatedAt: string;
  industry: string;
  industryCode: string;
  companyType: string;
  isDefault: boolean;
  actors: string[];
  status: string;
  lastUpdatedById?: string;
}

export interface ResponsesCompanyType {
  data: CompanyType[];
  page: string;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface CompanyTypeStore {
  loading: boolean;
  listData: ResponsesCompanyType;
  params: any;
  errorList: any;
}
