import { ErrorField } from 'models/common.model';

export interface Vessel {
  imoNumber: string;
  code: string;
  name: string;
}
export interface PlanningAndDrawings {
  isNew?: boolean;
  resetForm?: () => void;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vesselId: string;
  nameOfPlanning: string;
  nameOfDrawing: string;
  remarks?: any;
  attachments: any[];
  companyId: string;
  createdUserId: string;
  updatedUserId?: any;
  planingDrawingRequests: any[];
  vessel: Vessel;
}

export interface PlanningAndDrawingsMaster {
  id: string;
  code: string;
  name: string;
  lti: boolean;
}

export interface PlanningAndDrawingsBody {
  id: string;
  code: string;
  name: string;
}

export interface CreatePlanningAndDrawingsParams {
  plansDrawingsId: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface List {
  data: PlanningAndDrawings[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface Risk {
  risk?: any;
  count: string;
}

export interface GetPlanningAndDrawingsResponse {
  list: List;
  risk: Risk[];
}

export interface GetPlanningAndDrawingsMasterResponse {
  data: PlanningAndDrawingsMaster[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetPlanningAndDrawingsBodyResponse {
  data: PlanningAndDrawingsBody[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface UpdatePlanningAndDrawingsParams {
  id: string;
  data: CreatePlanningAndDrawingsParams;
  resetForm?: () => void;
  afterUpdate?: () => void;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}

export interface PlanningAndDrawingsDetailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  injuryMasterId: string;
  lostTime: string;
  eventTitle: string;
  injuryDate: string;
  departmentId: string;
  locationId: string;
  causes: string;
  countermeasures: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: null;
  companyId: string;
  injuryMaster: {
    id: string;
    code: string;
    name: string;
    lti: boolean;
  };
  department: {
    id: string;
    code: string;
    name: string;
  };
  location: {
    id: string;
    code: string;
    name: string;
  };
  injuredBodyPart: {
    name: string;
    code: string;
    id: string;
  };
  vessel: {
    code: string;
    imoNumber: string;
    name: string;
  };
  vesselId: string;
}
