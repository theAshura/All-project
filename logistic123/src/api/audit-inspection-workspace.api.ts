import { requestAuthorized } from 'helpers/request';
import {
  GetAuditInspectionWorkspacesResponse,
  AuditInspectionWorkspaceDetailResponse,
  GetFillChecklistParams,
  UploadResponsive,
  UpdateFillChecklistParams,
  ListAIWFindingSummaryResponse,
  UpdateFindingSummary,
  TriggerFillChecklistParams,
  SubmitWorkspaceParams,
  Remark,
  ListRemarkResponse,
  InspectionWorkSpaceSummaryResponse,
  IUpdateAnalyticalFindingRepeat,
  MasterChiefInspection,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import moment from 'moment';
import {
  ASSETS_API_AUDIT_INSPECTION_WORKSPACE,
  SUPPORT_API_UPLOAD,
  ASSETS_API,
} from './endpoints/config.endpoint';

export const getListAuditInspectionWorkspacesActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAuditInspectionWorkspacesResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}?${params}`,
  );
};

export const getListFindingSummaryActionsApi = (id: string) =>
  requestAuthorized.get<GetAuditInspectionWorkspacesResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}/finding-summary`,
  );

export const getListChecklistActionsApi = (id: string) =>
  requestAuthorized.get<GetAuditInspectionWorkspacesResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}/fill-checklist`,
  );

export const getAuditInspectionWorkspaceDetailActionsApi = (id: string) =>
  requestAuthorized.get<AuditInspectionWorkspaceDetailResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}`,
  );

export const getAuditWorkspaceChecklistDetailActionsApi = (
  dataParams: GetFillChecklistParams,
) => {
  const { workspaceId, fillChecklistId } = dataParams;
  return requestAuthorized.get<AuditInspectionWorkspaceDetailResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${workspaceId}/fill-checklist/${fillChecklistId}`,
  );
};

export const updateAuditWorkspaceChecklistDetailActionsApi = (
  dataParams: UpdateFillChecklistParams,
) => {
  const { workspaceId, fillChecklistId, data } = dataParams;

  return requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${workspaceId}/fill-checklist/${fillChecklistId}`,
    data,
  );
};

export const updateAuditWorkspaceFindingSummaryActionsApi = (
  dataParams: UpdateFindingSummary,
) => {
  const { workspaceId, findingItemId, data } = dataParams;

  return requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${workspaceId}/finding-item/${findingItemId}`,
    data,
  );
};

export const submitAuditWorkspaceChecklistDetailActionsApi = (
  dataParams: UpdateFillChecklistParams,
) => {
  const { workspaceId, fillChecklistId, data } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${workspaceId}/fill-checklist/${fillChecklistId}/submit`,
    data,
  );
};

export const triggerAuditWorkspaceChecklistActionsApi = (
  dataParams: TriggerFillChecklistParams,
) => {
  const { workspaceId, fillChecklistId, data } = dataParams;
  return requestAuthorized.post<void>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${workspaceId}/fill-checklist/${fillChecklistId}/trigger`,
    data,
  );
};

export const pdfFillChecklistActionsApi = (dataParams: {
  workspaceId: string;
  fillChecklistId: string;
}) =>
  requestAuthorized.post<Blob>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${dataParams.workspaceId}/fill-check-list/${dataParams.fillChecklistId}/create-pdf`,
    { timezone: moment.tz.guess() },
    {
      responseType: 'blob',
    },
  );

export const submitAuditWorkspaceActionsApi = (
  dataParams: SubmitWorkspaceParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}/submit`,
    data,
  );
};

export const uploadFileApi = (dataParams: FormData) =>
  requestAuthorized.post<UploadResponsive[]>(SUPPORT_API_UPLOAD, dataParams);

export const getListAIWFindingSummaryApi = (id: string) =>
  requestAuthorized.get<ListAIWFindingSummaryResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}/finding-summary`,
  );

export const downloadAnalysisExcel = (name?: string) =>
  requestAuthorized.get<any>(
    `${SUPPORT_API_UPLOAD}/presigned-url?keys[]=templates/${
      name || 'Analysis Report Template.xlsx'
    }`,
  );

export const downloadAnalysisExcelFillChecklist = (id?: string) =>
  requestAuthorized.get<any>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}/fill-checklist/export`,
    {
      responseType: 'blob',
    },
  );

export const deleteRemarkApi = (dataParams: CommonApiParam) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${dataParams.auditWorkspaceId}/remark/${dataParams.id}`,
  );

export const createRemarkApi = (data: Remark) => {
  const { auditWorkspaceId, ...other } = data;

  return requestAuthorized.post(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${auditWorkspaceId}/remark`,
    other,
  );
};

export const updateRemarkApi = (data: Remark) => {
  const { auditWorkspaceId, id, ...other } = data;

  return requestAuthorized.put(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${auditWorkspaceId}/remark/${id}`,
    other,
  );
};

export const updateMasterChiefApi = (data: MasterChiefInspection) => {
  const { id, ...other } = data;

  return requestAuthorized.put(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}/master-or-chief-of-engineer`,
    other,
  );
};

export const getListRemarkApi = (dataParams: CommonApiParam) =>
  requestAuthorized.get<ListRemarkResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${dataParams.auditWorkspaceId}/remark`,
  );

export const getInspectionWorkspaceSummaryApi = (id: string) =>
  requestAuthorized.get<InspectionWorkSpaceSummaryResponse>(
    `${ASSETS_API_AUDIT_INSPECTION_WORKSPACE}/${id}/summary`,
  );

export const getAnalyticalReportPerformanceApi = (id: string) =>
  requestAuthorized.get<any>(
    `${ASSETS_API}/analytical-report/inspection-performance/${id}`,
  );

export const addAnalyticalReportPerformanceAdjustedApi = (bodyParams: any) => {
  const { id, ...params } = bodyParams;
  return requestAuthorized.post<any>(
    `${ASSETS_API}/analytical-report/${id}`,
    params,
  );
};

export const getAnalyticalReportDetailSubcategoryApi = (id: string) =>
  requestAuthorized.get<any>(
    `${ASSETS_API}/analytical-report/${id}/detail-main-subcategory-wise`,
  );

export const getAnalyticalReportQuestionReportOfFindingApi = (id: string) =>
  requestAuthorized.get<any>(
    `${ASSETS_API}/analytical-report/${id}/question-report-of-finding`,
  );

export const getAnalyticalReportMainSecondCategoryLocationApi = (id: string) =>
  requestAuthorized.get<any>(
    `${ASSETS_API}/analytical-report/${id}/main-second-category-location`,
  );

export const getAnalyticalReportFindingApi = (id: string) =>
  requestAuthorized.get<any>(`${ASSETS_API}/analytical-report-findings/${id}`);

export const getAnalyticalReportRepeatedFindingApi = (id: string) =>
  requestAuthorized.get<any>(
    `${ASSETS_API}/analytical-report/${id}/repeated-finding`,
  );

export const updateAnalyticalReportRepeatedFindingApi = (
  id: string,
  body?: IUpdateAnalyticalFindingRepeat,
) =>
  requestAuthorized.post<any>(
    `${ASSETS_API}/analytical-report/${id}/finding-repeat`,
    body,
  );

export const hideShowAnalyticalReportApi = (
  id: string,
  body?: { showPopupAnalyticalReport?: boolean },
) =>
  requestAuthorized.put<any>(
    `${ASSETS_API}/audit-workspace/${id}/show-popup-analytical-report`,
    body,
  );
