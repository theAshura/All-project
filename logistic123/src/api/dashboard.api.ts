import { requestAuthorized } from 'helpers/request';
import {
  GetAvgResponse,
  GetUpcomingResponse,
  AverageParams,
  OutstandingIssuesResponse,
  OverviewTaskResponse,
  GetTrendAuditInspectionResponsive,
  AdminTotalAccountResponse,
  GetTrendIssueResponsive,
  PlanningAndRequestNeedReviewResponse,
  CloseoutResponse,
  TotalDashboardResponse,
  UpcomingResponse,
  UpcomingIARByVessel,
  OpenNonConformityByVessel,
  OpenFindingObservationByVessel,
  UpcomingPlanByVessel,
  TotalCkListRofIar,
  VesselGHGRatingResponse,
  GetInspectionPlanResponse,
  GetVesselSafetyResponse,
  GetLastInspectionResponse,
  GetVesselGroupByAgeResponse,
  GetBlackListedVesselResponse,
  GetVesselHasRestrictedResponse,
  GetAuditChecklistOpenTaskResponse,
  GetInspectionReportOpenTaskResponse,
  GetFindingFormOpenTaskResponse,
  GetVesselRiskRatingResponse,
  GetTotalNumberRiskResponse,
  GetUpcomingInspectionPlansResponse,
  UpcomingInpectionPlans,
  OverviewReportFindingForm,
  OverviewDashboard,
  GetCarCapNeedReviewing,
  TrendOfOutstandingCarCapResponse,
  TrendOfOutstandingCarCapDetailResponse,
  GetInspectionPerStatusResponse,
  GetInspectionPerTypeData,
  GetInspectionPerTypePerMonthData,
  GetNumberIncidentsPerPortResponse,
  GetInspectionPerPortPerStatusData,
  GetNumberOfIncidentsByPotentialRiskResponse,
  GetNumberOfIncidentsByTypeResponse,
  GetNumberIncidentsPerPortPerDateResponse,
  GetNumberIncidentsPerPortPerStatusResponse,
  GetPlanningRequestOpenTaskResponse,
} from 'models/api/dashboard/dashboard.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API,
  ASSETS_API_DASHBOARD,
  ASSETS_API_INCIDENT_SUMMARY,
  ASSETS_API_VESSEL_SCREENING_SUMMARY,
} from './endpoints/config.endpoint';

// company admin

export const getCompanyAvgActionsApi = (dataParams: AverageParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAvgResponse>(
    `${ASSETS_API_DASHBOARD}/company-admin/avg?${params}`,
  );
};

export const getCompanyTrendAuditInspectionActionsApi = (
  dataParams: AverageParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetTrendAuditInspectionResponsive>(
    `${ASSETS_API_DASHBOARD}/company-admin/trends-audit-inspection?${params}`,
  );
};

export const getCompanyTrendIssuesActionsApi = (dataParams: AverageParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetTrendIssueResponsive>(
    `${ASSETS_API_DASHBOARD}/company-admin/trends-issues?${params}`,
  );
};

export const getCompanyFindingActionsApi = (dataParams: AverageParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAvgResponse>(
    `${ASSETS_API_DASHBOARD}/company-admin/findings?${params}`,
  );
};

export const getCompanyUpcomingActionsApi = (data: CommonApiParam) => {
  const params = queryString.stringify(data);
  return requestAuthorized.get<GetUpcomingResponse>(
    `${ASSETS_API_DASHBOARD}/company-admin/upcoming?${params}`,
  );
};

export const getCompanyOutstandingIssuesActionsApi = (data: CommonApiParam) => {
  const params = queryString.stringify(data);
  return requestAuthorized.get<OutstandingIssuesResponse>(
    `${ASSETS_API_DASHBOARD}/company-admin/overview-outstanding-issues?${params}`,
  );
};
export const getCompanyOverviewTaskActionsApi = (data: CommonApiParam) => {
  const params = queryString.stringify(data);
  return requestAuthorized.get<OverviewTaskResponse>(
    `${ASSETS_API_DASHBOARD}/company-admin/overview-task?${params}`,
  );
};

export const getCompanyUpcomingIARByVesselApi = (id: string) =>
  requestAuthorized.get<UpcomingIARByVessel[]>(
    `${ASSETS_API_DASHBOARD}/company-admin/upcoming-iar-by-vessel/${id}`,
  );

export const getCompanyOpenNonConformityByVesselApi = (id: string) =>
  requestAuthorized.get<OpenNonConformityByVessel[]>(
    `${ASSETS_API_DASHBOARD}/company-admin/opened-finding-non-conformity-by-vessel/${id}`,
  );

export const getCompanyUpcomingPlanByVesselApi = (id: string) =>
  requestAuthorized.get<UpcomingPlanByVessel[]>(
    `${ASSETS_API_DASHBOARD}/company-admin/upcoming-plan-by-vessel/${id}`,
  );

