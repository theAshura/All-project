import { DryDockingStoreModel } from 'models/store/dry-docking/dry-docking.model';
import { AuthenticateStoreModel } from 'models/store/authenticate.model';
import { UserManagementState } from 'models/store/user/user.model';
import { VesselTypeState } from 'models/store/vessel-type/vessel-type.model';
import { AuthorityMasterState } from 'models/store/authority-master/authority-master.model';
import { AuditTypeStoreModel } from 'models/store/audit-type/audit-type.model';
import { FleetStoreModel } from 'models/store/fleet/fleet.model';
import { CompanyManagementState } from 'models/store/company/company.model';
import { GroupManagementStore } from 'models/store/group/group.model';
import { CDIStoreModel } from 'models/store/cdi/cdi.model';
import { VIQStoreModel } from 'models/store/viq/viq.model';
import { InternalAuditReportStoreModel } from 'models/store/internal-audit-report/internal-audit-report.model';
import { WorkFlowState } from 'models/store/work-flow/work-flow.model';
import { DashboardStoreModel } from 'models/store/dashboard/dashboard.model';
import { ReportTemplateStoreModel } from 'models/store/report-template/report-template.model';
import { ShipRankStoreModel } from 'models/store/ship-rank/ship-rank.model';
import { ShoreDepartmentStore } from 'models/store/shore-department/shore-department.models';
import { combineReducers } from 'redux';
import { VesselManagementState } from 'models/store/vessel/vessel.model';
import { CharterOwnerStoreModel } from 'models/store/charter-owner/charter-owner.model';
import { AuditTimeTableStoreModel } from 'models/store/audit-time-table/audit-time-table.model';
import { PscActionStoreModel } from 'models/store/psc-action/psc-action.model';
import { OwnerBusinessStoreModel } from 'models/store/owner-business/owner-business.model';
import { LocationStoreModel } from 'models/store/location/location.model';
import { ShipDirectResponsibleStoreModel } from 'models/store/ship-direct-responsible/ship-direct-responsible.model';
import { ShipDepartmentStoreModel } from 'models/store/ship-department/ship-department.model';
import { MainCategoryStoreModel } from 'models/store/main-category/main-category.model';
import { ReportOfFindingStore } from 'models/store/report-of-finding/report-of-finding.model';
import { SecondCategoryStoreModel } from 'models/store/second-category/second-category.model';
import { RiskFactorStoreModel } from 'models/store/risk-factor/risk-factor.model';
import { ExternalStoreModel } from 'models/store/external/external.model';
import { TerminalStoreModel } from 'models/store/terminal/terminal.model';
import { ThirdCategoryStoreModel } from 'models/store/third-category/third-category.model';
import { CategoryStoreModel } from 'models/store/category/category.model';
import { TopicStoreModel } from 'models/store/topic/topic.model';
import { ShoreRankState } from 'models/store/shore-rank/shore-rank.model';
import { PortState } from 'models/store/port/port.model';
import { PSCDeficiencyState } from 'models/store/psc-deficiency/psc-deficiency.model';
import { PortStateControlStoreModel } from 'models/store/port-state-control/port-state-control.model';
import { DMSStoreModel } from 'models/store/dms/dms.model';
import { RoleAndPermissionStoreModel } from 'models/store/role/role.model';
import { AuditCheckListStore } from 'models/store/audit-checklist/audit-checklist.model';
import { PlanningAndRequestStore } from 'models/store/planning-and-request/planning-and-request.model';
import { InspectionMappingStoreModel } from 'models/store/inspection-mapping/inspection-mapping.model';
import { AuditInspectionWorkspaceStoreModel } from 'models/store/audit-inspection-workspace/audit-inspection-workspace.model';
import { DepartmentMasterState } from 'models/store/department-master/department-master.model';
import { RankMasterState } from 'models/store/rank-master/rank-master.model';
import { DeviceControlState } from 'models/store/device-control/device-control.model';
import { NatureOfFindingsMasterState } from 'models/store/nature-of-findings-master/nature-of-findings-master.model';
import { AppTypePropertyState } from 'models/store/app-type-property/app-type-property.model';
import { CategoryMappingStoreModel } from 'models/store/category-mapping/category-mapping.model';
import { TemplateState } from 'models/store/template/template.model';
import { FocusRequestStoreModel } from 'models/store/focus-request/focus-request.model';
import { InspectorTimeOffStoreModel } from 'models/store/inspector-time-off/inspector-time-off.model';
import { FeatureConfigStoreModel } from 'models/store/feature-config/feature-config.model';
import { IncidentInvestigationStoreModel } from 'models/store/incident-investigation/incident-investigation.model';
import { InjuryMasterStoreModel } from 'models/store/injury-master/injury-master.model';
import { InjuryBodyStoreModel } from 'models/store/injury-body/injury-body.model';
import {
  PlanningAndDrawingsStoreModel,
  PlansAndDrawingStoreModel,
} from 'models/store/plans-and-drawings/plans-and-drawings.model';
import { ElementMasterStoreModel } from 'models/store/element-master/element-master.model';
import { InspectionFollowUpStoreModel } from 'models/store/inspection-follow-up/inspection-follow-up.model';
import { StandardMasterStoreModel } from 'models/store/standard-master/standard-master.model';
import { MailManagementStoreModel } from 'models/store/mail-management/mail-management.model';
import { SurveyClassInfoStoreModel } from 'models/store/survey-class-info/survey-class-info.model';
import { EventTypeStoreModel } from 'models/store/event-type/event-type.model';
import { IncidentTypeStoreModel } from 'models/store/incident-type/incident-type.model';
import { IssueNoteStoreModel } from 'models/store/issue-note/issue-note.model';
import { AttachmentKitStoreModel } from 'models/store/attachment-kit/attachment-kit.model';
import { InjuryModel } from 'models/store/injury/injury.model';
import { SmsStoreModel } from 'models/store/sms/sms.model';
import { IncidentStoreModel } from 'pages/incidents/utils/models/common.model';
import { PilotTerminalFeedbackStoreModel } from 'pages/pilot-terminal-feedback/utils/models/common.model';
import PilotTerminalFeedbackReducer from 'pages/pilot-terminal-feedback/store/reducer';
import IncidentsReducer from 'pages/incidents/store/reducer';

