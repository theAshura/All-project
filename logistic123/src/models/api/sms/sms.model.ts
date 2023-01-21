import { ErrorField } from 'models/common.model';
import { VesselCharterers, Vessel, VesselOwners } from '../vessel/vessel.model';

export interface EventType {
  id: string;
  name: string;
}

export interface TechIssueNote {
  id: string;
  name: string;
}
export interface Sms {
  refId: string;
  id: string;
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
  otherSmsRecordsRequests: any[];
  eventType: EventType;
  techIssueNote: TechIssueNote;
  isNew?: boolean;
  resetForm?: () => void;
  sno?: string;
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  vesselDocHolders?: VesselOwners[];
  vessel?: Vessel;
}

export interface CreateSmsParams {
  eventTypeId: string;
  recordDate: string;
  techIssueNoteId: string;
  pendingAction: string;
  actionRemarks: string;
  targetCloseDate: string;
  actionStatus: string;
  actualCloseDate: string;
  closureRemarks: string;
  attachments: string[];
  initialAttachments: string[];
  resetForm?: () => void;
  afterCreate?: () => void;
}
export interface List {
  data: Sms[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface Risk {
  risk?: any;
  count: string;
}

export interface GetSmsResponse {
  list: List;
  risk: Risk[];
}

export interface UpdateSmsParams {
  id: string;
  data: CreateSmsParams;
  resetForm?: () => void;
  afterUpdate?: () => void;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}

export interface SmsDetailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventTypeId: string;
  recordDate: string;
  techIssueNoteId: string;
  pendingAction: string;
  actionRemarks: string;
  actionStatus: string;
  targetCloseDate: string;
  actualCloseDate: string;
  closureRemarks: string;
  initialAttachments: string[];
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  eventType: {
    code: string;
    name: string;
  };
  techIssueNote: {
    name: string;
  };
  vessel: {
    code: string;
    imoNumber: string;
    name: string;
  };
  vesselId: string;
}
