import { ErrorField, CommonApiParam } from 'models/common.model';
import { CommonType, IComment, Risk } from './common.model';

export interface OtherSMSRequests {
  comments?: IComment[];
  OSRRComments?: IComment[];
  id?: string;
  vesselScreeningId?: string;
  otherSmsRecordsId?: string;
  potentialRisk?: number;
  potentialScore?: number;
  observedRisk?: number;
  observedScore?: number;
  timeLoss?: boolean;
}

export interface Inspector {
  id: string;
  firstName: string;
  lastName: string;
}
export interface TechIssueNote {
  id: string;
  name: string;
}
export interface VesselScreeningOtherSMS {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  eventTypeId: string;
  vesselId: string;
  recordDate: Date;
  techIssueNoteId: string;
  pendingAction: string;
  actionRemarks: string;
  actionStatus: string;
  targetCloseDate: Date;
  actualCloseDate: Date;
  closureRemarks: string;
  initialAttachments: any[];
  attachments: any[];
  createdUserId: string;
  updatedUserId?: any;
  companyId: string;
  eventType: CommonType;
  techIssueNote: TechIssueNote;
  otherSmsRecordsRequests: OtherSMSRequests[];
}

export interface GetVesselScreeningOtherSMSResponse {
  data: VesselScreeningOtherSMS[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  risk: Risk[];
}
export interface UpdateOtherSMSRequestParams {
  id: string;
  data: {
    otherSmsRecordsId: string;
    vesselScreeningId: string;
    potentialRisk?: number;
    potentialScore?: number;
    observedRisk?: number;
    observedScore?: number;
    timeLoss?: boolean;
    comments: IComment[];
  };
  handleSuccess?: () => void;
}

export interface VesselOtherSMSStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listOtherSMS: GetVesselScreeningOtherSMSResponse;
  otherSMSRequestDetail: OtherSMSRequests;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