// START_NEW_PAGE
import ValueManagementStoreModel from 'pages/value-management/utils/model';
import ValueManagementReducer from 'pages/value-management/store/reducer';

// END_NEW_PAGE
import CompanyTypeStoreModel from 'pages/company-type/utils/model';
import CompanyTypeReducer from 'pages/company-type/store/reducer';
import { ConditionOfClassStoreModel } from 'models/store/condition-of-class/condition-of-class.model';
import { MaintenanceTechnicalStoreModel } from 'models/store/maintenance-performance/maintenance-performance.model';
import { OtherTechnicalRecordsStoreModel } from 'models/store/other-technical-records/other-technical-records.model';
import { SailReportInspectionInternalModel } from 'models/store/sail-report-inspection-internal/sail-report-inspection-internal.model';
import { TransferTypeStoreModel } from 'pages/transfer-type/utils/model';
import vesselMaintenancePerformanceReducer from 'pages/vessel-screening/store/vessel-maintenance-performance.reducer';
import VesselIncidentInvestigationReducer from 'pages/vessel-screening/store/vessel-incident-investigation.reducer';
import PlanDrawingReducer from 'pages/plan-drawing/store/reducer';
import CrewGroupingReducer from 'pages/crew-grouping/store/reducer';
import vesselOtherTechRecordsReducer from 'pages/vessel-screening/store/vessel-other-tech-records.reducer';
import TransferTypeReducer from 'pages/transfer-type/store/reducer';
import SelfAssessmentStoreModel from 'pages/self-assessment/utils/model';
import {
  VesselScreeningStoreModel,
  VesselMaintenanceStoreModel,
  VesselOtherTechRecordsStoreModel,
  VesselSurveysClassInfoStoreModel,
  VesselDryDockingStoreModel,
  VesselIncidentInvestigationStoreModel,
  VesselPortStateControlStoreModel,
} from 'pages/vessel-screening/utils/models/common.model';
import { RepeateFindingCalculationStoreModel } from 'pages/repeated-finding/utils/model';
import CargoStoreModel from 'pages/cargo/utils/model';
import { PlanDrawingStoreModel } from 'pages/plan-drawing/utils/model';
import CargoTypeStoreModel from 'pages/cargo-type/utils/model';
import VesselInternalInspectionStoreModel from 'pages/vessel-screening/utils/models/internal-inspection.model';
import VesselExternalInspectionStoreModel from 'pages/vessel-screening/utils/models/external-inspection.model';
import VesselInjuriesSafetyStoreModel from 'pages/vessel-screening/utils/models/injuries-safety.model';
import VesselOtherSMSStoreModel from 'pages/vessel-screening/utils/models/other-sms.model';
import VesselPlanAndDrawingStoreModel from 'pages/vessel-screening/utils/models/plan-and-drawing.model';
import { VesselClassDispensationsStoreModel } from 'pages/vessel-screening/utils/models/vessel-class-dispensations.model';
import { CrewGroupingStoreModel } from 'pages/crew-grouping/utils/model';
import { CountryMasterStoreModel } from 'models/api/country-master/country-master.model';

