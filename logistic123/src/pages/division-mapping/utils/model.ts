export interface GetListDivision {
  page?: number;
  pageSize?: number;
}

export interface DivisionMappingStore {
  loading?: boolean;
  listDivision?: any;
  params?: any;
  errorList?: any;
}

export interface CreateDivisionMapping {
  divisionId: string;
  vesselIds: string[];
}
