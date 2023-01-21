import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import { FindingItemPrevious } from 'models/api/report-of-finding/report-of-finding.model';
import {
  StaticFindingItems,
  StaticFindingItemManual,
  GetInternalAuditReportsResponse,
  InternalAuditReportDetailResponse,
  UpdateInternalAuditReportParams,
  SchedulerROFStatusParams,
  GetSchedulerROFStatusResponse,
  AssignPICInternalAuditReportParams,
  Observation,
  EditFindingItemParams,
  ReviewFindingItemParams,
  PreviousInternalAuditReport,
  getListFindingItemsOfIARResponse,
} from 'models/api/internal-audit-report/internal-audit-report.model';
import {
  InspectionFollowUp,
  UpdateInspectionFollowUp,
} from 'models/api/inspection-follow-up/inspection-follow-up.model';
import queryString from 'query-string';
import {
  ASSETS_API_INTERNAL_AUDIT_REPORT,
  ASSETS_API_REPORT_OF_FINDING,
  ASSETS_API_REPORT_OF_FINDING_ITEM,
  ASSETS_API_INSPECTION_FOLLOW_UP,
  ASSETS_API_FILL_AUDIT_CHECKLIST,
} from './endpoints/config.endpoint';

export const getListInternalAuditReportsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInternalAuditReportsResponse>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}?${params}`,
  );
};

export const getListPreviousInternalAuditReportsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify({ ...dataParams, id: undefined });
  return requestAuthorized.get<PreviousInternalAuditReport[]>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/previous?${params}`,
  );
};

export const deleteInternalAuditReportActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams}`,
  );

export const getInternalAuditReportDetailActionsApi = (id: string) =>
  requestAuthorized.get<InternalAuditReportDetailResponse>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${id}`,
  );

export const updateInternalAuditReportPermissionDetailActionsApi = (
  dataParams: UpdateInternalAuditReportParams,
) => {
  const isSubmitted = queryString.stringify({
    isSubmitted: dataParams.isSubmitted,
  });
  return requestAuthorized.put<void>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}?${isSubmitted}`,
    dataParams.data,
  );
};

export const verifyIARItem = (data: {
  planningRequestId: string;
  internalAuditReportId: string;
  iarItemIds: string[];
}) =>
  requestAuthorized.post(
    `${ASSETS_API_REPORT_OF_FINDING_ITEM}/verify-iar-items`,
    data,
  );

export const updateInternalAuditReportReviewActionsApi = (
  dataParams: UpdateInternalAuditReportParams,
) => {
  const params = queryString.stringify({
    isReviewed: dataParams.isReviewed ? dataParams.isReviewed : undefined,
    isReassigned: dataParams.isReassigned ? dataParams.isReassigned : undefined,
  });
  return requestAuthorized.post<void>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/review?${params}`,
    dataParams.data,
  );
};

export const updateInternalAuditReportApproveActionsApi = (
  dataParams: UpdateInternalAuditReportParams,
) => {
  const params = queryString.stringify({
    isApproved: dataParams.isApproved ? dataParams.isApproved : undefined,
    isReassigned: dataParams.isReassigned ? dataParams.isReassigned : undefined,
  });
  return requestAuthorized.post<void>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/approve?${params}`,
    dataParams.data,
  );
};

export const assignPICInternalAuditReportActionsApi = (
  dataParams: AssignPICInternalAuditReportParams,
) =>
  requestAuthorized.put(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/finding-item/${dataParams.findingItemId}/pic`,
    dataParams.data,
  );

export const getListFindingItemsOfIAR = (dataParams: CommonApiParam) => {
  const params = queryString.stringify({ ...dataParams, id: undefined });
  return requestAuthorized.get<getListFindingItemsOfIARResponse>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/finding-items?${params}`,
  );
};

export const editFindingItemActionsByPicApi = (
  dataParams: EditFindingItemParams,
) =>
  requestAuthorized.put(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/finding-item/${dataParams.findingItemId}/for-pic`,
    dataParams.data,
  );