import VesselSurveysClassInfoReducer from 'pages/vessel-screening/store/vessel-surveys-class-info.reducer';
import VesselPortStateControlReducer from 'pages/vessel-screening/store/vessel-port-state-control.reducer';
import VesselClassDispensationsReducer from 'pages/vessel-screening/store/vessel-class-dispensations.reducer';
import VesselDryDockingReducer from 'pages/vessel-screening/store/vessel-dry-docking.reducer';
import CargoReducer from 'pages/cargo/store/reducer';
import CargoTypeReducer from 'pages/cargo-type/store/reducer';
import SelfAssessmentReducer from 'pages/self-assessment/store/reducer';
import VesselScreeningReducer from 'pages/vessel-screening/store/reducer';
import VesselInternalInspectionReducer from 'pages/vessel-screening/store/vessel-internal-inspection.reducer';
import VesselExternalInspectionReducer from 'pages/vessel-screening/store/vessel-external-inspection.reducer';
import VesselInjuriesSafetyReducer from 'pages/vessel-screening/store/vessel-injuries-safety.reducer';
import VesselOtherSMSReducer from 'pages/vessel-screening/store/vessel-other-sms.reducer';
import VesselPlanAndDrawingReducer from 'pages/vessel-screening/store/vessel-plan-and-drawing.reducer';
import SailReportingSummaryStoreModel from 'models/api/summary-sail-reporting/summary-sail-reporting.model';
import { VesselSummaryStoreModel } from 'pages/vessel-screening/utils/models/summary.model';
import VesselSummaryReducer from 'pages/vessel-screening/store/vessel-summary.reducer';
import { DynamicStoreModel } from 'models/store/dynamic/dynamic.model';
import { ModuleConfigurationModelStore } from '../models/store/module-configuration/module-configuration.model';
import auditCheckListReducer from './audit-checklist/audit-checklist.reducer';
import authenticateReducer from './authenticate/authenticate.reducer';
import roleAndPermissionReducer from './role/role.reducer';
import FocusRequestReducer from './focus-request/focus-request.reducer';
import InspectorTimeOffReducer from './inspector-time-off/inspector-time-off.reducer';

