import { Vessel } from 'models/api/vessel/vessel.model';

export interface Authority {
  name: string;
}

export interface SurveyClassInfo {
  refId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: { name: string; code: string };
  issueDate: Date;
  authorityId: string;
  anyExpiredCertificates: boolean;
  remarks: string;
  anyOpenCOC: boolean;
  cocRemarks: boolean;
  attachments: any[];
  createdUserId: string;
  updatedUserId?: any;
  companyId: string;
  authority: Authority;
  vessel: Vessel;
  vesselId: string;
}

export interface CreateSurveyClassInfoParams {
  eventType: string;
  issueDate: string;
  authorityId: string;
  anyExpiredCertificates: boolean;
  remarks?: string;
  anyOpenCOC: boolean;
  cocRemarks?: string;
  attachments?: string[];
  afterCreate: () => void;
}
export interface UpdateSurveyClassInfoParams {
  body: {
    eventType: string;
    issueDate: string;
    authorityId: string;
    anyExpiredCertificates: boolean;
    remarks?: string;
    anyOpenCOC: boolean;
    cocRemarks?: string;
    attachments?: string[];
  };
  id: string;
  afterUpdate: () => void;
}

export interface GetDetailSurveyClassInfo {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: {
    name: string;
    code: string;
  };
  issueDate: Date;
  authorityId: string;
  anyExpiredCertificates: boolean;
  remarks: string;
  eventTypeId?: string;
  anyOpenCOC: boolean;
  cocRemarks?: any;
  attachments: any[];
  createdUserId: string;
  updatedUserId?: any;
  companyId: string;
  authority: Authority;
  vessel: {
    code: string;
    imoNumber: string;
    name: string;
  };
  vesselId: string;
}
export interface DeleteSurveyClassInfoParams {
  id: string;
  afterDelete: () => void;
}

export interface GetSurveyClassInfoResponse {
  data: SurveyClassInfo[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  type?: string;
}
export interface GetSurveyClassInfoParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}
