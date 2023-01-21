export interface ActivityDataResponse {
  createdAt: string;
  currentStatus: string;
  executedAt: string;
  extendData: string;
  id: string;
  isRead: boolean;
  module: string;
  performerId: string;
  performerJobTitle: string;
  performerName: string;
  previousStatus: string;
  receiverId: string;
  receiverJobTitle: string;
  receiverName: string;
  recordId: string;
  recordRef: string;
  type: string;
  updatedAt: string;
}

export interface GetListActivityResponse {
  data: ActivityDataResponse[];
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
}

export interface GetAnalysisSectionResponse {
  numberOfWatchList: string;
  numberOfOpenActionable: string;
  numberOfOverdueActionable: string;
  numberOfNewYetToStart: string;
  numberOfOpenRecords: string;
  numberOfOverdueRecords: string;
  numberOfVSHighObservedRisk: string;
  numberOfVSHighPotentialRisk: string;
}

export interface RemarkParam {
  remark?: string;
  id?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  createdDate?: string;
}

export interface GetRemarksByDateDataResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
  sNo: number;
  remark: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: {
    username: string;
  };
  updatedUser: {
    username: string;
  };
}

export interface GetRemarksByDateResponse {
  data: GetRemarksByDateDataResponse[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