import userManagementReducer from './user/user.reducer';
import VesselTypeReducer from './vessel-type/vessel-type.reducer';
import AuthorityMasterReducer from './authority-master/authority-master.reducer';
import auditTypeManagementReducer from './audit-type/audit-type.reducer';
import fleetManagementReducer from './fleet/fleet.reducer';
import companyManagementReducer from './company/company.reducer';
import groupManagementReducer from './group/group.reducer';
import ShoreDepartmentReducer from './shore-department/shore-department.reducer';
import ShoreRankReducer from './shore-rank/shore-rank.reducer';
import VesselManagementReducer from './vessel/vessel.reducer';
import CDIReducer from './cdi/cdi.reducer';
import ReportTemplateReducer from './report-template/report-template.reducer';
import ShipRankReducer from './ship-rank/ship-rank.reducer';
import VIQReducer from './viq/viq.reducer';
import PortReducer from './port/port.reducer';
import CharterOwnerReducer from './charter-owner/charter-owner.reducer';
import AuditTimeTableReducer from './audit-time-table/audit-time-table.reducer';
import PscActionReducer from './psc-action/psc-action.reducer';
import OwnerBusinessReducer from './owner-business/owner-business.reducer';
import PlanningAndDrawingsReducer from './planning-and-drawings/planning-and-drawings.reducer';
import LocationReducer from './location/location.reducer';
import ShipDirectResponsibleReducer from './ship-direct-responsible/ship-direct-responsible.reducer';
import ShipDepartmentReducer from './ship-department/ship-department.reducer';
import CategoryReducer from './category/category.reducer';
import MainCategoryReducer from './main-category/main-category.reducer';
import ReportOfFindingReducer from './report-of-finding/report-of-finding.reducer';
import SecondCategoryReducer from './second-category/second-category.reducer';
import RiskFactorReducer from './risk-factor/risk-factor.reducer';
import ExternalReducer from './external/external.reducer';
import TerminalReducer from './terminal/terminal.reducer';
import ThirdCategoryReducer from './third-category/third-category.reducer';
import TopicReducer from './topic/topic.reducer';
import DMSReducer from './dms/dms.reducer';
import InspectionMappingReducer from './inspection-mapping/inspection-mapping.reducer';
import pscDeficiencyReducer from './psc-deficiency/psc-deficiency.reducer';
import AuditInspectionWorkspaceReducer from './audit-inspection-workspace/audit-inspection-workspace.reducer';
import planningAndRequestReducer from './planning-and-request/planning-and-request.reducer';
import InternalAuditReportReducer from './internal-audit-report/internal-audit-report.reducer';
import DepartmentMasterReducer from './department-master/department-master.reducer';
import RankMasterReducer from './rank-master/rank-master.reducer';
import NatureOfFindingsReducer from './nature-of-findings-master/nature-of-findings-master.reducer';
import WorkFlowReducer from './work-flow/work-flow.reducer';
import dashboardReducer from './dashboard/dashboard.reducer';
import deviceControlReducer from './device-control/device-control.reducer';
import appTypePropertyReducer from './app-type-property/app-type-property.reducer';
import CategoryMappingReducer from './category-mapping/category-mapping.reducer';
import TemplateReducer from './template/template.reducer';
import inspectionFollowUpReducer from './inspection-follow-up/inspection-follow-up.reducer';
import voyageInfoReducer from '../pages/vessel-screening/store/voyageInfo-store/voyage-info.reducer';

import FeatureConfigReducer from './feature-config/feature-config.reducer';
import ElementMasterReducer from './element-master/element-master.reducer';
import StandardMasterReducer from './standard-master/standard-master.reducer';
import IncidentInvestigationReducer from './incident-investigation/incident-investigation.reducer';
import MailManagementReducer from './mail-management/mail-management.reducer';
import InjuryMasterReducer from './injury-master/injury-master.reducer';
import InjuryBodyReducer from './injury-body/injury-body.reducer';

