export interface WatchListParam {
  referenceId: string;
  referenceModuleName: string;
  referenceRefId?: string;
}

export interface GetWatchListDataResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  referenceId: string;
  referenceModuleName: string;
  referenceRefId: string;
}

export interface GetWatchListResponse {
  data: GetWatchListDataResponse[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetCheckWatchListResponse {
  watchList: boolean;
}

export interface MultiCheckWatchListParam {
  watchlistIds: string[];
}
