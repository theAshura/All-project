export interface GetListInspectionInspector {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  companyId?: string;
  entityTypes?: string;
  childCompanyIds?: string[];
  fromDate?: string;
  toDate?: string;
  planningType?: string;
  portIds?: string[];
  searchAvailability?: string;
  baseLocation?: string;
  includeServiceArea?: string;
  auditorIds?: string[];
  inspectorIds?: string[];
  countryNames?: string[];
}

export interface MapViewStore {
  loading?: boolean;
  listInspection?: any;
  listInspector?: any;
}

export interface GetMapViewPort {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  companyId?: string;
  childCompanyIds?: string[];
  countryNames?: string[];
}

export interface GetPrAuditors {
  portIds?: string[];
  childCompanyIds?: string[];
  countryNames?: string[];
  content?: string;
  forInspectorMapping?: boolean;
}
export interface GetAuditors {
  childCompanyIds?: string[];
  content?: string;
}