import SurveyClassInfoReducer from './survey-class-info/survey-class-info.reducer';
import DryDockingReducer from './dry-docking/dry-docking.reducer';
import EventTypeReducer from './event-type/event-type.reducer';
import IncidentTypeReducer from './incident-type/incident-type.reducer';
import issueNoteReducer from './issue-note/issue-note.reducer';
import conditionOfClassReducer from './condition-of-class/condition-of-class.reducer';
import MaintenanceTechnicalReducer from './maintenance-performance/maintenance-performance.reducer';
import OtherTechnicalRecordsReducer from './other-technical-records/other-technical-records.reducer';
import InjuryReducer from './injury/injury.reducer';
import SmsReducer from './sms/sms.reducer';
import AttachmentKitReducer from './attachment-kit/attachment-kit.reducer';
import PlansAndDrawingReducer from './plans-and-drawings/plans-and-drawings.reducer';
import PortStateControlReducer from './port-state-control/port-state-control.reducer';
import SailReportInspectionInternalReducer from './sail-report-inspection-internal/sail-report-inspection-internal.reducer';
import SailReportingSummaryReducer from './summary-sail-reporting/summary-sail-reporting.reducer';
import MapViewReducer from '../pages/map-view/store/reducer';
import MapViewStore from '../pages/map-view/utils/model';
import DivisionReducer from '../pages/division/store/reducer';
import DivisionMappingReducer from '../pages/division-mapping/store/reducer';
import DivisionStore from '../pages/division/utils/model';
import DivisionMappingStore from '../pages/division-mapping/utils/model';
import NotificationStore from '../pages/notification/utils/model';
import NotificationReducer from '../pages/notification/store/reducer';
import RFCReducer from '../pages/repeated-finding/store/reducer';
import CountryMasterReducer from './country-master/country-master.reducer';
import HomepageReducer from './home-page/home-page.reducer';
import ModuleConfigurationReducer from './module-configuration/module-configuration.reducer';
import DynamicReducer from './dynamic/dynamic.reducer';
import WatchListReducer from './watch-list/watch-list.reducer';

export interface State {
  repeatedFindingCal: RepeateFindingCalculationStoreModel;
  authenticate: AuthenticateStoreModel;
  roleAndPermission: RoleAndPermissionStoreModel;
  user: UserManagementState;
  vesselType: VesselTypeState;
  authorityMaster: AuthorityMasterState;
  auditType: AuditTypeStoreModel;
  fleet: FleetStoreModel;
  companyManagement: CompanyManagementState;
  group: GroupManagementStore;
  vessel: VesselManagementState;
  mailManagement: MailManagementStoreModel;
  shoreRank: ShoreRankState;
  charterOwner: CharterOwnerStoreModel;
  auditTimeTable: AuditTimeTableStoreModel;
  pscAction: PscActionStoreModel;
  ownerBusiness: OwnerBusinessStoreModel;
  shipDepartment: ShipDepartmentStoreModel;
  category: CategoryStoreModel;
  mainCategory: MainCategoryStoreModel;
  reportOfFinding: ReportOfFindingStore;
  secondCategory: SecondCategoryStoreModel;
  riskFactor: RiskFactorStoreModel;
  external: ExternalStoreModel;
  terminal: TerminalStoreModel;
  thirdCategory: ThirdCategoryStoreModel;
  topic: TopicStoreModel;
  shipDirectResponsible: ShipDirectResponsibleStoreModel;
  shoreDepartment: ShoreDepartmentStore;
  cdi: CDIStoreModel;
  ReportTemplate: ReportTemplateStoreModel;
  port: PortState;
  location: LocationStoreModel;
  auditCheckList: AuditCheckListStore;
  shipRank: ShipRankStoreModel;
  viq: VIQStoreModel;
  dms: DMSStoreModel;
  inspectionMapping: InspectionMappingStoreModel;
  pscDeficiency: PSCDeficiencyState;
  auditInspectionWorkspace: AuditInspectionWorkspaceStoreModel;
  planningAndRequest: PlanningAndRequestStore;
  planningAndDrawings: PlanningAndDrawingsStoreModel;
  internalAuditReport: InternalAuditReportStoreModel;
  departmentMaster: DepartmentMasterState;
  rankMaster: RankMasterState;
  natureOfFindingsMaster: NatureOfFindingsMasterState;
  workFlow: WorkFlowState;
  inspectionFollowUp: InspectionFollowUpStoreModel;
  dashboard: DashboardStoreModel;
  deviceControl: DeviceControlState;
  appTypeProperty: AppTypePropertyState;
  categoryMapping: CategoryMappingStoreModel;
  template: TemplateState;
  attachmentKit: AttachmentKitStoreModel;
  focusRequest: FocusRequestStoreModel;
  inspectorTimeOff: InspectorTimeOffStoreModel;
  featureConfig: FeatureConfigStoreModel;
  elementMaster: ElementMasterStoreModel;
  standardMaster: StandardMasterStoreModel;
  surveyClassInfo: SurveyClassInfoStoreModel;
  dryDocking: DryDockingStoreModel;
  selfAssessment: SelfAssessmentStoreModel;
  eventType: EventTypeStoreModel;
  incidentType: IncidentTypeStoreModel;
  issueNote: IssueNoteStoreModel;
  conditionOfClass: ConditionOfClassStoreModel;
  incidentInvestigation: IncidentInvestigationStoreModel;
  maintenancePerformance: MaintenanceTechnicalStoreModel;
  otherTechnicalRecords: OtherTechnicalRecordsStoreModel;
  injury: InjuryModel;
  injuryMaster: InjuryMasterStoreModel;
  injuryBody: InjuryBodyStoreModel;
  plansAndDrawing: PlansAndDrawingStoreModel;
  smsRecord: SmsStoreModel;
  portStateControl: PortStateControlStoreModel;
  sailReportInspectionInternal: SailReportInspectionInternalModel;
  transferType: TransferTypeStoreModel;
  // START_NEW_PAGE
  valueManagement: ValueManagementStoreModel;
  // END_NEW_PAGE
  companyType: CompanyTypeStoreModel;
  vesselScreening: VesselScreeningStoreModel;
  vesselIncidentInvestigation: VesselIncidentInvestigationStoreModel;
  vesselMaintenancePerformance: VesselMaintenanceStoreModel;
  vesselOtherTechRecords: VesselOtherTechRecordsStoreModel;
  vesselSurveysClassInfo: VesselSurveysClassInfoStoreModel;
  vesselPortStateControl: VesselPortStateControlStoreModel;
  vesselInternalInspection: VesselInternalInspectionStoreModel;
  vesselExternalInspection: VesselExternalInspectionStoreModel;
  vesselClassDispensations: VesselClassDispensationsStoreModel;
  vesselDryDocking: VesselDryDockingStoreModel;
  cargo: CargoStoreModel;
  cargoType: CargoTypeStoreModel;
  vesselInjuriesSafety: VesselInjuriesSafetyStoreModel;
  vesselOtherSMS: VesselOtherSMSStoreModel;
  vesselPlanAndDrawing: VesselPlanAndDrawingStoreModel;
  incidents: IncidentStoreModel;
  sailReportingSummary: SailReportingSummaryStoreModel;
  vesselSummary: VesselSummaryStoreModel;
  mapView: MapViewStore;
  division: DivisionStore;
  divisionMapping: DivisionMappingStore;
  planDrawing: PlanDrawingStoreModel;
  pilotTerminalFeedback: PilotTerminalFeedbackStoreModel;
  crewGrouping: CrewGroupingStoreModel;
  notification: NotificationStore;
  countryMaster: CountryMasterStoreModel;
  moduleConfiguration: ModuleConfigurationModelStore;
  dynamic: DynamicStoreModel;
}

