export interface GetListDivision {
  page?: number;
  pageSize?: number;
}

export interface DivisionStore {
  loading?: boolean;
  listDivision?: any;
  params?: any;
  errorList?: any;
}