export const getCompanyOpenFindingObservationByVesselApi = (id: string) =>
  requestAuthorized.get<OpenFindingObservationByVessel[]>(
    `${ASSETS_API_DASHBOARD}/company-admin/opened-finding-observation-by-vessel/${id}`,
  );
// super admin

export const getAdminTotalAccountActionsApi = (data: CommonApiParam) => {
  const params = queryString.stringify(data);

  return requestAuthorized.get<AdminTotalAccountResponse>(
    `${ASSETS_API_DASHBOARD}/super-admin/accounts?${params}`,
  );
};

//  auditor

export const getAuditorTrendIssuesActionsApi = (dataParams: AverageParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetTrendIssueResponsive>(
    `${ASSETS_API_DASHBOARD}/auditor/trends-issues?${params}`,
  );
};

export const getAuditorOutstandingIssuesActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<OutstandingIssuesResponse>(
    `${ASSETS_API_DASHBOARD}/auditor/overview-outstanding-issues?${params}`,
  );
};

export const getPlanningNeedReviewActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<PlanningAndRequestNeedReviewResponse>(
    `${ASSETS_API_DASHBOARD}/auditor/pr-need-review?${params}`,
  );
};

export const getAuditTimeTableNotCloseOutActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<CloseoutResponse>(
    `${ASSETS_API_DASHBOARD}/auditor/att-need-closeout?${params}`,
  );
};

export const getTotalDashboardActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<TotalDashboardResponse>(
    `${ASSETS_API_DASHBOARD}/auditor/total?${params}`,
  );
};

export const getUpcomingActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<UpcomingResponse>(
    `${ASSETS_API_DASHBOARD}/auditor/upcoming?${params}`,
  );
};

export const getAuditorUpcomingIARByVesselApi = (id: string) =>
  requestAuthorized.get<UpcomingIARByVessel[]>(
    `${ASSETS_API_DASHBOARD}/auditor/upcoming-iar-by-vessel/${id}`,
  );

export const getAuditorOpenNonConformityByVesselApi = (id: string) =>
  requestAuthorized.get<OpenNonConformityByVessel[]>(
    `${ASSETS_API_DASHBOARD}/auditor/opened-finding-non-conformity-by-vessel/${id}`,
  );

export const getAuditorUpcomingPlanByVesselApi = (id: string) =>
  requestAuthorized.get<UpcomingPlanByVessel[]>(
    `${ASSETS_API_DASHBOARD}/auditor/upcoming-plan-by-vessel/${id}`,
  );

export const getAuditorOpenFindingObservationByVesselApi = (id: string) =>
  requestAuthorized.get<OpenFindingObservationByVessel[]>(
    `${ASSETS_API_DASHBOARD}/auditor/opened-finding-observation-by-vessel/${id}`,
  );

export const getTotalCkListRofIarAuditorApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<TotalCkListRofIar>(
    `${ASSETS_API_DASHBOARD}/auditor/total-cklist-rof-iar?${params}`,
  );
};

export const getTotalCkListRofIarCompanyApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<TotalCkListRofIar>(
    `${ASSETS_API_DASHBOARD}/company-admin/total-cklist-rof-iar?${params}`,
  );
};

export const getVesselGHGRatingApi = () =>
  requestAuthorized.get<VesselGHGRatingResponse>(
    `${ASSETS_API_DASHBOARD}/vessel-ghg-rating`,
  );

export const getVesselSafetyScoreAPI = () =>
  requestAuthorized.get<GetVesselSafetyResponse>(
    `${ASSETS_API_DASHBOARD}/vessel-safety-score`,
  );

export const getInspectionPlanAPI = () =>
  requestAuthorized.get<GetInspectionPlanResponse>(
    `${ASSETS_API_DASHBOARD}/planning-request`,
  );

export const getBlacklistedVesselAPI = () =>
  requestAuthorized.get<GetBlackListedVesselResponse[]>(
    `${ASSETS_API_DASHBOARD}/vessel-blacklisted`,
  );

export const getLastInspectionAPI = () =>
  requestAuthorized.get<GetLastInspectionResponse>(
    `${ASSETS_API_DASHBOARD}/vessel-last-inspection`,
  );

export const getVesselGroupByAgeAPI = () =>
  requestAuthorized.get<GetVesselGroupByAgeResponse>(
    `${ASSETS_API_DASHBOARD}/vessel-group-by-age`,
  );

export const getVesselHasRestrictesAPI = () =>
  requestAuthorized.get<GetVesselHasRestrictedResponse>(
    `${ASSETS_API_DASHBOARD}/vessel-has-restricted`,
  );

export const getAuditChecklistOpenTaskAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAuditChecklistOpenTaskResponse>(
    `${ASSETS_API_DASHBOARD}/audit-checklist-open-task?${params}`,
  );
};

export const getFindingFormOpenTaskAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetFindingFormOpenTaskResponse>(
    `${ASSETS_API_DASHBOARD}/finding-form-open-task?${params}`,
  );
};

export const getInspectionReportOpenTaskAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionReportOpenTaskResponse>(
    `${ASSETS_API_DASHBOARD}/inspection-report-open-task?${params} `,
  );
};

export const getVesselRiskRatingAPI = () =>
  requestAuthorized.get<GetVesselRiskRatingResponse>(
    `${ASSETS_API_VESSEL_SCREENING_SUMMARY}/vessel-risk-rating`,
  );

export const getTotalNumberRiskAPI = () =>
  requestAuthorized.get<GetTotalNumberRiskResponse>(
    `${ASSETS_API_VESSEL_SCREENING_SUMMARY}/total-number-risk`,
  );

export const getUpcomingInspectionPlansAPI = (
  dataParams?: UpcomingInpectionPlans,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetUpcomingInspectionPlansResponse>(
    `${ASSETS_API_DASHBOARD}/company-admin/upcoming-inspection-plans?${params}`,
  );
};

// auditor open task dashboard
export const getReportFindingDashboardTaskActionsApi = (dataParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<OverviewReportFindingForm>(
    `${ASSETS_API}/report-finding-dashboard?${params}`,
  );
};

export const getPlanningRequestDashboardTaskActionsApi = (dataParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.post<OverviewDashboard>(
    `${ASSETS_API}/planning-request-dashboard?${params}`,
  );
};

export const getInternalAuditDashboardTaskActionsApi = (dataParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<OverviewDashboard>(
    `${ASSETS_API}/internal-audit-report-dashboard?${params}`,
  );
};

export const getUpcomingRequestByVesselActionsApi = (dataParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<OverviewDashboard>(
    `${ASSETS_API}/planning-request-upcoming?${params}`,
  );
};
export const getCompanyCarCapNeedReviewingAPI = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCarCapNeedReviewing>(
    `${ASSETS_API_DASHBOARD}/list-cap-need-review?${params}`,
  );
};

export const getTrendOfOutstandingCarCapAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<TrendOfOutstandingCarCapResponse>(
    `${ASSETS_API_DASHBOARD}/trend-of-outstanding-car-cap?${params}`,
  );
};

export const getTrendOfOutstandingCarCapDetailAPI = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<TrendOfOutstandingCarCapDetailResponse>(
    `${ASSETS_API_DASHBOARD}/trend-of-outstanding-car-cap-detail?${params}`,
  );
};

export const getInspectionPerStatusAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionPerStatusResponse>(
    `${ASSETS_API_DASHBOARD}/inspection-per-status?${params}`,
  );
};

export const getInspectionPerTypeAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionPerTypeData[]>(
    `${ASSETS_API_DASHBOARD}/inspection-per-type?${params}`,
  );
};

export const getInspectionPerPortAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionPerTypeData[]>(
    `${ASSETS_API_DASHBOARD}/inspection-per-port?${params}`,
  );
};

export const getInspectionPerTypePerMonthAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionPerTypePerMonthData[]>(
    `${ASSETS_API_DASHBOARD}/inspection-per-type-per-month?${params}`,
  );
};

export const getInspectionPerPortPerMonthAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionPerTypePerMonthData[]>(
    `${ASSETS_API_DASHBOARD}/inspection-per-port-per-month?${params}`,
  );
};

export const getNumberIncidentPerPortAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetNumberIncidentsPerPortResponse>(
    `${ASSETS_API_INCIDENT_SUMMARY}/number-incidents-per-port?${params}`,
  );
};
export const getInspectionPerPortPerStatusAPI = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionPerPortPerStatusData[]>(
    `${ASSETS_API_DASHBOARD}/inspection-per-port-per-status?${params}`,
  );
};

export const getNumberOfIncidentsByPotentialRiskAPI = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetNumberOfIncidentsByPotentialRiskResponse[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/incident-basis-potential-risk?${params}`,
  );
};

export const getNumberOfIncidentsByTypeAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetNumberOfIncidentsByTypeResponse[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/number-incidents-per-type?${params}`,
  );
};

export const getNumberIncidentsPerPortPerDateAPI = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetNumberIncidentsPerPortPerDateResponse[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/number-incidents-per-port-per-date?${params}`,
  );
};

export const getNumberIncidentsPerPortPerStatusAPI = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetNumberIncidentsPerPortPerStatusResponse[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/number-incidents-per-port-per-status?${params}`,
  );
};

export const getOpenTaskPlanningAPI = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPlanningRequestOpenTaskResponse>(
    `${ASSETS_API_DASHBOARD}/planning-open-task?${params}`,
  );
};
