import { Vessel } from 'models/api/vessel/vessel.model';

export interface EventType {
  code: string;
  name: string;
}

export interface TechIssueNote {
  name: string;
}

export interface OtherTechnicalRecords {
  refId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventTypeId: string;
  recordDate: Date;
  techIssueNoteId: string;
  pendingAction: string;
  actionRemarks: string;
  actionStatus: string;
  targetCloseDate: Date;
  actualCloseDate: Date;
  closureRemarks: string;
  initialAttachments: string[];
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  eventType: EventType;
  techIssueNote: TechIssueNote;
  vessel: Vessel;
  vesselId: string;
}

export interface CreateOtherTechnicalRecordsParams {
  eventTypeId: string;
  recordDate: Date;
  techIssueNoteId: string;
  pendingAction: string;
  actionRemarks: string;
  targetCloseDate: Date;
  actionStatus: string;
  actualCloseDate: Date;
  closureRemarks: string;
  initialAttachments: string[];
  attachments: string[];
  handleSuccess: () => void;
}
export interface UpdateOtherTechnicalRecordsParams {
  body: CreateOtherTechnicalRecordsParams;
  id: string;
  handleSuccess: () => void;
}

export interface GetDetailOtherTechnicalRecords {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventTypeId: string;
  recordDate: Date;
  techIssueNoteId: string;
  pendingAction: string;
  actionRemarks: string;
  actionStatus: string;
  targetCloseDate: Date;
  actualCloseDate: Date;
  closureRemarks: string;
  initialAttachments: string[];
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  eventType: EventType;
  techIssueNote: TechIssueNote;
}
export interface DeleteOtherTechnicalRecordsParams {
  id: string;
  handleSuccess: () => void;
}

export interface GetOtherTechnicalRecordsResponse {
  data: OtherTechnicalRecords[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