const rootReducer = combineReducers<State>({
  authenticate: authenticateReducer,
  roleAndPermission: roleAndPermissionReducer,
  user: userManagementReducer,
  vesselType: VesselTypeReducer,
  authorityMaster: AuthorityMasterReducer,
  auditType: auditTypeManagementReducer,
  fleet: fleetManagementReducer,
  companyManagement: companyManagementReducer,
  group: groupManagementReducer,
  vessel: VesselManagementReducer,
  shoreRank: ShoreRankReducer,
  charterOwner: CharterOwnerReducer,
  auditTimeTable: AuditTimeTableReducer,
  pscAction: PscActionReducer,
  ownerBusiness: OwnerBusinessReducer,
  planningAndDrawings: PlanningAndDrawingsReducer,
  shipDepartment: ShipDepartmentReducer,
  auditCheckList: auditCheckListReducer,
  category: CategoryReducer,
  mainCategory: MainCategoryReducer,
  reportOfFinding: ReportOfFindingReducer,
  secondCategory: SecondCategoryReducer,
  riskFactor: RiskFactorReducer,
  external: ExternalReducer,
  terminal: TerminalReducer,
  thirdCategory: ThirdCategoryReducer,
  topic: TopicReducer,
  shoreDepartment: ShoreDepartmentReducer,
  cdi: CDIReducer,
  shipDirectResponsible: ShipDirectResponsibleReducer,
  ReportTemplate: ReportTemplateReducer,
  port: PortReducer,
  location: LocationReducer,
  shipRank: ShipRankReducer,
  viq: VIQReducer,
  mailManagement: MailManagementReducer,
  dms: DMSReducer,
  attachmentKit: AttachmentKitReducer,
  inspectionMapping: InspectionMappingReducer,
  pscDeficiency: pscDeficiencyReducer,
  auditInspectionWorkspace: AuditInspectionWorkspaceReducer,
  planningAndRequest: planningAndRequestReducer,
  internalAuditReport: InternalAuditReportReducer,
  departmentMaster: DepartmentMasterReducer,
  rankMaster: RankMasterReducer,
  natureOfFindingsMaster: NatureOfFindingsReducer,
  workFlow: WorkFlowReducer,
  dashboard: dashboardReducer,
  deviceControl: deviceControlReducer,
  appTypeProperty: appTypePropertyReducer,
  categoryMapping: CategoryMappingReducer,
  template: TemplateReducer,
  focusRequest: FocusRequestReducer,
  inspectorTimeOff: InspectorTimeOffReducer,
  inspectionFollowUp: inspectionFollowUpReducer,
  featureConfig: FeatureConfigReducer,
  elementMaster: ElementMasterReducer,
  standardMaster: StandardMasterReducer,
  surveyClassInfo: SurveyClassInfoReducer,
  dryDocking: DryDockingReducer,
  selfAssessment: SelfAssessmentReducer,
  eventType: EventTypeReducer,
  incidentType: IncidentTypeReducer,
  issueNote: issueNoteReducer,
  conditionOfClass: conditionOfClassReducer,
  incidentInvestigation: IncidentInvestigationReducer,
  maintenancePerformance: MaintenanceTechnicalReducer,
  otherTechnicalRecords: OtherTechnicalRecordsReducer,
  injury: InjuryReducer,
  injuryMaster: InjuryMasterReducer,
  plansAndDrawing: PlansAndDrawingReducer,
  injuryBody: InjuryBodyReducer,
  smsRecord: SmsReducer,
  // START_NEW_PAGE
  valueManagement: ValueManagementReducer,
  // END_NEW_PAGE
  companyType: CompanyTypeReducer,
  portStateControl: PortStateControlReducer,
  sailReportInspectionInternal: SailReportInspectionInternalReducer,
  transferType: TransferTypeReducer,
  cargo: CargoReducer,
  vesselClassDispensations: VesselClassDispensationsReducer,
  incidents: IncidentsReducer,

  cargoType: CargoTypeReducer,
  vesselScreening: VesselScreeningReducer,
  vesselIncidentInvestigation: VesselIncidentInvestigationReducer,
  vesselInternalInspection: VesselInternalInspectionReducer,
  vesselPortStateControl: VesselPortStateControlReducer,
  vesselExternalInspection: VesselExternalInspectionReducer,
  vesselMaintenancePerformance: vesselMaintenancePerformanceReducer,
  vesselOtherTechRecords: vesselOtherTechRecordsReducer,
  vesselSurveysClassInfo: VesselSurveysClassInfoReducer,
  vesselDryDocking: VesselDryDockingReducer,
  voyageInfo: voyageInfoReducer,
  vesselInjuriesSafety: VesselInjuriesSafetyReducer,
  vesselOtherSMS: VesselOtherSMSReducer,
  vesselPlanAndDrawing: VesselPlanAndDrawingReducer,
  sailReportingSummary: SailReportingSummaryReducer,
  vesselSummary: VesselSummaryReducer,
  mapView: MapViewReducer,
  division: DivisionReducer,
  divisionMapping: DivisionMappingReducer,
  planDrawing: PlanDrawingReducer,
  pilotTerminalFeedback: PilotTerminalFeedbackReducer,
  crewGrouping: CrewGroupingReducer,
  notification: NotificationReducer,
  repeatedFindingCal: RFCReducer,
  countryMaster: CountryMasterReducer,
  homepage: HomepageReducer,
  moduleConfiguration: ModuleConfigurationReducer,
  dynamic: DynamicReducer,
  watchList: WatchListReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
