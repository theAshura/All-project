// START_NEW_PAGE
import * as ValueManagementActions from 'pages/value-management/store/action';
// END_NEW_PAGE
import * as CompanyTypeActions from 'pages/company-type/store/action';
import * as SelfAssessmentActions from 'pages/self-assessment/store/action';
import * as IncidentsActions from 'pages/incidents/store/action';
import * as TransferTypeActions from 'pages/transfer-type/store/action';
import * as VesselSurveysClassInfoActions from 'pages/vessel-screening/store/vessel-surveys-class-info.action';
import * as CargoActions from 'pages/cargo/store/action';
import * as PlanDrawingActions from 'pages/plan-drawing/store/action';
import * as CargoTypeActions from 'pages/cargo-type/store/action';
import * as VesselOtherTechRecordsActions from 'pages/vessel-screening/store/vessel-other-tech-records.action';
import * as VesselDryDockingActions from 'pages/vessel-screening/store/vessel-dry-docking.action';
import * as VesselIncidentInvestigationActions from 'pages/vessel-screening/store/vessel-incident-investigation.action';
import * as VesselPortStateControlActions from 'pages/vessel-screening/store/vessel-port-state-control.action';
import * as VesselClassDispensationsActions from 'pages/vessel-screening/store/vessel-class-dispensations.action';
import * as VesselScreeningActions from 'pages/vessel-screening/store/action';
import * as VesselInternalInspectionActions from 'pages/vessel-screening/store/vessel-internal-inspection.action';
import * as VesselExternalInspectionActions from 'pages/vessel-screening/store/vessel-external-inspection.action';
import * as VesselInjuriesSafetyActions from 'pages/vessel-screening/store/vessel-injuries-safety.action';
import * as VesselOtherSMSActions from 'pages/vessel-screening/store/vessel-other-sms.action';
import * as authenticateActions from './authenticate/authenticate.action';
import * as roleAndPermissionActions from './role/role.action';
import * as UserManagementActions from './user/user.action';
import * as VesselTypeActions from './vessel-type/vessel-type.action';
import * as AuthorityMasterActions from './authority-master/authority-master.action';
import * as AuditTypeManagementActions from './audit-type/audit-type.action';
import * as FleetManagementActions from './fleet/fleet.action';
import * as CompanyManagementAction from './company/company.action';
import * as GroupManagementAction from './group/group.action';
import * as VesselManagementActions from './vessel/vessel.action';
import * as CharterOwnerActions from './charter-owner/charter-owner.action';
import * as AuditTimeTableActions from './audit-time-table/audit-time-table.action';
import * as PscActions from './psc-action/psc-action.action';
import * as OwnerBusinessActions from './owner-business/owner-business.action';
import * as PlanningAndDrawingsActions from './planning-and-drawings/planning-and-drawings.action';
import * as LocationActions from './location/location.action';
import * as ShipDirectResponsibleActions from './ship-direct-responsible/ship-direct-responsible.action';
import * as ShipDepartmentActions from './ship-department/ship-department.action';
import * as CategoryActions from './category/category.action';
import * as MainCategoryActions from './main-category/main-category.action';
import * as ReportOfFindingActions from './report-of-finding/report-of-finding.action';
import * as SecondCategoryActions from './second-category/second-category.action';
import * as RiskFactorActions from './risk-factor/risk-factor.action';
import * as ExternalActions from './external/external.action';
import * as TerminalActions from './terminal/terminal.action';
import * as ThirdCategoryActions from './third-category/third-category.action';
import * as TopicActions from './topic/topic.action';
import * as ShoreRankActions from './shore-rank/shore-rank.action';
import * as ShoreDepartmentActions from './shore-department/shore-department.action';
import * as CDIActions from './cdi/cdi.action';
import * as VIQActions from './viq/viq.action';
import * as ReportTemplateActions from './report-template/report-template.action';
import * as Port from './port/port.action';
import * as AuditCheckListActions from './audit-checklist/audit-checklist.action';
import * as ShipRankActions from './ship-rank/ship-rank.action';
import * as DMSActions from './dms/dms.action';
import * as InspectionMappingActions from './inspection-mapping/inspection-mapping.action';
import * as PSCDeficiencyActions from './psc-deficiency/psc-deficiency.action';
import * as AuditInspectionWorkspaceActions from './audit-inspection-workspace/audit-inspection-workspace.action';
import * as PlanningAndRequestActions from './planning-and-request/planning-and-request.action';
import * as InternalAuditReportActions from './internal-audit-report/internal-audit-report.action';
import * as DepartmentMasterActions from './department-master/department-master.action';
import * as RankMasterActions from './rank-master/rank-master.action';
import * as NatureOfFindingsActions from './nature-of-findings-master/nature-of-findings-master.action';
import * as WorkFlowActions from './work-flow/work-flow.action';
import * as DashboardActions from './dashboard/dashboard.action';
import * as DeviceControlActions from './device-control/device-control.action';
import * as AppTypePropertyActions from './app-type-property/app-type-property.action';
import * as CategoryMappingActions from './category-mapping/category-mapping.action';
import * as TemplateActions from './template/template.action';
import * as FocusRequestActions from './focus-request/focus-request.action';
import * as InspectionFollowUp from './inspection-follow-up/inspection-follow-up.action';
import * as FeatureConfigActions from './feature-config/feature-config.action';
import * as ElementMasterActions from './element-master/element-master.action';
import * as AttachmentKitActions from './attachment-kit/attachment-kit.action';
import * as StandardMasterActions from './standard-master/standard-master.action';
import * as MailManagementActions from './mail-management/mail-management.action';

