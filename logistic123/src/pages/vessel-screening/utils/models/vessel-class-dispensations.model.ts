import {
  Risk,
  VesselScreeningTableStoreModel,
} from 'pages/vessel-screening/utils/models/common.model';

export interface VesselScreeningClassDispensations {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType?: {
    name: string;
    code: string;
  };
  issueDate: Date;
  authorityId: string;
  vesselId: string;
  expiryDate: Date;
  remarks: string;
  status: string;
  closedDate: Date;
  closureRemarks: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  authority: {
    name: string;
  };
  vessel: {
    imoNumber: string;
    code: string;
    name: string;
  };
  classDispensationsRequests: any[];
}

export interface GetListVesselScreeningClassDispensations {
  list: {
    data: VesselScreeningClassDispensations[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  risk: Risk[];
}

export interface VesselClassDispensationsStoreModel
  extends VesselScreeningTableStoreModel {
  list: GetListVesselScreeningClassDispensations;
}

export interface UpdateVesselClassDispensationsParams {
  id: string;
  data: {
    ClassDispensationsId: string;
    vesselScreeningId: string;
    potentialRisk: number;
    potentialScore: number;
    observedRisk: number;
    observedScore: number;
    timeLoss: boolean;
  };
  handleSuccess?: () => void;
}
