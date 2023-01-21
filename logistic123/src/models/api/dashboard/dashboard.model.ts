export interface AverageFindingPerPlan {
  avg: string;
}

export interface AverageParams {
  fromDate: string;
  toDate: string;
  entityType?: string;
}
export interface OpenTaskParams {
  entityType: string;
}

export interface AverageWorkload {
  id: string;
  username: string;
  totalDays: number;
}

export interface WorkloadsOfAuditor {
  id: string;
  username: string;
  avatar: null | string;
  workload: number;
}

export interface GetAvgResponse {
  workloadsOfAuditors: WorkloadsOfAuditor[];
  averageFindingPerPlan: string;
  rateOverdueReport: string;
  totalAuditors: string;
}

// upcoming

export interface UpcomingPlan {
  vesselId?: string;
  vesselName?: string;
  vesselCode?: string;
  upComingPr: string;
  auditCompanyId?: string;
  auditCompanCode?: string;
  auditCompanyName?: string;
}

export interface UpcomingInpectionPlans {
  fromDate?: string;
  toDate?: String;
  entityType?: String;
}

export interface UpcomingIAR {
  auditCompanyName?: string;
  vesselId: string;
  vesselName: string;
  vesselCode: string;
  upComingIAR: string;
}

export interface GetUpcomingResponse {
  upcomingIAR: UpcomingIAR[];
  upcomingPlan: UpcomingPlan[];
}

// overview issue

export interface OutstandingIssuesTimeTable {
  refNo: string;
  auditRefId: string;
  sNo: string;
  vesselName: string;
  leadAuditor: string;
  plannedFromDate: Date;
  auditTimeTableId: string;
  planningRequestId: string;
}

export interface OutstandingFindingIssues {
  auditRefId: string;
  reportFindingFormId: string;
  refId: string;
  sNo: string;
  vesselName: string;
  leadAuditor: string;
  'auditRef.ID': string;
  plannedFromDate: Date;
}

export interface OutstandingIARIssues {
  auditRefId: string;
  id: string;
  status: string;
  refId: string;
  serialNumber: string;
  vesselName: string;
  leadAuditor: string;
  'auditRef.ID': string;
  sNo: string;
  plannedFromDate: Date;
}

export interface OutstandingIssuesVessel {
  vesselId: string;
  vesselCode: string;
  vesselName: string;
  auditCompanyId?: string;
  auditCompanyName?: string;
  total: string;
}

export interface OutstandingIssuesResponse {
  outstandingIssuesNonConformity: OutstandingIssuesVessel[];
  outstandingIssuesObservation: OutstandingIssuesVessel[];
  outstandingIssuesTimeTable: OutstandingIssuesTimeTable[];
  outstandingIssuesFindingForm: OutstandingFindingIssues[];
  outstandingIssuesIar: OutstandingIARIssues[];
}

// overview task

export interface OverviewDashboard {
  refId?: string;
  id?: string;
  vesselName?: string;
  auditorName?: string;
  plannedFromDate?: Date;
  plannedToDate?: Date;
  status?: string;
}

export interface GetOpenTaskDashboard {
  overviewChecklist?: string[];
  overviewDashboard?: string[];
  overviewInternalAuditReport?: string[];
  overviewReportFindingForm?: string[];
}

export interface OverviewReportFindingForm {
  id?: string;
  refNo?: string;
  sNo?: string;
  vesselName?: string;
  auditorName?: null;
  status?: string;
  auditCompanyName?: string;
  auditCompany?: {
    name?: string;
  };
}

export interface OverviewChecklist {
  id: string;
  code: string;
  name: string;
  status: string;
  revisionDate: Date;
}

export interface OverviewInternalAuditReport {
  refId: string;
  serialNumber: string;
  vesselName: string;
  auditorName: null;
  status: string;
}

export interface OverviewTaskResponse {
  overviewChecklist: OverviewChecklist[];
  overviewDashboard: OverviewDashboard[];
  overviewReportFindingForm: OverviewReportFindingForm[];
  overviewInternalAuditReport: OverviewInternalAuditReport[];
}

// finding

export interface TotalFindingByMainCategory {
  id: string;
  name: string;
  totalNum: string | number;
}
export interface FindingResponse {
  totalFindingByLocation: any[];
  totalFindingByMainCategory: TotalFindingByMainCategory[];
}

//

export interface AverageFindingPerPlanInEachRange {
  timeRange: string;
  averageFindingsPerPlan: string;
}

export interface RateOverdueReportEachTimeRange {
  timeRange: string;
  rateOverdueReport: string;
}

export interface TotalFindingInEachRange {
  timeRange: string;
  total: string;
}

