import { ErrorField } from 'models/common.model';
import {
  GetAvgResponse,
  GetUpcomingResponse,
  OverviewTaskResponse,
  OutstandingIssuesResponse,
  FindingResponse,
  GetTrendAuditInspectionResponsive,
  AdminTotalAccountResponse,
  GetTrendIssueResponsive,
  UpcomingIARByVessel,
  OpenNonConformityByVessel,
  OpenFindingObservationByVessel,
  UpcomingPlanByVessel,
  TotalCkListRofIar,
  VesselGHGRatingResponse,
  GetVesselSafetyResponse,
  GetInspectionPlanResponse,
  GetBlackListedVesselResponse,
  GetLastInspectionResponse,
  GetVesselGroupByAgeResponse,
  GetVesselHasRestrictedResponse,
  GetAuditChecklistOpenTaskResponse,
  GetFindingFormOpenTaskResponse,
  GetInspectionReportOpenTaskResponse,
  GetVesselRiskRatingResponse,
  GetTotalNumberRiskResponse,
  GetUpcomingInspectionPlansResponse,
  GetUpcomingRequestByVesselResponse,
  GetCarCapNeedReviewing,
  TrendOfOutstandingCarCapResponse,
  TrendOfOutstandingCarCapDetailResponse,
  TrendOfOutstandingCarCapTotal,
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
} from '../../api/dashboard/dashboard.model';

export interface DashboardStoreModel {
  loading: boolean;
  loadingModal: boolean;
  errorList: ErrorField[];
  totalCkListRofIar: TotalCkListRofIar;
  // company
  companyAvgResponse: GetAvgResponse;
  dataUpcomingIARByVessel: UpcomingIARByVessel[];
  dataOpenNonConformityByVessel: OpenNonConformityByVessel[];
  dataUpcomingPlanByVessel: UpcomingPlanByVessel[];
  openTaskDashboard: OverviewTaskResponse;
  dataOpenFindingObservationByVessel: OpenFindingObservationByVessel[];

  companyUpcomingResponse: GetUpcomingResponse;
  companyOverviewTask: OverviewTaskResponse;
  companyOutstandingIssues: OutstandingIssuesResponse;
  companyFindings: FindingResponse;
  companyTrendAuditInspection: GetTrendAuditInspectionResponsive;
  companyTrendIssues: GetTrendIssueResponsive;

  companyVesselSafetyScore: GetVesselSafetyResponse;
  companyInspectionPlan: GetInspectionPlanResponse;
  companyBlacklistedVessel: GetBlackListedVesselResponse[];
  companyCarCapNeedReviewing: GetCarCapNeedReviewing;

  // admin
  totalAccount: AdminTotalAccountResponse;

  // auditor
  auditorTrendIssues: GetTrendIssueResponsive;
  auditorOutstandingIssues: OutstandingIssuesResponse;

  vesselGHGRating: VesselGHGRatingResponse;
  vesselLastInspection: GetLastInspectionResponse;
  vesselGroupByAge: GetVesselGroupByAgeResponse;
  vesselHasRestricted: GetVesselHasRestrictedResponse[];

  auditChecklist: GetAuditChecklistOpenTaskResponse;
  findingForm: GetFindingFormOpenTaskResponse;
  inspectionReport: GetInspectionReportOpenTaskResponse;
  vesselRiskRating: GetVesselRiskRatingResponse;
  totalNumberRisk: GetTotalNumberRiskResponse;
  upcomingInspectionPlans: GetUpcomingInspectionPlansResponse[];
  upcomingRequestByVessel: GetUpcomingRequestByVesselResponse[];

  trendOfOutstandingCarCap: TrendOfOutstandingCarCapResponse;
  trendOfOutstandingCarCapDetail: TrendOfOutstandingCarCapDetailResponse;
  outStandingCarCapIssue: TrendOfOutstandingCarCapTotal;

  // inspection on main dashboard
  inspectionPerStatus: GetInspectionPerStatusResponse;
  inspectionPerType: GetInspectionPerTypeData[];
  inspectionPerPort: GetInspectionPerTypeData[];
  inspectionPerTypePerMonth: GetInspectionPerTypePerMonthData[];
  inspectionPerPortPerMonth: GetInspectionPerTypePerMonthData[];
  inspectionPerPortPerStatus: GetInspectionPerPortPerStatusData[];
  numberIncidentsPerPort: GetNumberIncidentsPerPortResponse;
  incidentsPotentialRisk: GetNumberOfIncidentsByPotentialRiskResponse;
  incidentsByType: GetNumberOfIncidentsByTypeResponse;
  incidentsPerPortPerDate: GetNumberIncidentsPerPortPerDateResponse[];
  incidentsPerPortPerStatus: GetNumberIncidentsPerPortPerStatusResponse[];

  openTaskPlanning: GetPlanningRequestOpenTaskResponse;
}
