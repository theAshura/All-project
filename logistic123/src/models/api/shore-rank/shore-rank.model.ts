export interface ShoreRank {
  id?: string;
  code: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  createdUserId?: string;
  updatedUserId?: string;
  createdUser?: { username: string };
  updatedUser?: { username: string };
  shoreDepartmentIds?: string[];
  isNew?: boolean;
  resetForm?: () => void;
  shoreDepartments?: {
    id?: string;
    name?: string;
  }[];
}

export interface ListShoreRankResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<ShoreRank>;
}
export interface UpdateShoreRankParams {
  id: string;
  body: ShoreRank;
}

export interface ParamsListShoreRank {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
}

export interface GetShoreRankParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListShoreRank;
}