export interface WorkloadOfAllAuditorsEachTimeRange {
  timeRange: string;
  workload: number;
}
export interface GetTrendAuditInspectionResponsive {
  totalFindingInEachRange: TotalFindingInEachRange[];
  averageFindingPerPlanInEachRange: AverageFindingPerPlanInEachRange[];
  rateOverdueReportEachTimeRange: RateOverdueReportEachTimeRange[];
  workloadOfAllAuditorsEachTimeRange: WorkloadOfAllAuditorsEachTimeRange[];
  totalAuditors: string;
}

// trend issue
export interface NumberTimeRange {
  timeRange: Date;
  total: string;
}
export interface NumberIssueTimeRange {
  attNotClosedOut: string;
  iarNotClosedOut: string;
  rffNotClosedOut: string;
  timeRange: Date;
}

export interface GetTrendIssueResponsive {
  // numberOpenFindingsEachTimeRange: NumberTimeRange[];
  // numberAuditTimetableNotCloseoutTimeRange: NumberTimeRange[];
  // numberROFNotCloseoutTimeRange: NumberTimeRange[];
  // numberIARNotCloseoutTimeRange: NumberTimeRange[];
  numberOpenFindingsEachTimeRange: NumberTimeRange[];
  numberIssueNotCloseoutTimeRange: NumberIssueTimeRange[];
}

export interface Company {
  name: string;
}
export interface AdminAccount {
  id: string;
  createdAt: string;
  username: string;
  company: Company;
}
// start modal
export interface UpcomingIARByVessel {
  planId: string;
  auditNo: string;
  plannedFromDate: Date;
  username: string;
}
export interface OpenNonConformityByVessel {
  iarId: string;
  rffId: string;
  refId: string;
  refNo: string;
  auditType: string;
  findings: string;
  isSignificant: boolean;
}

export interface OpenFindingObservationByVessel {
  iarId: string;
  rffId: string;
  refId: string;
  refNo: string;
  auditType: string;
  findings: string;
  isSignificant: boolean;
}

export interface UpcomingPlanByVessel {
  planId: string;
  auditNo: string;
  plannedFromDate: Date;
  username: string;
}

// and modal