import * as IncidentInvestigationActions from './incident-investigation/incident-investigation.action';
import * as SurveyClassInfoActions from './survey-class-info/survey-class-info.action';
import * as DryDockingActions from './dry-docking/dry-docking.action';
import * as InjuryMasterActions from './injury-master/injury-master.action';
import * as InjuryBodyActions from './injury-body/injury-body.action';
import * as PlansAndDrawingActions from './plans-and-drawings/plans-and-drawings.action';

import * as InspectorTimeOffActions from './inspector-time-off/inspector-time-off.action';
import * as EventTypeActions from './event-type/event-type.action';
import * as IncidentTypeActions from './incident-type/incident-type.action';
import * as IssueNoteActions from './issue-note/issue-note.action';
import * as ConditionOfClassActions from './condition-of-class/condition-of-class.action';
import * as MaintenancePerformanceActions from './maintenance-performance/maintenance-performance.action';
import * as OtherTechnicalRecordsActions from './other-technical-records/other-technical-records.action';
import * as PortStateControlActions from './port-state-control/port-state-control.action';
import * as InjuryActions from './injury/injury.action';
import * as SmsRecordActions from './sms/sms.action';
import * as VesselMaintenanceActions from '../pages/vessel-screening/store/vessel-maintenance-performance.action';
import * as VesselPlanAndDrawingActions from '../pages/vessel-screening/store/vessel-plan-and-drawing.action';
import * as SailReportInspectionInternalActions from './sail-report-inspection-internal/sail-report-inspection-internal.action';
import * as SailReportingSummaryActions from './summary-sail-reporting/summary-sail-reporting.action';
import * as VesselSummaryActions from '../pages/vessel-screening/store/vessel-summary.action';
import * as MapViewActions from '../pages/map-view/store/action';
import * as PilotTerminalFeedbackActions from '../pages/pilot-terminal-feedback/store/action';
import * as DivisionActions from '../pages/division/store/action';
import * as DivisionMappingActions from '../pages/division-mapping/store/action';
import * as CrewGroupingActions from '../pages/crew-grouping/store/action';
import * as NotificationActions from '../pages/notification/store/action';
import * as RepeatedFindingCalAction from '../pages/repeated-finding/store/action';
import * as VoyageInfoAction from '../pages/vessel-screening/store/voyageInfo-store/voyage-info.action';
import * as CountryMasterAction from './country-master/country-master.action';
import * as ModuleConfigurationAction from './module-configuration/module-configuration.action';
import * as DynamicAction from './dynamic/dynamic.action';
import * as HomePageAction from './home-page/home-page.action';
import * as WatchListAction from './watch-list/watch-list.actions';

