import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetAuditInspectionWorkspacesResponse,
  AuditInspectionWorkspaceDetailResponse,
  AuditInspectionChecklistResponse,
  FillChecklist,
  ListRemarkResponse,
  ListAIWFindingSummaryResponse,
  InspectionWorkSpaceSummaryResponse,
} from '../../api/audit-inspection-workspace/audit-inspection-workspace.model';

export interface AuditInspectionWorkspaceStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listAuditInspectionWorkspaces: GetAuditInspectionWorkspacesResponse;
  fillQuestionDetail: FillChecklist[];
  listChecklist: AuditInspectionChecklistResponse[];
  listSummary: ListAIWFindingSummaryResponse;
  auditInspectionWorkspaceDetail: AuditInspectionWorkspaceDetailResponse;
  errorList: ErrorField[];
  listRemark: ListRemarkResponse;
  dataFilter: CommonApiParam;
  inspectionSummary: InspectionWorkSpaceSummaryResponse;
  analyticalReportInspection: any;
  detailMainSubcategoryWise: any;
}
