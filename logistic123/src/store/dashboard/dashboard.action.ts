import {
  GetAvgResponse,
  GetUpcomingResponse,
  OverviewTaskResponse,
  OutstandingIssuesResponse,
  FindingResponse,
  AverageParams,
  GetTrendAuditInspectionResponsive,
  AdminTotalAccountResponse,
  GetTrendIssueResponsive,
  UpcomingIARByVessel,
  OpenNonConformityByVessel,
  OpenFindingObservationByVessel,
  UpcomingPlanByVessel,
  VesselGHGRatingResponse,
  GetVesselSafetyResponse,
  GetInspectionPlanResponse,
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
  OverviewReportFindingForm,
  OverviewDashboard,
  OverviewInternalAuditReport,
  UpcomingInpectionPlans,
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
import { createAction, createAsyncAction } from 'typesafe-actions';

export const getCompanyAvgActions = createAsyncAction(
  `@dashboard/GET_COMPANY_AVG_ACTIONS`,
  `@dashboard/GET_COMPANY_AVG_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_AVG_ACTIONS_FAIL`,
)<AverageParams, GetAvgResponse, void>();

export const getCompanyTrendAuditInspectionActions = createAsyncAction(
  `@dashboard/GET_COMPANY_TREND_AUDIT_INSPECTION_ACTIONS`,
  `@dashboard/GET_COMPANY_TREND_AUDIT_INSPECTION_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_TREND_AUDIT_INSPECTION_ACTIONS_FAIL`,
)<AverageParams, GetTrendAuditInspectionResponsive, void>();

export const getCompanyTrendIssueActions = createAsyncAction(
  `@dashboard/GET_COMPANY_TREND_ISSUES_ACTIONS`,
  `@dashboard/GET_COMPANY_TREND_ISSUES_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_TREND_ISSUES_ACTIONS_FAIL`,
)<AverageParams, GetTrendIssueResponsive, void>();

export const getCompanyFindingActions = createAsyncAction(
  `@dashboard/GET_COMPANY_FINDING_ACTIONS`,
  `@dashboard/GET_COMPANY_FINDING_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_FINDING_ACTIONS_FAIL`,
)<AverageParams, FindingResponse, void>();

export const getCompanyUpcomingActions = createAsyncAction(
  `@dashboard/GET_COMPANY_UPCOMING_ACTIONS`,
  `@dashboard/GET_COMPANY_UPCOMING_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_UPCOMING_ACTIONS_FAIL`,
)<CommonApiParam, GetUpcomingResponse, void>();

export const getCompanyOutstandingIssuesActions = createAsyncAction(
  `@dashboard/GET_COMPANY_OVERVIEW_OUTSTANDING_ISSUES_ACTIONS`,
  `@dashboard/GET_COMPANY_OVERVIEW_OUTSTANDING_ISSUES_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_OVERVIEW_OUTSTANDING_ISSUES_ACTIONS_FAIL`,
)<CommonApiParam, OutstandingIssuesResponse, void>();

export const getCompanyOverviewTaskActions = createAsyncAction(
  `@dashboard/GET_COMPANY_OVERVIEW_TASK_ACTIONS`,
  `@dashboard/GET_COMPANY_OVERVIEW_TASK_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_OVERVIEW_TASK_ACTIONS_FAIL`,
)<CommonApiParam, OverviewTaskResponse, void>();

export const getAdminTotalAccountActions = createAsyncAction(
  `@dashboard/GET_ADMIN_TOTAL_ACCOUNT_ACTIONS`,
  `@dashboard/GET_ADMIN_TOTAL_ACCOUNT_ACTIONS_SUCCESS`,
  `@dashboard/GET_ADMIN_TOTAL_ACCOUNT_ACTIONS_FAIL`,
)<CommonApiParam, AdminTotalAccountResponse, void>();

export const getAuditorTrendIssueActions = createAsyncAction(
  `@dashboard/GET_AUDITOR_TREND_ISSUES_ACTIONS`,
  `@dashboard/GET_AUDITOR_TREND_ISSUES_ACTIONS_SUCCESS`,
  `@dashboard/GET_AUDITOR_TREND_ISSUES_ACTIONS_FAIL`,
)<AverageParams, GetTrendIssueResponsive, void>();

export const getAuditorOutstandingIssuesActions = createAsyncAction(
  `@dashboard/GET_AUDITOR_OVERVIEW_OUTSTANDING_ISSUES_ACTIONS`,
  `@dashboard/GET_AUDITOR_OVERVIEW_OUTSTANDING_ISSUES_ACTIONS_SUCCESS`,
  `@dashboard/GET_AUDITOR_OVERVIEW_OUTSTANDING_ISSUES_ACTIONS_FAIL`,
)<CommonApiParam, OutstandingIssuesResponse, void>();

// modal company

export const getCompanyUpcomingIARByVesselActions = createAsyncAction(
  `@dashboard/GET_COMPANY_UPCOMING_IAR_BY_VESSEL_ACTIONS`,
  `@dashboard/GET_COMPANY_UPCOMING_IAR_BY_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_UPCOMING_IAR_BY_VESSEL_ACTIONS_FAIL`,
)<CommonApiParam, UpcomingIARByVessel[], void>();

export const getCompanyOpenNonConformityByVesselActions = createAsyncAction(
  `@dashboard/GET_COMPANY_OPEN_NON_CONFORMITY_BY_VESSEL_ACTIONS`,
  `@dashboard/GET_COMPANY_OPEN_NON_CONFORMITY_BY_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_OPEN_NON_CONFORMITY_BY_VESSEL_ACTIONS_FAIL`,
)<CommonApiParam, OpenNonConformityByVessel[], void>();

export const getCompanyUpcomingPlanByVesselActions = createAsyncAction(
  `@dashboard/GET_COMPANY_UPCOMING_PLAN_BY_VESSEL_ACTIONS`,
  `@dashboard/GET_COMPANY_UPCOMING_PLAN_BY_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_COMPANY_UPCOMING_PLAN_BY_VESSEL_ACTIONS_FAIL`,
)<CommonApiParam, UpcomingPlanByVessel[], void>();

export const getTotalCkListRofIarCompanyActions = createAsyncAction(
  `@dashboard/GET_TOTAL_CK_LIST_ROF_IAR_COMPANY_ACTIONS`,
  `@dashboard/GET_TOTAL_CK_LIST_ROF_IAR_COMPANY_ACTIONS_SUCCESS`,
  `@dashboard/GET_TOTAL_CK_LIST_ROF_IAR_COMPANY_ACTIONS_FAIL`,
)<CommonApiParam, any, void>();

export const getCompanyOpenFindingObservationByVesselActions =
  createAsyncAction(
    `@dashboard/GET_COMPANY_OPEN_FINDING_OBSERVATION_BY_VESSEL_ACTIONS`,
    `@dashboard/GET_COMPANY_OPEN_FINDING_OBSERVATION_BY_VESSEL_ACTIONS_SUCCESS`,
    `@dashboard/GET_COMPANY_OPEN_FINDING_OBSERVATION_BY_VESSEL_ACTIONS_FAIL`,
  )<CommonApiParam, OpenFindingObservationByVessel[], void>();

// modal auditor
export const getAuditorUpcomingIARByVesselActions = createAsyncAction(
  `@dashboard/GET_AUDITOR_UPCOMING_IAR_BY_VESSEL_ACTIONS`,
  `@dashboard/GET_AUDITOR_UPCOMING_IAR_BY_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_AUDITOR_UPCOMING_IAR_BY_VESSEL_ACTIONS_FAIL`,
)<CommonApiParam, UpcomingIARByVessel[], void>();

export const getAuditorOpenNonConformityByVesselActions = createAsyncAction(
  `@dashboard/GET_AUDITOR_OPEN_NON_CONFORMITY_BY_VESSEL_ACTIONS`,
  `@dashboard/GET_AUDITOR_OPEN_NON_CONFORMITY_BY_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_AUDITOR_OPEN_NON_CONFORMITY_BY_VESSEL_ACTIONS_FAIL`,
)<CommonApiParam, OpenNonConformityByVessel[], void>();

export const getAuditorUpcomingPlanByVesselActions = createAsyncAction(
  `@dashboard/GET_AUDITOR_UPCOMING_PLAN_BY_VESSEL_ACTIONS`,
  `@dashboard/GET_AUDITOR_UPCOMING_PLAN_BY_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_AUDITOR_UPCOMING_PLAN_BY_VESSEL_ACTIONS_FAIL`,
)<CommonApiParam, UpcomingPlanByVessel[], void>();

export const getTotalCkListRofIarAuditorActions = createAsyncAction(
  `@dashboard/GET_TOTAL_CK_LIST_ROF_IAR_AUDITOR_ACTIONS`,
  `@dashboard/GET_TOTAL_CK_LIST_ROF_IAR_AUDITOR_ACTIONS_SUCCESS`,
  `@dashboard/GET_TOTAL_CK_LIST_ROF_IAR_AUDITOR_ACTIONS_FAIL`,
)<CommonApiParam, any, void>();

export const getAuditorOpenFindingObservationByVesselActions =
  createAsyncAction(
    `@dashboard/GET_AUDITOR_OPEN_FINDING_OBSERVATION_BY_VESSEL_ACTIONS`,
    `@dashboard/GET_AUDITOR_OPEN_FINDING_OBSERVATION_BY_VESSEL_ACTIONS_SUCCESS`,
    `@dashboard/GET_AUDITOR_OPEN_FINDING_OBSERVATION_BY_VESSEL_ACTIONS_FAIL`,
  )<CommonApiParam, OpenFindingObservationByVessel[], void>();

export const clearDashboardReducer = createAction(
  `@dashboard/CLEAR_DASHBOARD_REDUCER`,
)<void>();

export const clearDashboardErrorsReducer = createAction(
  `@dashboard/CLEAR_DASHBOARD_ERRORS_REDUCER`,
)<void>();

export const getVesselGHGRatingActions = createAsyncAction(
  `@dashboard/GET_VESSEL_GHG_RATING_ACTIONS`,
  `@dashboard/GET_VESSEL_GHG_RATING_ACTIONS_SUCCESS`,
  `@dashboard/GET_VESSEL_GHG_RATING_ACTIONS_FAIL`,
)<void, VesselGHGRatingResponse, void>();

export const getVesselSafetyScoreActions = createAsyncAction(
  `@dashboard/GET_VESSEL_SAFETY_SCORE_ACTIONS`,
  `@dashboard/GET_VESSEL_SAFETY_SCORE_ACTIONS_SUCCESS`,
  `@dashboard/GET_VESSEL_SAFETY_SCORE_ACTIONS_FAIL`,
)<void, GetVesselSafetyResponse, void>();

export const getInspectionPlanActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_PLAN_ACTIONS`,
  `@dashboard/GET_INSPECTION_PLAN_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_PLAN_ACTIONS_FAIL`,
)<void, GetInspectionPlanResponse, void>();

export const getLastInspectionActions = createAsyncAction(
  `@dashboard/GET_LAST_INSPECTION_ACTIONS`,
  `@dashboard/GET_LAST_INSPECTION_ACTIONS_SUCCESS`,
  `@dashboard/GET_LAST_INSPECTION_ACTIONS_FAIL`,
)<void, GetLastInspectionResponse, void>();

export const getVesselGroupByAgeActions = createAsyncAction(
  `@dashboard/GET_VESSEL_GROUP_BY_AGE_ACTIONS`,
  `@dashboard/GET_VESSEL_GROUP_BY_AGE_ACTIONS_SUCCESS`,
  `@dashboard/GET_LVESSEL_GROUP_BY_AGE_ACTIONS_FAIL`,
)<void, GetVesselGroupByAgeResponse, void>();

export const getBlacklistedVesselActions = createAsyncAction(
  `@dashboard/GET_BLACKLISTED_VESSEL_ACTIONS`,
  `@dashboard/GET_BLACKLISTED_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_BLACKLISTED_VESSEL_ACTIONS_FAIL`,
)<void, GetBlackListedVesselResponse[], void>();

export const getVesselHasRestrictedActions = createAsyncAction(
  `@dashboard/GET_VESSEL_HAS_RESTRICTED_ACTIONS`,
  `@dashboard/GET_VESSEL_HAS_RESTRICTED_ACTIONS_SUCCESS`,
  `@dashboard/GET_VESSEL_HAS_RESTRICTED_ACTIONS_FAIL`,
)<void, GetVesselHasRestrictedResponse[], void>();

export const getAuditChecklistOpenTaskActions = createAsyncAction(
  `@dashboard/GET_AUDIT_CHECKLIST_ACTIONS`,
  `@dashboard/GET_AUDIT_CHECKLIST_ACTIONS_SUCCESS`,
  `@dashboard/GET_AUDIT_CHECKLIST_ACTIONS_FAIL`,
)<CommonApiParam, GetAuditChecklistOpenTaskResponse, void>();

export const getFindingFormOpenTaskActions = createAsyncAction(
  `@dashboard/GET_FINDING_FORM_ACTIONS`,
  `@dashboard/GET_FINDING_FORM_ACTIONS_SUCCESS`,
  `@dashboard/GET_FINDING_FORM_ACTIONS_FAIL`,
)<CommonApiParam, GetFindingFormOpenTaskResponse, void>();

export const getInspectionReportOpenTaskActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_REPORT_ACTIONS`,
  `@dashboard/GET_INSPECTION_REPORT_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_REPORT_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionReportOpenTaskResponse, void>();

export const getVesselRiskRatingActions = createAsyncAction(
  `@dashboard/GET_VESSEL_RISK_RATING_ACTIONS`,
  `@dashboard/GET_VESSEL_RISK_RATING_ACTIONS_SUCCESS`,
  `@dashboard/GET_VESSEL_RISK_RATING_ACTIONS_FAIL`,
)<void, GetVesselRiskRatingResponse, void>();

export const getTotalNumberRiskActions = createAsyncAction(
  `@dashboard/GET_TOTAL_NUMBER_RISK_ACTIONS`,
  `@dashboard/GET_TOTAL_NUMBER_RISK_ACTIONS_SUCCESS`,
  `@dashboard/GET_TOTAL_NUMBER_RISK_ACTIONS_FAIL`,
)<void, GetTotalNumberRiskResponse, void>();

export const getUpcomingInspectionPlansActions = createAsyncAction(
  `@dashboard/GET_UPCOMING_INSPECTION_PLANS_ACTIONS`,
  `@dashboard/GET_UPCOMING_INSPECTION_PLANS_ACTIONS_SUCCESS`,
  `@dashboard/GET_UPCOMING_INSPECTION_PLANS_ACTIONS_FAIL`,
)<UpcomingInpectionPlans, GetUpcomingInspectionPlansResponse[], void>();
export const getReportFindingDashboardActions = createAsyncAction(
  `@dashboard/GET_REPORT_FINDING_DASHBOARD_ACTIONS`,
  `@dashboard/GET_REPORT_FINDING_DASHBOARD_ACTIONSS_SUCCESS`,
  `@dashboard/GET_REPORT_FINDING_DASHBOARD_ACTIONS_FAIL`,
)<any, OverviewReportFindingForm, void>();

export const getPlanningRequestDashboardActions = createAsyncAction(
  `@dashboard/GET_PLANNING_REQUEST_DASHBOARD_ACTIONS`,
  `@dashboard/GET_PLANNING_REQUEST_DASHBOARD_ACTIONS_SUCCESS`,
  `@dashboard/GET_PLANNING_REQUEST_DASHBOARD_ACTIONS_FAIL`,
)<any, OverviewDashboard, void>();

export const getInternalAuditDashboardActions = createAsyncAction(
  `@dashboard/GET_INTERNAL_AUDIT_DASHBOARD_ACTIONS`,
  `@dashboard/GET_INTERNAL_AUDIT_DASHBOARD_ACTIONS_SUCCESS`,
  `@dashboard/GET_INTERNAL_AUDIT_DASHBOARD_ACTIONS_FAIL`,
)<any, OverviewInternalAuditReport[], void>();

export const getUpcomingRequestByVesselActions = createAsyncAction(
  `@dashboard/GET_UPCOMING_REQUEST_BY_VESSEL_ACTIONS`,
  `@dashboard/GET_UPCOMING_REQUEST_BY_VESSEL_ACTIONS_SUCCESS`,
  `@dashboard/GET_UPCOMING_REQUEST_BY_VESSEL_ACTIONS_FAIL`,
)<any, OverviewDashboard, void>();
export const getCompanyCarCapNeedReviewingActions = createAsyncAction(
  `@dashboard/GET_CAR_CAP_NEED_REVIEWING_ACTIONS`,
  `@dashboard/GET_CAR_CAP_NEED_REVIEWING_ACTIONS_SUCCESS`,
  `@dashboard/GET_CAR_CAP_NEED_REVIEWING_ACTIONS_FAIL`,
)<CommonApiParam, GetCarCapNeedReviewing, void>();

export const getTrendOfOutstandingCarCapActions = createAsyncAction(
  `@dashboard/GET_CAR_CAP_TREND_OF_OUTSTANDING_ACTIONS`,
  `@dashboard/GET_CAR_CAP_TREND_OF_OUTSTANDING_ACTIONS_SUCCESS`,
  `@dashboard/GET_CAR_CAP_TREND_OF_OUTSTANDING_ACTIONS_FAIL`,
)<CommonApiParam, TrendOfOutstandingCarCapResponse, void>();

export const getTrendOfOutstandingCarCapDetailActions = createAsyncAction(
  `@dashboard/GET_CAR_CAP_TREND_OF_OUTSTANDING_DETAIL_ACTIONS`,
  `@dashboard/GET_CAR_CAP_TREND_OF_OUTSTANDING_DETAIL_ACTIONS_SUCCESS`,
  `@dashboard/GET_CAR_CAP_TREND_OF_OUTSTANDING_DETAIL_ACTIONS_FAIL`,
)<CommonApiParam, TrendOfOutstandingCarCapDetailResponse, void>();

export const getOutStandingCarCapIssueActions = createAsyncAction(
  `@dashboard/GET_OUT_STANDING_CAR_CAP_ISSUE_ACTIONS`,
  `@dashboard/GET_OUT_STANDING_CAR_CAP_ISSUE_ACTIONS_SUCCESS`,
  `@dashboard/GET_OUT_STANDING_CAR_CAP_ISSUE_ACTIONS_FAIL`,
)<CommonApiParam, TrendOfOutstandingCarCapResponse, void>();

export const getInspectionPerStatusActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_PER_STATUS_ACTIONS`,
  `@dashboard/GET_INSPECTION_PER_STATUS_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_PER_STATUS_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionPerStatusResponse, void>();

export const getInspectionPerTypeActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_PER_TYPE_ACTIONS`,
  `@dashboard/GET_INSPECTION_PER_TYPE_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_PER_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionPerTypeData[], void>();

export const getInspectionPerPortActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_PER_PORT_ACTIONS`,
  `@dashboard/GET_INSPECTION_PER_PORT_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_PER_PORT_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionPerTypeData[], void>();

export const getInspectionPerTypePerMonthActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_TYPE_PER_MONTH_ACTIONS`,
  `@dashboard/GET_INSPECTION_TYPE_PER_MONTH_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_TYPE_PER_MONTH_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionPerTypePerMonthData[], void>();

export const getInspectionPerPortPerMonthActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_PORT_PER_MONTH_ACTIONS`,
  `@dashboard/GET_INSPECTION_PORT_PER_MONTH_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_PORT_PER_MONTH_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionPerTypePerMonthData[], void>();

export const getInspectionPerPortPerStatusActions = createAsyncAction(
  `@dashboard/GET_INSPECTION_PORT_PER_STATUS_ACTIONS`,
  `@dashboard/GET_INSPECTION_PORT_PER_STATUS_ACTIONS_SUCCESS`,
  `@dashboard/GET_INSPECTION_PORT_PER_STATUS_ACTIONS_FAIL`,
)<CommonApiParam, GetInspectionPerPortPerStatusData[], void>();

export const getNumberIncidentsPerPortActions = createAsyncAction(
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_ACTIONS`,
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_ACTIONS_SUCCESS`,
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_ACTIONS_FAIL`,
)<CommonApiParam, GetNumberIncidentsPerPortResponse, void>();

