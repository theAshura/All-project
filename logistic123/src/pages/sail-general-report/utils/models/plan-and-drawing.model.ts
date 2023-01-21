import { ErrorField, CommonApiParam } from 'models/common.model';
import { Risk, IComment } from './common.model';

export interface PlanAndDrawingRequests {
  PDRComments: IComment[];
  comments?: IComment[];
  id?: string;
  vesselScreeningId: string;
  plansDrawingsId: string;
}

export interface Inspector {
  id: string;
  firstName: string;
  lastName: string;
}
export interface ByUser {
  username: string;
}

export interface VesselScreeningPlanAndDrawing {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  nameOfPlanning: string;
  nameOfDrawing: string;
  remarks: string;
  attachments: string[];
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: ByUser;
  updatedUser: ByUser;
  vessel: {
    code: string;
    imoNumber: string;
    name: string;
  };
  vesselId: string;
  planingDrawingRequests: PlanAndDrawingRequests[];
}

export interface GetVesselPlanAndDrawingsResponse {
  data: VesselScreeningPlanAndDrawing[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  risk: Risk[];
}
export interface UpdatePlanAndDrawingsRequestParams {
  id: string;
  data: {
    plansDrawingsId: string;
    vesselScreeningId: string;
    comments: IComment[];
  };
  handleSuccess?: () => void;
}

export interface VesselPlanAndDrawingStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listPlanAndDrawings: GetVesselPlanAndDrawingsResponse;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
