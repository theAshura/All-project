import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  ASSETS_API_VESSEL_SCREENING,
  ASSETS_API_VESSEL_SCREENING_SUMMARY,
} from 'api/endpoints/config.endpoint';
import { CommonApiParam } from 'models/common.model';
import {
  AttachmentsAndRemarksResponse,
  VesselSummaryUpdateParams,
  VesselSummaryParams,
  VesselSummaryResponse,
  AttachmentAndRemarkGetListParams,
  AttachmentAndRemarkCreateParams,
  AttachmentAndRemarksUpdateParams,
  AttachmentAndRemarkDeleteParams,
  FeedbackAndRemarksResponse,
  FeedbackAndRemarksCreateParams,
  FeedbackAndRemarksUpdateParams,
  FeedbackAndRemarkDeleteParams,
  GetSummaryByTabParams,
  SummaryByTabResponse,
  WebServicesGetListParams,
  WebServicesResponse,
  WebServicesCreateParams,
  WebServicesUpdateParams,
  WebServicesDeleteParams,
  ReviewStatusUpdateParams,
  VesselSummaryRiskAnalysisParams,
  VesselSummaryRiskAnalysisResponse,
} from '../models/summary.model';

export const getListVesselFeedbackAndRemarkActionsApi = (
  dataParams: CommonApiParam,
) => {
  const { id, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<FeedbackAndRemarksResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/list-remark?${params}`,
  );
};

export const createVesselFeedbackAndRemarkActionsApi = (
  dataParams: FeedbackAndRemarksCreateParams,
) => {
  const { vesselId, ...other } = dataParams;
  return requestAuthorized.post<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselId}/remark`,
    other,
  );
};

export const updateVesselFeedbackAndRemarkActionsApi = (
  dataParams: FeedbackAndRemarksUpdateParams,
) => {
  const { vesselId, id, ...other } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselId}/remark/${id}`,
    other,
  );
};

export const deleteFeedbackAndRemarkActionsApi = (
  dataParams: FeedbackAndRemarkDeleteParams,
) => {
  const { vesselId, remarkId } = dataParams;
  return requestAuthorized.delete<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselId}/remark/${remarkId}`,
  );
};

export const getListSummaryAttachmentsAndRemarksActionsApi = (
  dataParams: AttachmentAndRemarkGetListParams,
) => {
  const { vesselId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<AttachmentsAndRemarksResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselId}/list-summary-attachment-remark?${params}`,
  );
};

export const createSummaryAttachmentAndRemarkActionsApi = (
  dataParams: AttachmentAndRemarkCreateParams,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  return requestAuthorized.post<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/summary-attachment-remark`,
    other,
  );
};

export const updateSummaryAttachmentAndRemarkActionsApi = (
  dataParams: AttachmentAndRemarksUpdateParams,
) => {
  const { vesselScreeningId, recordId, ...other } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/summary-attachment-remark/${recordId}`,
    other,
  );
};

export const deleteSummaryAttachmentAndRemarkActionsApi = (
  dataParams: AttachmentAndRemarkDeleteParams,
) => {
  const { vesselScreeningId, recordId } = dataParams;
  return requestAuthorized.delete<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/summary-attachment-remark/${recordId}`,
  );
};

export const updateVesselSummaryActionsApi = (
  dataParams: VesselSummaryUpdateParams,
) => {
  const { vesselId, handleSuccess, ...data } = dataParams;
  return requestAuthorized.post<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselId}/summary`,
    data,
  );
};

export const getVesselSummaryActionsApi = (dataParams: VesselSummaryParams) => {
  const { vesselId, handleSuccess, ...others } = dataParams;
  const params = queryString.stringify(others);
  return requestAuthorized.get<VesselSummaryResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselId}/summary?${params}`,
  );
};

export const getVesselSummaryByTabActionsApi = (
  dataParams: GetSummaryByTabParams,
) => {
  const { vesselScreeningId, tabName } = dataParams;
  const params = queryString.stringify({ tabName });
  return requestAuthorized.get<SummaryByTabResponse>(
    `${ASSETS_API_VESSEL_SCREENING_SUMMARY}/${vesselScreeningId}/by-tab?${params}`,
  );
};

export const getListSummaryWebServicesActionsApi = (
  dataParams: WebServicesGetListParams,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<WebServicesResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/list-summary-web-service?${params}`,
  );
};

export const createSummaryWebServicesActionsApi = (
  dataParams: WebServicesCreateParams,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  return requestAuthorized.post<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/summary-web-service`,
    other,
  );
};

export const updateSummaryWebServicesActionsApi = (
  dataParams: WebServicesUpdateParams,
) => {
  const { vesselScreeningId, webServiceId, ...other } = dataParams;
  return requestAuthorized.put<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/summary-web-service/${webServiceId}`,
    other,
  );
};

export const deleteSummaryWebServicesActionsApi = (
  dataParams: WebServicesDeleteParams,
) => {
  const { vesselScreeningId, webServiceId } = dataParams;
  return requestAuthorized.delete<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/summary-web-service/${webServiceId}`,
  );
};

export const updateVesselScreeningReviewStatusApi = (
  dataParams: ReviewStatusUpdateParams,
) => {
  const { vesselScreeningId, tabName, reviewStatus } = dataParams;
  const requestBody = { tabName, reviewStatus };
  return requestAuthorized.post<void>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/summary/review-status`,
    requestBody,
  );
};

export const getVesselSummaryRiskAnalysisApi = (
  dataParams: VesselSummaryRiskAnalysisParams,
) =>
  requestAuthorized.get<VesselSummaryRiskAnalysisResponse[]>(
    `${ASSETS_API_VESSEL_SCREENING}/${dataParams?.vesselScreeningId}/summary/risk-analysis`,
  );
