import {
  ListAuditLogResponse,
  ListPlanningAndRequestResponse,
  PlanningAndRequest,
} from 'models/api/planning-and-request/planning-and-request.model';
import { CommonApiParam, ErrorField, AvatarType } from '../../common.model';

export interface PlanningAndRequestStore {
  loading: boolean;
  disable: boolean;
  listPlanningAndRequest: ListPlanningAndRequestResponse;
  listPlanningCompleted: ListPlanningAndRequestResponse;
  listPlanningUnplanned: ListPlanningAndRequestResponse;
  listParByAuditors: any;
  PlanningAndRequestDetail: PlanningAndRequest;
  errorList: ErrorField[];
  params: CommonApiParam;
  uploadFile?: AvatarType;

  dataFilter: CommonApiParam;
  dataFilterCompleted: CommonApiParam;
  dataFilterUnplanned: CommonApiParam;
  totalUnplannedPlanning: number;
  tab: string;
  planningAuditLog?: ListAuditLogResponse;
}
