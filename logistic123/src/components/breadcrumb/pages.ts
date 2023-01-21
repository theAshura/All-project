import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { AppRouteConst } from 'constants/route.const';

export const groups = {
  // group
  auditInspection: {
    name: DynamicLabelModuleName.AuditInspection,
    path: '',
  },

  groupCompany: {
    name: DynamicLabelModuleName.GroupCompany,
    path: '',
  },

  UserRoles: {
    name: DynamicLabelModuleName.UserRoles,
    path: '',
  },

  configuration: {
    name: DynamicLabelModuleName.Configuration,
    path: '',
  },

  qualityAssurance: {
    name: DynamicLabelModuleName.QuantityAssurance,
    path: '',
  },

  selfAssessment: {
    name: DynamicLabelModuleName.QuantityAssuranceSelfAssessment,
    path: '',
  },

  sailingReport: {
    name: DynamicLabelModuleName.QuantityAssuranceSailingReport,
    path: '',
  },

  vesselScreening: {
    name: DynamicLabelModuleName.QuantityAssuranceVesselScreening,
    path: '',
  },

  incidents: {
    name: DynamicLabelModuleName.QuantityAssuranceIncidents,
    path: '',
  },

  pilotTerminalFeedback: {
    name: DynamicLabelModuleName.QuantityAssurancePilotTerminalFeedback,
    path: '',
  },

  //
};