export const editFindingItemActionsApi = (dataParams: EditFindingItemParams) =>
  requestAuthorized.put(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/finding-item/${dataParams.findingItemId}`,
    dataParams.data,
  );

export const reviewFindingItemActionsApi = (
  dataParams: ReviewFindingItemParams,
) =>
  requestAuthorized.put(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/finding-item/${dataParams.findingItemId}/review`,
    dataParams.data,
  );

export const updateInternalAuditReportCloseoutActionsApi = (
  dataParams: UpdateInternalAuditReportParams,
) => {
  const params = queryString.stringify({
    isCloseout: dataParams.isCloseout ? dataParams.isCloseout : undefined,
    isReassigned: dataParams.isReassigned ? dataParams.isReassigned : undefined,
  });
  requestAuthorized.post<void>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${dataParams.id}/closeout?${params}`,
    dataParams.data,
  );
};

export const getSchedulerROFStatusApi = (
  dataParams: SchedulerROFStatusParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetSchedulerROFStatusResponse>(
    `${ASSETS_API_REPORT_OF_FINDING}?${params}`,
  );
};

export const getListPreviousFindingItemActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<FindingItemPrevious[]>(
    `${ASSETS_API_REPORT_OF_FINDING_ITEM}/previous-finding-item?${params}`,
  );
};

export const getListCurrentFindingItemActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<Observation[]>(
    `${ASSETS_API_REPORT_OF_FINDING_ITEM}/current-item?${params}`,
  );
};

export const getListStaticFindingItemActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<StaticFindingItems[]>(
    `${ASSETS_API_REPORT_OF_FINDING_ITEM}/statistic-previous-finding-item?${params}`,
  );
};

export const getListStaticFindingItemManualActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<{ data: StaticFindingItemManual[] }>(
    `${ASSETS_API_FILL_AUDIT_CHECKLIST}/statistic-previous-finding-items?${params}`,
  );
};

export const getDetailStaticFindingItemActionsApi = (id: string) =>
  requestAuthorized.get<StaticFindingItemManual>(
    `${ASSETS_API_FILL_AUDIT_CHECKLIST}/statistic-previous-finding-items/${id}`,
  );

export const createStaticFindingItemManualActionsApi = (params) =>
  requestAuthorized.post<Blob>(
    `${ASSETS_API_FILL_AUDIT_CHECKLIST}/statistic-previous-finding-items`,
    params,
  );

export const updateStaticFindingItemManualActionsApi = (params) => {
  const { internalAuditReportId, id, ...bodyParams } = params;
  return requestAuthorized.put<Blob>(
    `${ASSETS_API_FILL_AUDIT_CHECKLIST}/statistic-previous-finding-items/${id}`,
    bodyParams,
  );
};

export const getDetailPdfInternalAuditReport = (
  id: string,
  params: { name?: string; printOption?: string; timezone?: any },
) =>
  requestAuthorized.post<Blob>(
    `${ASSETS_API_INTERNAL_AUDIT_REPORT}/${id}/create-pdf`,
    params,
    {
      responseType: 'blob',
    },
  );

export const getListInspectionFollowUpApiRequest = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInternalAuditReportsResponse>(
    `${ASSETS_API_INSPECTION_FOLLOW_UP}?${params}`,
  );
};

export const getInspectionFollowUpDetailApiRequest = (id: string) =>
  requestAuthorized.get<InspectionFollowUp>(
    `${ASSETS_API_INSPECTION_FOLLOW_UP}/${id}`,
  );

export const updateInspectionFollowUpDetailApiRequest = (
  data: UpdateInspectionFollowUp,
) => {
  const { id, ...params } = data;
  return requestAuthorized.put<void>(
    `${ASSETS_API_INSPECTION_FOLLOW_UP}/${id}`,
    params,
  );
};
