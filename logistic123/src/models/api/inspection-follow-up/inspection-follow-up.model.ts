import { CompanyObject } from 'models/common.model';
import { Vessel } from 'models/api/vessel/vessel.model';
import { Department } from '../planning-and-request/planning-and-request.model';

export interface InspectionFollowUp {
  id: string;
  refNo: string;
  createdAt: string;
  rofPlanningRequest: {
    reportFindingFormId: string;
    planningRequestId: string;
    vesselId: string;
    vesselName: string;
    countryFlag: string;
    vesselTypeId: string;
    vesselTypeName: string;
    fleetId: string;
    fleetName: string;
    departments: Department[];
    departmentId: null;
    auditCompanyName: null;
    auditCompanyId: null;
    fromPortId: string;
    fromPortName: string;
    toPortId: string;
    toPortName: string;
  };
  followUp: {
    status: string;
    refId: string;
    followUpComments: string[];
    createdAt: string;
  };
  company?: CompanyObject;
  companyId?: string;
  planningRequest: {
    id: string;
    refId: string;
    auditNo: string;
    plannedFromDate: string;
    plannedToDate: string;
    globalStatus: string;
    memo: string;
  };
  rofUsers: {
    id: string;
    reportFindingFormId: string;
    userId: string;
    username: string;
    relationship: string;
  }[];
  rofAuditTypes: {
    auditTypeId: string;
    auditTypeName: string;
    id: string;
    reportFindingFormId: string;
  }[];
  totalCars: number;
  totalCloseCars: number;
  totalOpenCars: number;
  acceptCaps: number;
  deniedCaps: number;
  vessel: Vessel;
}

export interface UpdateInspectionFollowUp {
  id?: string;
  comments: string[];
}

export interface InspectionFollowUpResponse {
  data: InspectionFollowUp[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