const pages = {
  dashboard: {
    name: DynamicLabelModuleName.Dashboard,
    path: AppRouteConst.DASHBOARD,
  },
  inspectionDashboard: {
    name: DynamicLabelModuleName.AuditInspectionDashboard,
    path: AppRouteConst.DASHBOARD,
  },

  user: {
    name: DynamicLabelModuleName.UserRoles,
    path: AppRouteConst.USER,
  },
  group: {
    name: DynamicLabelModuleName.GroupCompany,
    path: AppRouteConst.GROUP,
  },
  groupManagementCreate: {
    name: 'Create',
    path: '',
  },
  groupManagementEdit: {
    name: 'Edit',
    path: '',
  },
  getGroupById: {
    name: 'View',
    path: '',
  },
  newUserManagement: {
    name: 'Create',
    path: AppRouteConst.USER_CREATE,
  },
  getUserById: {
    name: 'View',
    path: '',
  },
  getUserProfileById: {
    name: 'Edit User Profile',
    path: '',
  },
  editManagementDetail: {
    name: 'Edit',
    path: '',
  },
  roleAndPermission: {
    name: DynamicLabelModuleName.UserRolesRoleAndPermission,
    path: AppRouteConst.ROLE,
  },
  newRoleAndPermission: {
    name: 'Create',
    path: AppRouteConst.USER_CREATE,
  },
  userRoleAndPermissionDetail: {
    name: 'View',
    path: '',
  },
  editRoleAndPermission: {
    name: 'Edit',
    path: '',
  },
  planningAndRequest: {
    name: DynamicLabelModuleName.AuditInspectionPar,
    path: AppRouteConst.PLANNING,
  },
  planningAndRequestCreate: {
    name: 'Create',
    path: AppRouteConst.PLANNING_AND_REQUEST_CREATE,
  },
  planningAndRequestDetail: {
    name: 'View',
    path: '',
  },
  planningAndRequestEdit: {
    name: 'Edit',
    path: '',
  },
  reportOfFinding: {
    name: DynamicLabelModuleName.AuditInspectionReportOfFinding,
    path: AppRouteConst.REPORT_OF_FINDING,
  },
  reportOfFindingCreate: {
    name: 'Create',
    path: AppRouteConst.REPORT_OF_FINDING_CREATE,
  },
  reportOfFindingDetail: {
    name: 'View',
    path: '',
  },
  reportOfFindingEdit: {
    name: 'Edit',
    path: '',
  },
  settingUp: {
    name: 'Setting Up',
    path: '',
  },
  auditType: {
    name: DynamicLabelModuleName.ConfigurationCommonAudittype,
    path: AppRouteConst.AUDIT_TYPE,
  },
  newAuditTypeManagement: {
    name: 'Create',
    path: AppRouteConst.AUDIT_TYPE_CREATE,
  },
  getAuditTypeById: {
    name: 'View',
    path: '',
  },
  editAuditTypeManagement: {
    name: 'Edit',
    path: '',
  },
  companyAndVessel: {
    name: 'Company And Vessel',
    path: '',
  },
  vesselType: {
    name: DynamicLabelModuleName.ConfigurationCommonVesseltype,
    path: AppRouteConst.VESSEL_TYPE,
  },
  authorityMaster: {
    name: DynamicLabelModuleName.ConfigurationQAAuthorityMaster,
    path: AppRouteConst.AUTHORITY_MASTER,
  },
  companyManagement: {
    name: DynamicLabelModuleName.GroupCompanyCompany,
    path: AppRouteConst.COMPANY,
  },
  charterOwner: {
    name: DynamicLabelModuleName.ConfigurationInspectionCharterOwner,
    path: AppRouteConst.CHARTER_OWNER,
  },
  charterOwnerManagementCreate: {
    name: 'Create',
    path: '',
  },
  charterOwnerManagementDetail: {
    name: 'View',
    path: '',
  },
  editCharterOwnerManagement: {
    name: 'Edit',
    path: '',
  },
  pscAction: {
    name: DynamicLabelModuleName.ConfigurationQAPSCAction,
    path: AppRouteConst.PSC_ACTION,
  },
  pscActionManagementCreate: {
    name: 'Create',
    path: '',
  },
  pscActionManagementDetail: {
    name: 'View',
    path: '',
  },
  editPscActionManagement: {
    name: 'Edit',
    path: '',
  },
  ownerBusiness: {
    name: 'Vessel Owner Business',
    path: AppRouteConst.OWNER_BUSINESS,
  },
  ownerBusinessManagementCreate: {
    name: 'Create',
    path: '',
  },
  ownerBusinessManagementDetail: {
    name: 'View',
    path: '',
  },
  editOwnerBusinessManagement: {
    name: 'Edit',
    path: '',
  },
  auditTimeTable: {
    name: DynamicLabelModuleName.AuditInspectionAuditTimeTable,
    path: AppRouteConst.AUDIT_TIME_TABLE,
  },
  auditTimeTableManagementCreate: {
    name: 'Create',
    path: '',
  },
  auditTimeTableManagementDetail: {
    name: 'View',
    path: '',
  },
  editAuditTimeTableManagement: {
    name: 'Edit',
    path: '',
  },
  location: {
    name: DynamicLabelModuleName.ConfigurationCommonLocationmaster,
    path: AppRouteConst.LOCATION,
  },
  locationManagementCreate: {
    name: 'Create',
    path: '',
  },
  locationManagementDetail: {
    name: 'View',
    path: '',
  },
  editLocationManagement: {
    name: 'Edit',
    path: '',
  },
  moduleManagement: {
    name: 'Module Management',
    path: AppRouteConst.MODULE_MANAGEMENT,
  },
  elementMaster: {
    name: DynamicLabelModuleName.QuantityAssuranceSelfAssessmentElementMaster,
    path: AppRouteConst.ELEMENT_MASTER,
  },
  elementMasterCreate: {
    name: 'Create',
    path: '',
  },
  elementMasterDetail: {
    name: 'View',
    path: '',
  },
  editElementMaster: {
    name: 'Edit',
    path: '',
  },
  shipDirectResponsible: {
    name: 'Ship Direct Responsible Management',
    path: AppRouteConst.SHIP_DIRECT_RESPONSIBLE,
  },
  shipDirectResponsibleManagementCreate: {
    name: 'Create',
    path: '',
  },
  shipDirectResponsibleManagementDetail: {
    name: 'View',
    path: '',
  },
  editShipDirectResponsibleManagement: {
    name: 'Edit',
    path: '',
  },
  shipDepartment: {
    name: 'Ship Department Management',
    path: AppRouteConst.SHIP_DEPARTMENT,
  },
  shipDepartmentManagementCreate: {
    name: 'Create',
    path: '',
  },
  shipDepartmentManagementDetail: {
    name: 'View',
    path: '',
  },
  editShipDepartmentManagement: {
    name: 'Edit',
    path: '',
  },
  category: {
    name: 'Category',
    path: AppRouteConst.CATEGORY,
  },
  categoryManagementCreate: {
    name: 'Create',
    path: '',
  },
  categoryManagementDetail: {
    name: 'View',
    path: '',
  },
  editCategoryManagement: {
    name: 'Edit',
    path: '',
  },
  mainCategory: {
    name: DynamicLabelModuleName.ConfigurationCommonMaincategory,
    path: AppRouteConst.MAIN_CATEGORY,
  },
  mainCategoryManagementCreate: {
    name: 'Create',
    path: '',
  },
  mainCategoryManagementDetail: {
    name: 'View',
    path: '',
  },
  editMainCategoryManagement: {
    name: 'Edit',
    path: '',
  },
  secondCategory: {
    name: DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
    path: AppRouteConst.SECOND_CATEGORY,
  },
  secondCategoryManagementCreate: {
    name: 'Create',
    path: '',
  },
  secondCategoryManagementDetail: {
    name: 'View',
    path: '',
  },
  editSecondCategoryManagement: {
    name: 'Edit',
    path: '',
  },
  riskFactor: {
    name: 'Risk Factor',
    path: AppRouteConst.RISK_FACTOR,
  },
  riskFactorManagementCreate: {
    name: 'Create',
    path: '',
  },
  riskFactorManagementDetail: {
    name: 'View',
    path: '',
  },
  editRiskFactorManagement: {
    name: 'Edit',
    path: '',
  },
  terminal: {
    name: DynamicLabelModuleName.ConfigurationQATerminal,
    path: AppRouteConst.TERMINAL,
  },
  terminalManagementCreate: {
    name: 'Create',
    path: '',
  },
  terminalManagementDetail: {
    name: 'View',
    path: '',
  },
  editTerminalManagement: {
    name: 'Edit',
    path: '',
  },
  thirdCategory: {
    name: DynamicLabelModuleName.ConfigurationInspectionThirdCategory,
    path: AppRouteConst.THIRD_CATEGORY,
  },
  thirdCategoryManagementCreate: {
    name: 'Create',
    path: '',
  },
  thirdCategoryManagementDetail: {
    name: 'View',
    path: '',
  },
  editThirdCategoryManagement: {
    name: 'Edit',
    path: '',
  },
  topic: {
    name: DynamicLabelModuleName.ConfigurationInspectionTopic,
    path: AppRouteConst.TOPIC,
  },
  topicManagementCreate: {
    name: 'Create',
    path: '',
  },
  topicManagementDetail: {
    name: 'View',
    path: '',
  },
  editTopicManagement: {
    name: 'Edit',
    path: '',
  },
  getCompanyById: {
    name: 'View',
    path: '',
  },
  newCompanyManagement: {
    name: 'Create',
    path: '',
  },
  companyManagementEdit: {
    name: 'Edit',
    path: '',
  },
  vesselTypeCreate: {
    name: 'Create',
    path: AppRouteConst.VESSEL_TYPE_CREATE,
  },
  vesselTypeDetail: {
    name: 'View',
    path: '',
  },
  vesselTypeEdit: {
    name: 'Edit',
    path: '',
  },
  fleet: {
    name: 'Fleet',
    path: AppRouteConst.FLEET,
  },
  newfleetManagement: {
    name: 'Create',
    path: AppRouteConst.FLEET_CREATE,
  },
  getFleetById: {
    name: 'View',
    path: '',
  },
  editFleetManagement: {
    name: 'Edit',
    path: '',
  },
  vessel: {
    name: DynamicLabelModuleName.ConfigurationCommonVessel,
    path: AppRouteConst.VESSEL,
  },
  vesselManagementCreate: {
    name: 'Create',
    path: '',
  },
  vesselManagementEdit: {
    name: 'Edit',
    path: '',
  },
  getVesselById: {
    name: 'View',
    path: '',
  },
  // port
  portManagement: {
    name: DynamicLabelModuleName.ConfigurationCommonPortmaster,
    path: AppRouteConst.PORT,
  },
  portManagementCreate: {
    name: 'Create',
    path: '',
  },
  portManagementEdit: {
    name: 'Edit',
    path: '',
  },
  portManagementDetail: {
    name: 'View',
    path: '',
  },

  // CDI
  cdi: {
    name: DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
    path: AppRouteConst.CDI,
  },
  newCdi: {
    name: 'Create',
    path: AppRouteConst.CDI_CREATE,
  },
  getCDIById: {
    name: 'View',
    path: '',
  },
  editCdi: {
    name: 'Edit',
    path: '',
  },
  reportTemplate: {
    name: DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    path: AppRouteConst.REPORT_TEMPLATE,
  },
  newReportTemplate: {
    name: 'Create',
    path: AppRouteConst.REPORT_TEMPLATE_CREATE,
  },
  reportTemplateDetail: {
    name: 'View',
    path: '',
  },
  editReportTemplate: {
    name: 'Edit',
    path: '',
  },
  shoreRankManagement: {
    name: 'Shore Rank',
    path: AppRouteConst.SHORE_RANK,
  },
  shoreRankManagementCreate: {
    name: 'Create',
    path: '',
  },
  getShoreRankById: {
    name: 'View',
    path: '',
  },
  shoreRankManagementEdit: {
    name: 'Edit',
    path: '',
  },
  // START_NEW_PAGE
  valueManagement: {
    name: DynamicLabelModuleName.ConfigurationInspectionAnswerValue,
    path: AppRouteConst.VALUE_MANAGEMENT,
  },
  // END_NEW_PAGE
  companyType: {
    name: DynamicLabelModuleName.GroupCompanyCompanyType,
    path: AppRouteConst.COMPANY_TYPE,
  },
  planDrawing: {
    name: DynamicLabelModuleName.ConfigurationQAPlansDrawingsMaster,
    path: AppRouteConst.PLAN_DRAWING,
  },
  mapView: {
    name: DynamicLabelModuleName.AuditInspectionMapView,
    path: AppRouteConst.MAP_VIEW,
  },
  shoreDepartment: {
    name: 'Shore Department',
    path: AppRouteConst.SHORE_DEPARTMENT,
  },
  shoreDepartmentCreate: {
    name: 'Create',
    path: '',
  },
  shoreDepartmentEdit: {
    name: 'Edit',
    path: '',
  },
  shoreDepartmentDetail: {
    name: 'View',
    path: '',
  },
  auditCheckListTemplate: {
    name: DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
    path: AppRouteConst.AUDIT_CHECKLIST,
  },
  auditCheckListTemplateCreate: {
    name: 'Create',
    path: AppRouteConst.AUDIT_CHECKLIST_CREATE,
  },
  auditCheckListTemplateEdit: {
    name: 'Edit',
    path: '',
  },
  auditCheckListTemplateDetail: {
    name: 'View',
    path: '',
  },
  // ship rank

  shipRank: {
    name: DynamicLabelModuleName.ConfigurationInspectionRank,
    path: AppRouteConst.SHIP_RANK,
  },
  newShipRank: {
    name: 'Create',
    path: AppRouteConst.SHIP_RANK_CREATE,
  },
  shipRankDetail: {
    name: 'View',
    path: '',
  },
  editShipRank: {
    name: 'Edit',
    path: '',
  },

  // focus request

  focusRequest: {
    name: DynamicLabelModuleName.ConfigurationInspectionFocusRequest,
    path: AppRouteConst.FOCUS_REQUEST,
  },

  // Injury Master

  injuryMaster: {
    name: DynamicLabelModuleName.ConfigurationQAInjuryMaster,
    path: AppRouteConst.INJURY_MASTER,
  },

  // Body Parts Injury

  injuryBody: {
    name: DynamicLabelModuleName.ConfigurationQAInjuryBody,
    path: AppRouteConst.INJURY_BODY,
  },

  // inspector Time Off

  inspectorTimeOff: {
    name: DynamicLabelModuleName.ConfigurationInspectionInspectorTimeOff,
    path: AppRouteConst.INSPECTOR_TIME_OFF,
  },

  // VIQ

  VIQ: {
    name: DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
    path: AppRouteConst.VIQ,
  },
  newVIQ: {
    name: 'Create',
    path: AppRouteConst.VIQ_CREATE,
  },
  VIQDetail: {
    name: 'View',
    path: '',
  },
  editVIQ: {
    name: 'Edit',
    path: '',
  },

  // DMS
  DMS: {
    name: 'Document Management System (DMS)',
    path: AppRouteConst.DMS,
  },
  DMSCreate: {
    name: 'Create',
    path: AppRouteConst.DMS_CREATE,
  },
  DMSDetail: {
    name: 'View',
    path: '',
  },
  DMSEdit: {
    name: 'Edit',
    path: '',
  },

  // division
  division: {
    name: DynamicLabelModuleName.ConfigurationCommonDivision,
    path: AppRouteConst.DIVISION,
  },
  divisionDetail: {
    name: 'View',
    path: '',
  },
  divisionEdit: {
    name: 'Edit',
    path: '',
  },

  // divisionMapping
  divisionMapping: {
    name: DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
    path: AppRouteConst.DIVISION_MAPPING,
  },
  divisionMappingDetail: {
    name: 'View',
    path: '',
  },
  divisionMappingEdit: {
    name: 'Edit',
    path: '',
  },

  // Attachment Kit
  attachmentKit: {
    name: DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
    path: AppRouteConst.ATTACHMENT_KIT,
  },
  attachmentKitCreate: {
    name: 'Create',
    path: AppRouteConst.ATTACHMENT_KIT_CREATE,
  },
  attachmentKitDetail: {
    name: 'View',
    path: '',
  },
  attachmentKitEdit: {
    name: 'Edit',
    path: '',
  },

  // Mail management
  mailManagement: {
    name: DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
    path: AppRouteConst.MAIL_MANAGEMENT,
  },
  mailManagementCreate: {
    name: 'Create',
    path: AppRouteConst.MAIL_MANAGEMENT_CREATE,
  },
  mailManagementDetail: {
    name: 'View',
    path: '',
  },
  mailManagementEdit: {
    name: 'Edit',
    path: '',
  },

  // psc
  PSCDeficiency: {
    name: DynamicLabelModuleName.ConfigurationQAPSCDeficiency,
    path: AppRouteConst.PSC_DEFICIENCY,
  },
  PSCDeficiencyCreate: {
    name: 'Create',
    path: AppRouteConst.PSC_DEFICIENCY_CREATE,
  },
  PSCDeficiencyDetail: {
    name: 'View',
    path: '',
  },
  PSCDeficiencyEdit: {
    name: 'Edit',
    path: '',
  },

  // psc
  InspectionMapping: {
    name: DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
    path: AppRouteConst.INSPECTION_MAPPING,
  },
  InspectionMappingCreate: {
    name: 'Create',
    path: AppRouteConst.INSPECTION_MAPPING_CREATE,
  },
  InspectionMappingDetail: {
    name: 'View',
    path: '',
  },
  InspectionMappingEdit: {
    name: 'Edit',
    path: '',
  },

  // mobile config
  MobileConfig: {
    name: DynamicLabelModuleName.ConfigurationInspectionMobileconfig,
    path: AppRouteConst.MOBILE_CONFIG,
  },

  // Audit Inspection Workspace
  AuditInspectionWorkspace: {
    name: DynamicLabelModuleName.AuditInspectionInspectionWorkspace,
    path: AppRouteConst.AUDIT_INSPECTION_WORKSPACE,
  },
  AuditInspectionWorkspaceCreate: {
    name: 'Create',
    path: AppRouteConst.AUDIT_INSPECTION_WORKSPACE_CREATE,
  },
  AuditInspectionWorkspaceDetail: {
    name: 'View',
    path: '',
  },
  AuditInspectionWorkspaceEdit: {
    name: 'Edit',
    path: '',
  },

  // Internal audit report
  InternalAuditReport: {
    name: DynamicLabelModuleName.AuditInspectionInspectionReport,
    path: AppRouteConst.INTERNAL_AUDIT_REPORT,
  },
  InternalAuditReportCreate: {
    name: 'Create',
    path: AppRouteConst.INTERNAL_AUDIT_REPORT_CREATE,
  },
  InternalAuditReportDetail: {
    name: 'View',
    path: '',
  },
  InternalAuditReportEdit: {
    name: 'Edit',
    path: '',
  },

  // department master
  DepartmentMaster: {
    name: DynamicLabelModuleName.ConfigurationCommonDepartment,
    path: AppRouteConst.DEPARTMENT_MASTER,
  },
  DepartmentMasterCreate: {
    name: 'Create',
    path: AppRouteConst.DEPARTMENT_MASTER_CREATE,
  },
  DepartmentMasterDetail: {
    name: 'View',
    path: '',
  },
  DepartmentMasterEdit: {
    name: 'Edit',
    path: '',
  },

  // rank master
  RankMaster: {
    name: DynamicLabelModuleName.ConfigurationInspectionRank,
    path: AppRouteConst.RANK_MASTER,
  },
  RankMasterCreate: {
    name: 'Create',
    path: AppRouteConst.RANK_MASTER_CREATE,
  },
  RankMasterDetail: {
    name: 'View',
    path: '',
  },
  RankMasterEdit: {
    name: 'Edit',
    path: '',
  },

  // Nature of Findings
  NatureOfFindingsMaster: {
    name: DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
    path: AppRouteConst.NATURE_OF_FINDINGS_MASTER,
  },
  NatureOfFindingsMasterCreate: {
    name: 'Create',
    path: AppRouteConst.NATURE_OF_FINDINGS_MASTER_CREATE,
  },
  NatureOfFindingsMasterDetail: {
    name: 'View',
    path: '',
  },
  NatureOfFindingsMasterEdit: {
    name: 'Edit',
    path: '',
  },
  // Wwork flow
  WorkFlow: {
    name: DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
    path: AppRouteConst.WORK_FLOW,
  },
  WorkFlowCreate: {
    name: 'Create',
    path: AppRouteConst.WORK_FLOW_CREATE,
  },
  WorkFlowDetail: {
    name: 'View',
    path: '',
  },
  WorkFlowEdit: {
    name: 'Edit',
    path: '',
  },

  // device control
  DeviceControl: {
    name: DynamicLabelModuleName.ConfigurationInspectionDeviceControl,
    path: AppRouteConst.DEVICE_CONTROL,
  },

  // app type property
  AppTypeProperty: {
    name: DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
    path: AppRouteConst.APP_TYPE_PROPERTY,
  },
  AppTypePropertyDetail: {
    name: 'View',
    path: '',
  },
  AppTypePropertyEdit: {
    name: 'Edit',
    path: '',
  },

  // category mapping
  CategoryMapping: {
    name: DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
    path: AppRouteConst.CATEGORY_MAPPING,
  },
  CategoryMappingDetail: {
    name: 'View',
    path: '',
  },
  CategoryMappingEdit: {
    name: 'Edit',
    path: '',
  },
  CategoryMappingCreate: {
    name: 'Create',
    path: '',
  },

  // INSPECTION FOLLOW UP
  InspectionFollowUp: {
    name: DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
    path: AppRouteConst.INSPECTION_FOLLOW_UP,
  },
  InspectionFollowUpDetail: {
    name: 'View',
    path: '',
  },
  InspectionFollowUpEdit: {
    name: 'Edit',
    path: '',
  },

  // category mapping
  FeatureConfig: {
    name: 'Feature Config',
    path: AppRouteConst.FEATURE_CONFIG,
  },

  // qa-dashboard
  // qaDashboard: {
  //   name: DynamicLabelModuleName.'QA Dashboard',
  //   path: AppRouteConst.QA_DASHBOARD,
  // },

  // standard master
  standardMaster: {
    name: DynamicLabelModuleName.QuantityAssuranceSelfAssessmentStamdardMaster,
    path: AppRouteConst.STANDARD_MASTER,
  },
  standardMasterCreate: {
    name: 'Create',
    path: '',
  },
  standardMasterEdit: {
    name: 'Edit',
    path: '',
  },
  standardMasterDetail: {
    name: 'View',
    path: '',
  },

  // Self Assessment
  selfAssessment: {
    name: DynamicLabelModuleName.QuantityAssuranceSelfAssessment,
    path: AppRouteConst.SELF_ASSESSMENT,
  },
  selfAssessmentCreate: {
    name: 'Create',
    path: '',
  },
  selfAssessmentEdit: {
    name: 'Edit',
    path: '',
  },
  selfAssessmentDetail: {
    name: 'View',
    path: '',
  },
  eventType: {
    name: DynamicLabelModuleName.ConfigurationQAEventType,
    path: AppRouteConst.EVENT_TYPE,
  },
  newEventTypeManagement: {
    name: 'Create',
    path: AppRouteConst.EVENT_TYPE_CREATE,
  },
  getEventTypeById: {
    name: 'View',
    path: '',
  },
  editEventTypeManagement: {
    name: 'Edit',
    path: '',
  },

  // Incident Type
  incidentType: {
    name: DynamicLabelModuleName.ConfigurationQAIncidentMaster,
    path: AppRouteConst.INCIDENT_TYPE,
  },

  // sailing General Report
  sailGeneralReport: {
    name: DynamicLabelModuleName.QuantityAssuranceSailingReportSailingGeneralReport,
    path: AppRouteConst.SAIL_GENERAL_REPORT,
  },

  sailGeneralReportIncident: {
    name: DynamicLabelModuleName.QuantityAssuranceIncidentsIncidents,
    path: AppRouteConst.SAIL_GENERAL_REPORT_INCIDENT,
  },

  sailGeneralReportInspection: {
    name: 'Inspections',
    path: AppRouteConst.SAIL_GENERAL_REPORT_INSPECTIONS_PSC,
  },

  sailGeneralReportExternalInspection: {
    name: 'Inspections',
    path: AppRouteConst.SAIL_GENERAL_REPORT_OTHER_INSPECTIONS_AUDIT,
  },

  sailGeneralReportPortStateControl: {
    name: 'Port State Control',
    path: AppRouteConst.SAIL_GENERAL_REPORT_INSPECTIONS_PSC,
  },

  sailGeneralReportOtherInspectionsAudit: {
    name: 'External Inspections (Except PSC/SIRE/CDI)',
    path: AppRouteConst.SAIL_GENERAL_REPORT_OTHER_INSPECTIONS_AUDIT,
  },

  sailGeneralReporInternalInspectionsAudit: {
    name: 'Internal Inspections/Audit',
    path: AppRouteConst.SAIL_GENERAL_REPORT_OTHER_INSPECTIONS_AUDIT,
  },

  sailGeneralReportCreate: {
    name: 'Create',
    path: '',
  },
  sailGeneralReportEdit: {
    name: 'Edit',
    path: '',
  },
  sailGeneralReportDetail: {
    name: 'View',
    path: '',
  },

  // Issue note
  issueNote: {
    name: DynamicLabelModuleName.ConfigurationQATechnicalIssueNote,
    path: AppRouteConst.ISSUE_NOTE,
  },
  newIssueNoteManagement: {
    name: 'Create',
    path: AppRouteConst.ISSUE_NOTE_CREATE,
  },
  getIssueNoteById: {
    name: 'View',
    path: '',
  },
  editIssueNoteManagement: {
    name: 'Edit',
    path: '',
  },

  // transfer type
  transferType: {
    name: DynamicLabelModuleName.ConfigurationQATransferType,
    path: AppRouteConst.TRANSFER_TYPE,
  },
  transferTypeCreated: {
    name: 'Create',
    path: AppRouteConst.TRANSFER_TYPE_CREATE,
  },
  getTransferTypeById: {
    name: 'View',
    path: '',
  },
  editTransferType: {
    name: 'Edit',
    path: '',
  },
  // Cargo
  cargo: {
    name: DynamicLabelModuleName.ConfigurationQACargo,
    path: AppRouteConst.CARGO,
  },

  // Master-table

  // Repeated-finding
  repeatedFinding: {
    name: DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
    path: AppRouteConst.REPEATED_FINDING,
  },

  // Cargo-type
  cargoType: {
    name: DynamicLabelModuleName.ConfigurationQACargoType,
    path: AppRouteConst.CARGO_TYPE,
  },
  // Crew Grouping
  crewGrouping: {
    name: DynamicLabelModuleName.ConfigurationCommonCrewGrouping,
    path: AppRouteConst.CREW_GROUPING,
  },

  // VESSEL SCREENING
  vesselScreening: {
    name: DynamicLabelModuleName.QuantityAssuranceVesselScreening,
    path: AppRouteConst.VESSEL_SCREENING,
  },
  vesselScreeningCreate: {
    name: 'Create',
    path: '',
  },
  vesselScreeningEdit: {
    name: 'Edit',
    path: '',
  },
  vesselScreeningDetail: {
    name: 'View',
    path: '',
  },

  // INCIDENTS
  incidents: {
    name: DynamicLabelModuleName.QuantityAssuranceIncidents,
    path: AppRouteConst.INCIDENTS,
  },
  incidentsCreate: {
    name: 'Create',
    path: '',
  },
  incidentsEdit: {
    name: 'Edit',
    path: '',
  },
  incidentsDetail: {
    name: 'View',
    path: '',
  },

  // PILOT TERMINAL FEEDBACK
  pilotTerminalFeedback: {
    name: DynamicLabelModuleName.QuantityAssurancePilotTerminalFeedbackPilotTerminalFeedback,
    path: AppRouteConst.PILOT_TERMINAL_FEEDBACK,
  },
  pilotTerminalFeedbackCreate: {
    name: 'Create',
    path: '',
  },
  pilotTerminalFeedbackEdit: {
    name: 'Edit',
    path: '',
  },
  pilotTerminalFeedbackDetail: {
    name: 'View',
    path: '',
  },
  countryList: {
    name: 'Country Master',
    path: AppRouteConst.COUNTRY,
  },
  moduleConfigurationList: {
    name: 'Module Configuration',
    path: AppRouteConst.MODULE_CONFIGURATION,
  },
  moduleConfigurationDetail: {
    name: 'View',
    path: '',
  },
  moduleConfigurationEdit: {
    name: 'Edit',
    path: '',
  },
  watchList: {
    name: 'My Watchlist',
    path: AppRouteConst.WATCH_LIST,
  },
};

export default pages;
