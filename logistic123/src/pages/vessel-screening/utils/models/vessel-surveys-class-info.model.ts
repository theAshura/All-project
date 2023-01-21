import { VesselScreeningTableStoreModel, Risk, IComment } from './common.model';

export interface VesselScreeningSurveyClassInfoRequests {
  SCRComments: IComment[];
  id?: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  externalInspectionsId: string;
  surveyClassInfoId?: string;
}

export interface VesselScreeningSurveyClassInfo {
  anyExpiredCertificates: boolean;
  anyOpenCOC: boolean;
  attachments: string[];
  authorityId: string;
  authority: {
    name: string;
  };
  cocRemarks: any;
  companyId: string;
  createdAt: Date | string;
  createdUserId: string;
  eventType: {
    name: string;
    code: string;
  };
  id: string;
  issueDate: Date | string;
  remarks: any;
  surveyClassInfoRequests: VesselScreeningSurveyClassInfoRequests[];
  updatedAt: Date | string;
  updatedUserId: string;
  vesselId: string;
}

export interface GetListVesselScreeningSurveysClassInfo {
  list: {
    data: VesselScreeningSurveyClassInfo[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  risk: Risk[];
}

export interface VesselSurveysClassInfoStoreModel
  extends VesselScreeningTableStoreModel {
  list: GetListVesselScreeningSurveysClassInfo;
}

export interface UpdateVesselSurveysClassInfoParams {
  id: string;
  data: {
    surveyClassInfoId: string;
    vesselScreeningId: string;
    potentialRisk: number;
    potentialScore: number;
    observedRisk: number;
    observedScore: number;
    timeLoss: boolean;
  };
  handleSuccess?: () => void;
}