export interface AdminTotalAccountResponse {
  data: AdminAccount[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

// planing need rv

export interface Vessel {
  id: string;
  code: string;
  name: string;
}

export interface LeadAuditor {
  id: string;
  username: string;
}

export interface PlanningAndRequestNeedReview {
  id: string;
  createdAt: Date;
  refId: string;
  auditNo: string;
  timezone: string;
  plannedFromDate: Date;
  plannedToDate: Date;
  status: string;
  vessel: Vessel;
  leadAuditor: LeadAuditor;
  auditCompany?: {
    name?: string;
  };
}

export interface PlanningRequest {
  id: string;
  refId: string;
  auditNo: string;
  timezone: string;
  plannedFromDate: Date;
  plannedToDate: Date;
  leadAuditor: LeadAuditor;
  auditCompany?: {
    name?: string;
  };
}

export interface AuditTimeTableNotCloseOut {
  id: string;
  createdAt: Date;
  refNo: string;
  sNo: string;
  actualFrom: Date;
  actualTo: Date;
  timezone: string;
  status: string;
  vessel: Vessel;
  planningRequest: PlanningRequest;
}

export interface CloseoutResponse {
  data: AuditTimeTableNotCloseOut[];
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage?: number;
}

export interface PlanningAndRequestNeedReviewResponse {
  data: PlanningAndRequestNeedReview[];
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage?: number;
}

export interface TotalDashboardResponse {
  totalPlan: string;
  totalInProgressPlan: string;
  totalCompletedPlan: string;
}

export interface UpcomingResponse {
  upcomingIAR: UpcomingIAR[];
  upcomingPlan: UpcomingPlan[];
}

export interface TotalCkListRofIar {
  totalCkList: number;
  totalRof: number;
  totalIar: number;
}

export interface VesselType {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
}
export interface DivisionMapping {
  id: string;
  division: Division;
}

export interface PlanningUnderInspectionRequest {
  id: string;
  refId: string;
}

export interface PlanningUnderInspection {
  id: string;
  imoNumber: string;
  name: string;
  vesselType: VesselType;
  divisionMapping: DivisionMapping;
  planningRequests: PlanningUnderInspectionRequest[];
}

export interface GetInspectionPlanResponse {
  totalPlanning: number;
  totalPlanningDraft: number;
  totalPlanningAccepted: number;
  totalPlanningCancelled: number;
  totalPlanningPlanned: number;
  totalPlanningReassigned: number;
  totalPlanningInProgress: number;
  totalPlanningSubmitted: number;
  totalPlanningCompleted: number;
  totalPlanningApproved: number;
  planningUnderInspection: PlanningUnderInspection[];
}

export interface RightShip {
  id: string;
  safetyScore: string;
}

export interface VesselSafetyScores {
  id: string;
  imoNumber: string;
  name: string;
  vesselType: VesselType;
  divisionMapping: DivisionMapping;
  rightShip: RightShip;
}

export interface GetVesselSafetyResponse {
  totalVessel: number;
  totalScoreNone: number;
  totalScore0: number;
  totalScore1: number;
  totalScore2: number;
  totalScore3: number;
  totalScore4: number;
  totalScore5: number;
  vesselSafetyScores: VesselSafetyScores[];
}

export interface IVesselRemainingValidity {
  id: string;
  imoNumber: string;
  name: string;
  vesselType: VesselType;
  divisionMapping: DivisionMapping;
  rightShip: {
    id: string;
    latInspectionOutcome: string;
    lastInspectionValidity: string;
    validityRemaining: number;
  };
}

export interface IVesselGHGRating {
  id: string;
  imoNumber: string;
  name: string;
  vesselType: VesselType;
  divisionMapping: DivisionMapping;
  rightShip: {
    id: string;
    ghgRating: string;
  };
}
export interface VesselGHGRatingResponse {
  totalVessel: number;
  totalGHGRatingA: number;
  totalGHGRatingB: number;
  totalGHGRatingC: number;
  totalGHGRatingD: number;
  totalGHGRatingE: number;
  totalGHGRatingF: number;
  totalGHGRatingG: number;
  totalGHGRatingU: number;
  vesselGHGRating: IVesselGHGRating[];
}
export interface GetLastInspectionResponse {
  totalVessel: number;
  totalVesselLastInspectionAcceptable: number;
  totalVesselLastInspectionUnacceptable: number;
  totalVesselLastInspectionNAN: number;
  vesselRemainingValidity90s: IVesselRemainingValidity[];
}

export interface VesselInfoByAge {
  count: number;
  data: {
    id: string;
    imo: string;
    vesselAge: number;
    vesselName: string;
    vesselType: string;
  }[];
}
export interface GetVesselGroupByAgeResponse {
  vessel0To13Year: VesselInfoByAge;
  vessel14To20Year: VesselInfoByAge;
  vessel21To50Year: VesselInfoByAge;
  vessel51To100Year: VesselInfoByAge;
}

export interface GetBlackListedVesselResponse {
  id: string;
  imoNumber: string;
  name: string;
  vesselType: VesselType;
  divisionMapping: DivisionMapping;
}
export interface GetVesselHasRestrictedResponse {
  id: string;
  imoNumber: string;
  name: string;
  vesselType: VesselType;
  divisionMapping: DivisionMapping;
}

export interface AuditChecklist {
  id: string;
  code: string;
  name: string;
  revisionDate: string;
  status: string;
  auditEntity: string;
  company: {
    id: string;
    name: string;
  };
}
export interface GetAuditChecklistOpenTaskResponse {
  totalAuditChecklistSubmitted: number;
  totalAuditChecklistReviewed: number;
  totalAuditChecklistApproved: number;
  auditChecklists: AuditChecklist[];
}

export interface LeadInspector {
  id: string;
  username: string;
}

export interface InspectionReportForm {
  id: string;
  refId: string;
  status: string;
  vessel: Vessel;
  leadInspector: LeadInspector;
  auditCompany: {
    id: string;
    name: string;
  };
  serialNumber: string;
}

export interface GetInspectionReportOpenTaskResponse {
  totalFindingSubmitted: number;
  totalFindingReviewed: number;
  totalAuditChecklistApproved: number;
  inspectionReportForms: InspectionReportForm[];
}

export interface AuditFindingForm {
  id: string;
  refNo: string;
  status: string;
  vessel: Vessel;
  leadInspector: LeadInspector;
  auditCompany: {
    id: string;
    name: string;
  };
  sNo: string;
}

export interface GetFindingFormOpenTaskResponse {
  totalFindingSubmitted: number;
  totalFindingReviewed: number;
  auditFindingForms: AuditFindingForm[];
}

export interface GetVesselRiskRatingResponse {
  vesselRiskRatingNA: number;
  vesselRiskRatingNegligible: number;
  vesselRiskRatingLow: number;
  vesselRiskRatingMedium: number;
  vesselRiskRatingHigh: number;
  vesselAverageRiskRating: number;
}
export interface GetPotentialRiskResponse {
  totalPotentialRiskNA: number;
  totalPotentialRiskNegligible: number;
  totalPotentialRiskLow: number;
  totalPotentialRiskMedium: number;
  totalPotentialRiskHigh: number;
  totalPotentialRisk: number;
}

export interface GetObservedRiskResponse {
  totalObservedRiskNA: number;
  totalObservedRiskNegligible: number;
  totalObservedRiskLow: number;
  totalObservedRiskMedium: number;
  totalObservedRiskHigh: number;
  totalObservedRisk: number;
}

export interface GetTotalNumberRiskResponse {
  potentialRisk: GetPotentialRiskResponse;
  observedRisk: GetObservedRiskResponse;
}
export interface DataCarCapNeedReviewing {
  refId: string;
  numberOfFindings: number;
  entity: string;
  cap: string;
  estimatedClosureDate: string;
  id?: string;
}
export interface GetCarCapNeedReviewing {
  data: DataCarCapNeedReviewing[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface TrendOfOutstandingCarCapData {
  companyName: string;
  numberOfOpenCar: number;
  numberOfHoldCar: number;
  numberOfPendingCar: number;
  numberOfDeniedCar: number;
}

export interface TrendOfOutstandingCarCapTotal {
  totalNumberOfOpenCar: number;
  totalNumberOfHoldCar: number;
  totalNumberOfPendingCar: number;
  totalNumberOfDeniedCar: number;
}

export interface TrendOfOutstandingCarCapResponse {
  data: TrendOfOutstandingCarCapData[];
  total: TrendOfOutstandingCarCapTotal;
}

export interface TrendOfOutstandingCarCapDetailData {
  id: string;
  refId: string;
  numberOfFindings: number;
  cap: string;
  car: string;
  capTargetEndDate: string;
  actualClosureDate: string;
  pic: string;
  entity?: string;
}

export type TrendOfOutstandingCarCapDetailResponse =
  TrendOfOutstandingCarCapDetailData[];

export interface GetUpcomingInspectionPlansResponse {
  plannedFromDate: string;
  vesselName: string;
  vesselId: string;
  vesselCode: string;
  entityType: string;
  auditCompanyId: string;
  auditCompanyCode: string;
  auditCompanyName: string;
  companyName: string;
  numberOfUpcoming: string;
  numberOfPlanning?: number;
  otherItems?: GetUpcomingInspectionPlansResponse[];
  data?: GetUpcomingInspectionPlansResponse[];
}

export interface GetUpcomingRequestByVesselResponse {
  id: string;
  refId: string;
  plannedFromDate: string;
  vessel: Vessel;
  auditCompany: {
    id: string;
    name: string;
    code: string;
  };
  leadAuditor: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export interface GetInspectionPerStatusResponse {
  numOpeningSchedule: number;
  numDisapprovedReport: number;
  numSubmittedReport: number;
  numUnder2Approval: number;
  numUnder3Approval: number;
  numUnder4Approval: number;
  numUnder5Approval: number;
  numUnder6Approval: number;
  numApprovedReport: number;
  numSentCarUnderCap: number;
  numDisapprovedCap: number;
  numSubmitCap: number;
  numApprovedCapNoVerification: number;
  numWaitingVerification: number;
  numApprovedVerification: number;
}

export interface GetInspectionPerTypeData {
  name: string;
  count: string;
}

export interface GetInspectionPerTypePerMonthData {
  timeRange: string;
  name: string;
  count: string;
}

export interface PortDetails {
  portName: string;
  total: string;
}

export interface GetNumberIncidentsPerPortResponse {
  numberOfIncidentsPerPort: PortDetails[];
  totalIncidents: number;
}
export interface GetInspectionPerPortPerStatusData
  extends GetInspectionPerStatusResponse {
  name: string;
}

export interface PotentialRiskTotal {
  potentialRisk: number;
  total: string;
}

export interface GetNumberOfIncidentsByPotentialRiskResponse {
  numberOfIncidentsByPotentialRisk: PotentialRiskTotal[];
  totalIncidents: number;
}

export interface IncidentTypeNameTotal {
  incidentTypeName: string;
  total: string;
}

export interface GetNumberOfIncidentsByTypeResponse {
  numberOfIncidentsByType: IncidentTypeNameTotal[];
  totalIncidents: number;
}

export interface GetNumberIncidentsPerPortPerDateResponse {
  totalIncident: string;
  portName: string;
  timeRange: string;
}

export interface GetNumberIncidentsPerPortPerStatusResponse {
  totalIncident: string;
  portName: string;
  reviewStatus: string;
}
export interface AuditCompany {
  id: string;
  name: string;
}

export interface PlanningRequestOpenTask {
  id: string;
  refId: string;
  plannedFromDate: string;
  plannedToDate: string;
  status: string;
  vessel?: Vessel;
  auditCompany?: AuditCompany;
  leadInspector?: LeadInspector;
}
export interface GetPlanningRequestOpenTaskResponse {
  planningSubmitted: number;
  planningApproved: number;
  planningAccepted: number;
  planningPlanned: number;
  planningRequests: PlanningRequestOpenTask[];
}