export default {
  authenticate: authenticateActions,
  roleAndPermission: roleAndPermissionActions,
  user: UserManagementActions,
  vesselType: VesselTypeActions,
  mailManagement: MailManagementActions,
  authorityMaster: AuthorityMasterActions,
  auditType: AuditTypeManagementActions,
  fleet: FleetManagementActions,
  company: CompanyManagementAction,
  group: GroupManagementAction,
  vessel: VesselManagementActions,
  shoreRank: ShoreRankActions,
  shipDepartment: ShipDepartmentActions,
  shoreDepartment: ShoreDepartmentActions,
  cdi: CDIActions,
  location: LocationActions,
  ReportTemplate: ReportTemplateActions,
  port: Port,
  category: CategoryActions,
  mainCategory: MainCategoryActions,
  reportOfFinding: ReportOfFindingActions,
  secondCategory: SecondCategoryActions,
  riskFactor: RiskFactorActions,
  external: ExternalActions,
  terminal: TerminalActions,
  thirdCategory: ThirdCategoryActions,
  charterOwner: CharterOwnerActions,
  auditTimeTable: AuditTimeTableActions,
  pscAction: PscActions,
  ownerBusiness: OwnerBusinessActions,
  planningAndDrawings: PlanningAndDrawingsActions,
  auditCheckList: AuditCheckListActions,
  shipDirectResponsible: ShipDirectResponsibleActions,
  topic: TopicActions,
  shipRank: ShipRankActions,
  viq: VIQActions,
  dms: DMSActions,
  inspectionMapping: InspectionMappingActions,
  inspectionFollowUp: InspectionFollowUp,
  pscDeficiency: PSCDeficiencyActions,
  auditInspectionWorkspace: AuditInspectionWorkspaceActions,
  planningAndRequest: PlanningAndRequestActions,
  internalAuditReport: InternalAuditReportActions,
  departmentMaster: DepartmentMasterActions,
  rankMaster: RankMasterActions,
  natureOfFindings: NatureOfFindingsActions,
  WorkFlow: WorkFlowActions,
  AttachmentKit: AttachmentKitActions,
  dashboard: DashboardActions,
  deviceControl: DeviceControlActions,
  appTypeProperty: AppTypePropertyActions,
  categoryMapping: CategoryMappingActions,
  template: TemplateActions,
  focusRequest: FocusRequestActions,
  inspectorTimeOff: InspectorTimeOffActions,
  featureConfig: FeatureConfigActions,
  elementMaster: ElementMasterActions,
  standardMaster: StandardMasterActions,
  surveyClassInfo: SurveyClassInfoActions,
  dryDocking: DryDockingActions,
  selfAssessment: SelfAssessmentActions,
  eventType: EventTypeActions,
  incidentType: IncidentTypeActions,
  issueNote: IssueNoteActions,
  conditionOfClass: ConditionOfClassActions,
  incidentInvestigation: IncidentInvestigationActions,
  maintenancePerformance: MaintenancePerformanceActions,
  vesselMaintenancePerformance: VesselMaintenanceActions,
  vesselOtherTechRecords: VesselOtherTechRecordsActions,

  otherTechnicalRecords: OtherTechnicalRecordsActions,
  incidents: IncidentsActions,
  injury: InjuryActions,
  injuryMaster: InjuryMasterActions,
  injuryBody: InjuryBodyActions,
  // START_NEW_PAGE
  valueManagement: ValueManagementActions,
  // END_NEW_PAGE
  companyType: CompanyTypeActions,
  plansAndDrawing: PlansAndDrawingActions,
  smsRecord: SmsRecordActions,
  planDrawing: PlanDrawingActions,
  portStateControl: PortStateControlActions,
  sailReportInspectionIntenral: SailReportInspectionInternalActions,
  transferType: TransferTypeActions,
  cargo: CargoActions,
  cargoType: CargoTypeActions,
  vesselScreening: VesselScreeningActions,
  vesselInternalInspection: VesselInternalInspectionActions,
  vesselPortStateControl: VesselPortStateControlActions,
  vesselExternalInspection: VesselExternalInspectionActions,
  vesselSurveysClassInfo: VesselSurveysClassInfoActions,
  vesselDryDocking: VesselDryDockingActions,
  vesselIncidentInvestigation: VesselIncidentInvestigationActions,
  vesselInjuriesSafety: VesselInjuriesSafetyActions,
  vesselClassDispensations: VesselClassDispensationsActions,
  vesselOtherSMS: VesselOtherSMSActions,
  vesselPlanAndDrawing: VesselPlanAndDrawingActions,
  sailReportingSummary: SailReportingSummaryActions,
  vesselSummary: VesselSummaryActions,
  mapView: MapViewActions,
  pilotTerminalFeedback: PilotTerminalFeedbackActions,
  division: DivisionActions,
  divisionMapping: DivisionMappingActions,
  crewGrouping: CrewGroupingActions,
  notification: NotificationActions,
  repeatedFinding: RepeatedFindingCalAction,
  voyageInfo: VoyageInfoAction,
  countryMaster: CountryMasterAction,
  moduleConfiguration: ModuleConfigurationAction,
  dynamic: DynamicAction,
  homepage: HomePageAction,
  watchlist: WatchListAction,
};
