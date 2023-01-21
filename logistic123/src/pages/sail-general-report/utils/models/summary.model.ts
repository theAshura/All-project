import { ErrorField } from 'models/common.model';

export interface FeedbackAndRemark {
  id: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
  createdUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
  updatedUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
  vesselScreeningId: string;
}

export interface FeedbackAndRemarksResponse {
  data: FeedbackAndRemark[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface FeedbackAndRemarksCreateParams {
  vesselId: string;
  remark: string;
  handleSuccess?: () => void;
}

export interface FeedbackAndRemarksUpdateParams {
  vesselId: string;
  id?: string;
  remark: string;
  handleSuccess?: () => void;
}

export interface ReviewStatusUpdateParams {
  vesselScreeningId: string;
  tabName: string;
  reviewStatus: string;
  handleSuccess?: () => void;
}

export interface FeedbackAndRemarkDeleteParams {
  vesselId: string;
  remarkId: string;
  handleSuccess?: () => void;
}

export interface AttachmentAndRemark {
  id: string;
  remark: string;
  attachments: string[];
  tabName: string;
  createdAt: string;
  updatedAt: string;
  createdUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
  updatedUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
  vesselScreeningId: string;
}

export interface AttachmentsAndRemarksResponse {
  data: AttachmentAndRemark[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface AttachmentAndRemarkCreateParams {
  vesselScreeningId: string;
  tabName: string;
  attachments?: string[];
  remark?: string;
  handleSuccess?: () => void;
}

export interface AttachmentAndRemarksUpdateParams {
  vesselScreeningId: string;
  recordId: string;
  tabName: string;
  attachments?: string[];
  remark?: string;
  isDelete?: boolean;
  handleSuccess?: () => void;
}

export interface AttachmentAndRemarkDeleteParams {
  vesselScreeningId: string;
  recordId: string;
  handleSuccess?: () => void;
}

export interface VesselSummaryObject {
  id: string;
  observedRisk: string | null;
  observedScore: number | null;
  potentialRisk: string | null;
  potentialScore: number | null;
  reference: string;
  status: string;
  tabName: string;
  timeLoss: string | null;
  vesselScreeningId: string;
  reviewStatus: string;
}

export interface ByUser {
  id: string;
  username: string;
  jobTitle: string;
  email: string;
}

export interface RemarkSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  remark: string;
  tabName: string;
  vesselScreeningId: string;
  createdUser: ByUser;
  updatedUser?: ByUser;
}

export interface Attachment {
  id: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  remark?: RemarkSummary;
  tabName: string;
  vesselScreeningId: string;
  createdUser: ByUser;
  updatedUser?: ByUser;
}

export interface RiskAndReview {
  id: string;
  observedRisk: number | null;
  observedScore: number | null;
  potentialRisk: number | null;
  potentialScore: number | null;
  reference: string;
  status: string;
  tabName: string;
  timeLoss: boolean | null;
  vesselScreeningId: string;
}

export interface SummaryByTabResponse {
  riskAndReview: RiskAndReview[];
  attachment: Attachment;
  remarks: RemarkSummary[];
}

export interface VesselSummaryUpdateParams {
  vesselId: string;
  status?: string;
  reference?: string;
  tabName?: string;
  potentialRisk?: number;
  potentialScore?: number;
  observedRisk?: number;
  observedScore?: number;
  timeLoss?: boolean;
  handleSuccess?: () => void;
}

export interface AttachmentAndRemarkGetListParams {
  vesselId: string;
  tabName: string;
  pageSize?: number;
  attachments?: string[];
  remark?: string;
}
export interface WebServicesGetListParams {
  vesselScreeningId: string;
  tabName: string;
  pageSize?: number;
}

export interface VesselSummaryParams {
  vesselId: string;
  reference: string;
  handleSuccess?: () => void;
}

export interface VesselSummaryRiskAnalysisParams {
  vesselScreeningId: string;
  handleSuccess?: () => void;
}

export interface WebService {
  id: string;
  url: string;
  webName: string;
  tabName: string;
  createdAt: string;
  updatedAt: string;
  createdUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
  updatedUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
  vesselScreeningId: string;
}

export interface WebServicesResponse {
  data: WebService[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface WebServicesCreateParams {
  vesselScreeningId: string;
  tabName: string;
  webName: string;
  url: string;
  handleSuccess?: () => void;
}

export interface WebServicesUpdateParams {
  vesselScreeningId: string;
  webServiceId: string;
  tabName: string;
  webName: string;
  url: string;
  handleSuccess?: () => void;
}
export interface WebServicesDeleteParams {
  vesselScreeningId: string;
  webServiceId: string;
  handleSuccess?: () => void;
}

export interface GetSummaryByTabParams {
  vesselScreeningId: string;
  tabName: string;
}

export interface VesselSummaryStoreModel {
  loading: boolean;
  listRemarks: FeedbackAndRemarksResponse;
  listAttachmentAndRemark: AttachmentsAndRemarksResponse;
  listWebServices: WebServicesResponse;
  summaryByTab: SummaryByTabResponse;
  summary: {
    [objectRef: string]: VesselSummaryObject;
  };
  errorList: ErrorField[];
}

export interface VesselSummaryResponse extends VesselSummaryObject {}

export interface VesselSummaryRiskAnalysis {
  id: string;
  observedRisk: number | null;
  observedScore: number | null;
  potentialRisk: number | null;
  potentialScore: number | null;
  reference: string;
  reviewStatus: string | null;
  status: string;
  tabName: string;
  timeLoss: boolean | null;
  vesselScreeningId: string;
}

export interface VesselSummaryRiskAnalysisResponse {
  tabName: string;
  data: VesselSummaryRiskAnalysis[];
}
