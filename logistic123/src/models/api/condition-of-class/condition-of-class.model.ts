import { ErrorField } from 'models/common.model';
import { VesselCharterers, VesselOwners } from '../vessel/vessel.model';

export interface ByUser {
  username: string;
}
export interface Authority {
  name: string;
}

export interface Vessel {
  imoNumber: string;
  code: string;
  name: string;
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  vesselDocHolders?: VesselOwners[];
}

export interface ConditionOfClass {
  refId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: {
    code: string;
    name: string;
  };
  issueDate: Date;
  authorityId: string;
  vesselId: string;
  expiryDate: Date;
  remarks: string;
  status: string;
  closedDate: Date;
  closureRemarks: string;
  eventTypeId?: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  authority: Authority;
  vessel: Vessel;
  isNew?: boolean;
  resetForm?: () => void;
  no?: string;
}

export interface CreateConditionClassDispensationsParams {
  classDispensationsId: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface GetConditionOfClassResponse {
  data: ConditionOfClass[];
  page: number;
  pageSize: number;
  totalPage?: number;
  totalItem: number;
}

export interface UpdateConditionOfClassParams {
  id: string;
  vesselScreeningId?: string;
  data: CreateConditionClassDispensationsParams;
  resetForm?: () => void;
  afterUpdate?: () => void;
}

export interface IncidentTypeDetailResponse {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  company: { name: string };
  createdAt: Date | string;
  updatedAt: Date | string;
  description: string;
  createdBy?: string;
  updatedBy?: string | null;
  createdUser?: { username: string };
  updatedUser?: { username: string };
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}

export interface ConditionOfClassDetailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventType: {
    code: string;
    name: string;
  };
  issueDate: string;
  authorityId: string;
  expiryDate: string;
  remarks: string;
  status: string;
  eventTypeId?: string;
  closedDate: string;
  closureRemarks: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  authority: {
    name: string;
  };
  vessel: {
    code: string;
    imoNumber: string;
    name: string;
  };
  vesselId: string;
}

// incident
export interface Remark {
  remark: string;
}