export const getNumberOfIncidentsByPotentialRiskActions = createAsyncAction(
  `@dashboard/GET_NUMBER_OF_INCIDENTS_BY_POTENTIAL_RISK_ACTIONS`,
  `@dashboard/GET_NUMBER_OF_INCIDENTS_BY_POTENTIAL_RISK_ACTIONS_SUCCESS`,
  `@dashboard/GET_NUMBER_OF_INCIDENTS_BY_POTENTIAL_RISK_ACTIONS_FAIL`,
)<CommonApiParam, GetNumberOfIncidentsByPotentialRiskResponse, void>();

export const getNumberOfIncidentsByTypeActions = createAsyncAction(
  `@dashboard/GET_NUMBER_OF_INCIDENTS_BY_TYPE_ACTIONS`,
  `@dashboard/GET_NUMBER_OF_INCIDENTS_BY_TYPE_ACTIONS_SUCCESS`,
  `@dashboard/GET_NUMBER_OF_INCIDENTS_BY_TYPE_ACTIONS_FAIL`,
)<CommonApiParam, GetNumberOfIncidentsByTypeResponse, void>();

export const getNumberIncidentsPerPortPerDateActions = createAsyncAction(
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_PER_DATE_ACTIONS`,
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_PER_DATE_ACTIONS_SUCCESS`,
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_PER_DATE_ACTIONS_FAIL`,
)<CommonApiParam, GetNumberIncidentsPerPortPerDateResponse[], void>();

export const getNumberIncidentsPerPortPerStatusActions = createAsyncAction(
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_PER_STATUS_ACTIONS`,
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_PER_STATUS_ACTIONS_SUCCESS`,
  `@dashboard/GET_NUMBER_INCIDENTS_PER_PORT_PER_STATUS_ACTIONS_FAIL`,
)<CommonApiParam, GetNumberIncidentsPerPortPerStatusResponse[], void>();

export const getPlanningOpenTaskActions = createAsyncAction(
  `@dashboard/GET_PLANNING_OPEN_TASK_ACTIONS`,
  `@dashboard/GET_PLANNING_OPEN_TASK_ACTIONS_SUCCESS`,
  `@dashboard/GET_PLANNING_OPEN_TASK_ACTIONS_FAIL`,
)<CommonApiParam, GetPlanningRequestOpenTaskResponse, void>();
