export const MainRouteConst = {
  AUTH: '/auth',
  APP: '',
};

export const AuthRouteConst = {
  SIGN_IN: `/login`,
  RECOVER_PASSWORD: '/recover-password',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_ROUTINE: '/reset-password-routine',
  EXPIRED_LINK: '/expired-link',
};

export const AppRouteConst = {
  HOME_PAGE: `${MainRouteConst.APP}/home-page`,
  DASHBOARD: `${MainRouteConst.APP}/dashboard`,
  DASHBOARD_MASTER: `${MainRouteConst.APP}/dashboard-master`,
  USER: `${MainRouteConst.APP}/user-management`,
  USER_CREATE: `${MainRouteConst.APP}/user-management/create`,

  ROLE: `${MainRouteConst.APP}/role-management`,
  ROLE_CREATE: `${MainRouteConst.APP}/role-management/create`,

  CHECKLIST: `${MainRouteConst.APP}/checklist-management`,

  REPORT_TEMPLATE: `${MainRouteConst.APP}/report-template-management`,
  REPORT_TEMPLATE_CREATE: `${MainRouteConst.APP}/report-template-management/create`,

  CHECKLIST_TEMPLATE_MASTER: `${MainRouteConst.APP}/checklist-template-master`,

  ROLE_AND_PERMISSION: `${MainRouteConst.APP}/role-and-permission`,
  ROLE_AND_PERMISSION_CREATE: `${MainRouteConst.APP}/role-and-permission/create`,

  AUDIT_TYPE: `${MainRouteConst.APP}/audit-type-management`,
  AUDIT_TYPE_CREATE: `${MainRouteConst.APP}/audit-type-management/create`,

  CATEGORY_MAPPING: `${MainRouteConst.APP}/category-mapping`,
  CATEGORY_MAPPING_CREATE: `${MainRouteConst.APP}/category-mapping/create`,

  VESSEL: `${MainRouteConst.APP}/vessel-management`,
  VESSEL_CREATE: `${MainRouteConst.APP}/vessel-management/create`,

  GROUP: `${MainRouteConst.APP}/group-management`,
  GROUP_CREATE: `${MainRouteConst.APP}/group-management/create`,

  VESSEL_TYPE: `${MainRouteConst.APP}/vessel-type-management`,
  VESSEL_TYPE_CREATE: `${MainRouteConst.APP}/vessel-type-management/create`,

  AUTHORITY_MASTER: `${MainRouteConst.APP}/authority-master-management`,
  AUTHORITY_MASTER_CREATE: `${MainRouteConst.APP}/authority-master-management/create`,

  FLEET: `${MainRouteConst.APP}/fleet-management`,
  FLEET_CREATE: `${MainRouteConst.APP}/fleet-management/create`,

  INSPECTOR_TIME_OFF: `${MainRouteConst.APP}/inspector-time-off-management`,
  INSPECTOR_TIME_OFF_CREATE: `${MainRouteConst.APP}/inspector-time-off-management/create`,

  COMPANY: `${MainRouteConst.APP}/company-management`,
  COMPANY_CREATE: `${MainRouteConst.APP}/company-management/create`,

  PORT: `${MainRouteConst.APP}/port-management`,
  PORT_CREATE: `${MainRouteConst.APP}/port-management/create`,

  REPEATED_FINDING: `${MainRouteConst.APP}/repeated-finding`,

  CHARTER_OWNER: `${MainRouteConst.APP}/charter-owner-management`,
  CHARTER_OWNER_CREATE: `${MainRouteConst.APP}/charter-owner-management/create`,

  PSC_ACTION: `${MainRouteConst.APP}/psc-action-management`,
  PSC_ACTION_CREATE: `${MainRouteConst.APP}/psc-action-management/create`,

  OWNER_BUSINESS: `${MainRouteConst.APP}/owner-business-management`,
  OWNER_BUSINESS_CREATE: `${MainRouteConst.APP}/owner-business-management/create`,

  AUDIT_TIME_TABLE: `${MainRouteConst.APP}/audit-time-table-management`,
  AUDIT_TIME_TABLE_CREATE: `${MainRouteConst.APP}/audit-time-table-management/create`,

  LOCATION: `${MainRouteConst.APP}/location-management`,
  LOCATION_CREATE: `${MainRouteConst.APP}/location-management/create`,

  SHIP_DIRECT_RESPONSIBLE: `${MainRouteConst.APP}/ship-direct-responsible-management`,
  SHIP_DIRECT_RESPONSIBLE_CREATE: `${MainRouteConst.APP}/ship-direct-responsible-management/create`,

  SHIP_DEPARTMENT: `${MainRouteConst.APP}/ship-department-management`,
  SHIP_DEPARTMENT_CREATE: `${MainRouteConst.APP}/ship-department-management/create`,

  CATEGORY: `${MainRouteConst.APP}/category-management`,
  CATEGORY_CREATE: `${MainRouteConst.APP}/category-management/create`,

  MAIN_CATEGORY: `${MainRouteConst.APP}/main-category-management`,
  MAIN_CATEGORY_CREATE: `${MainRouteConst.APP}/main-category-management/create`,

  MODULE_MANAGEMENT: `${MainRouteConst.APP}/module-management`,

  ELEMENT_MASTER: `${MainRouteConst.APP}/element-master`,
  ELEMENT_MASTER_CREATE: `${MainRouteConst.APP}/element-master/create`,

  SECOND_CATEGORY: `${MainRouteConst.APP}/second-category-management`,
  SECOND_CATEGORY_CREATE: `${MainRouteConst.APP}/second-category-management/create`,

  RISK_FACTOR: `${MainRouteConst.APP}/risk-factor-management`,
  RISK_FACTOR_CREATE: `${MainRouteConst.APP}/risk-factor-management/create`,

  TERMINAL: `${MainRouteConst.APP}/terminal`,
  TERMINAL_CREATE: `${MainRouteConst.APP}/terminal/create`,

  THIRD_CATEGORY: `${MainRouteConst.APP}/third-category-management`,
  THIRD_CATEGORY_CREATE: `${MainRouteConst.APP}/third-category-management/create`,

  TOPIC: `${MainRouteConst.APP}/topic-management`,
  TOPIC_CREATE: `${MainRouteConst.APP}/topic-management/create`,

  CDI: `${MainRouteConst.APP}/cdi-management`,
  CDI_CREATE: `${MainRouteConst.APP}/cdi-management/create`,

  SHORE_DEPARTMENT: `${MainRouteConst.APP}/shore-department`,
  SHORE_DEPARTMENT_CREATE: `${MainRouteConst.APP}/shore-department/create`,

  SHORE_RANK: `${MainRouteConst.APP}/shore-rank-management`,
  SHORE_RANK_CREATE: `${MainRouteConst.APP}/shore-rank-management/create`,

  AUDIT_CHECKLIST: `${MainRouteConst.APP}/audit-checklist-management`,
  AUDIT_CHECKLIST_CREATE: `${MainRouteConst.APP}/audit-checklist-management/create`,

  PLANNING_AND_REQUEST: `${MainRouteConst.APP}/planning-and-request-management`,
  PLANNING_AND_REQUEST_CREATE: `${MainRouteConst.APP}/planning-and-request-management/create`,

  PLANNING: `${MainRouteConst.APP}/planning`,
  REPORT_OF_FINDING: `${MainRouteConst.APP}/report-of-finding-management`,
  REPORT_OF_FINDING_CREATE: `${MainRouteConst.APP}/report-of-finding-management/create`,

  SHIP_RANK: `${MainRouteConst.APP}/ship-rank-management`,
  SHIP_RANK_CREATE: `${MainRouteConst.APP}/ship-rank-management/create`,

  FOCUS_REQUEST: `${MainRouteConst.APP}/focus-request-management`,
  FOCUS_REQUEST_CREATE: `${MainRouteConst.APP}/focus-request-management/create`,

  INJURY_MASTER: `${MainRouteConst.APP}/injury-master`,
  INJURY_BODY: `${MainRouteConst.APP}/injury-body`,
  // START_NEW_PAGE
  VALUE_MANAGEMENT: `${MainRouteConst.APP}/value-management`,
  // END_NEW_PAGE
  MAP_VIEW: `${MainRouteConst.APP}/map-view`,
  COMPANY_TYPE: `${MainRouteConst.APP}/company-type`,

  VIQ: `${MainRouteConst.APP}/viq`,
  VIQ_CREATE: `${MainRouteConst.APP}/viq/create`,

  DMS: `${MainRouteConst.APP}/dms`,
  DMS_CREATE: `${MainRouteConst.APP}/dms/create`,

  LOGIN: `${MainRouteConst.APP}/login`,

  MOBILE_CONFIG: `${MainRouteConst.APP}/mobile-config`,

  INCIDENT_TYPE: `${MainRouteConst.APP}/incident-type`,
  INCIDENT_TYPE_CREATE: `${MainRouteConst.APP}/incident-type/create`,

  PSC_DEFICIENCY: `${MainRouteConst.APP}/psc-deficiency`,
  PSC_DEFICIENCY_CREATE: `${MainRouteConst.APP}/psc-deficiency/create`,

  INSPECTION_MAPPING: `${MainRouteConst.APP}/inspection-mapping`,
  INSPECTION_MAPPING_CREATE: `${MainRouteConst.APP}/inspection-mapping/create`,

  AUDIT_INSPECTION_WORKSPACE: `${MainRouteConst.APP}/audit-inspection-workspace`,
  AUDIT_INSPECTION_WORKSPACE_CREATE: `${MainRouteConst.APP}/audit-inspection-workspace/create`,

  INTERNAL_AUDIT_REPORT: `${MainRouteConst.APP}/internal-audit-report`,
  INTERNAL_AUDIT_REPORT_CREATE: `${MainRouteConst.APP}/internal-audit-report/create`,

  DEPARTMENT_MASTER: `${MainRouteConst.APP}/department-master`,
  DEPARTMENT_MASTER_CREATE: `${MainRouteConst.APP}/department-master/create`,

  RANK_MASTER: `${MainRouteConst.APP}/rank-master`,
  RANK_MASTER_CREATE: `${MainRouteConst.APP}/rank-master/create`,

  NATURE_OF_FINDINGS_MASTER: `${MainRouteConst.APP}/nature-of-findings`,
  NATURE_OF_FINDINGS_MASTER_CREATE: `${MainRouteConst.APP}/nature-of-findings/create`,

  WORK_FLOW: `${MainRouteConst.APP}/work-flow`,
  WORK_FLOW_CREATE: `${MainRouteConst.APP}/work-flow/create`,

  DEVICE_CONTROL: `${MainRouteConst.APP}/device-control-manager`,

  APP_TYPE_PROPERTY: `${MainRouteConst.APP}/app-type-property`,

  FEATURE_CONFIG: `${MainRouteConst.APP}/feature-config`,

  QA_DASHBOARD: `${MainRouteConst.APP}/qa-dashboard`,

  STANDARD_MASTER: `${MainRouteConst.APP}/standard-master`,
  STANDARD_MASTER_CREATE: `${MainRouteConst.APP}/standard-master/create`,

  SAIL_GENERAL_REPORT: `${MainRouteConst.APP}/sail-general-report`,

  SAIL_GENERAL_REPORT_CREATE: `${MainRouteConst.APP}/sail-general-report/create`,

  SAIL_GENERAL_REPORT_INCIDENT: `${MainRouteConst.APP}/sail-general-report/detail?incident`,
  SAIL_GENERAL_REPORT_INCIDENT_CREATE: `${MainRouteConst.APP}/sail-general-report/detail/incident/create`,
  SAIL_GENERAL_REPORT_SAFETY_MANAGEMENT: `${MainRouteConst.APP}/sail-general-report/detail?safety-management`,
  SAIL_GENERAL_REPORT_PLANS_AND_DRAWINGS: `${MainRouteConst.APP}/sail-general-report/detail?plans-and-drawings`,
  SAIL_GENERAL_REPORT_INTERNAL_INSPECTIONS_AUDIT_CREATE: `${MainRouteConst.APP}/sail-general-report/detail/inspections/internal-inspections-audit/create`,

  SAIL_GENERAL_REPORT_INSPECTIONS_PSC: `${MainRouteConst.APP}/sail-general-report/detail?inspections#psc`,
  SAIL_GENERAL_REPORT_INSPECTIONS_PSC_CREATE: `${MainRouteConst.APP}/sail-general-report/detail/inspections-post-state-control/create`,
  SAIL_GENERAL_REPORT_OTHER_INSPECTIONS_AUDIT: `${MainRouteConst.APP}/sail-general-report/detail?inspections#other-inspections-audit`,
  SAIL_GENERAL_REPORT_INSPECTIONS_OTHER_EXTERNAL_CREATE: `${MainRouteConst.APP}/sail-general-report/detail/inspections/other-inspections-audit/create`,

  INSPECTION_FOLLOW_UP: `${MainRouteConst.APP}/inspection-follow-up`,

  SELF_ASSESSMENT: `${MainRouteConst.APP}/self-assessment`,
  SELF_ASSESSMENT_CREATE: `${MainRouteConst.APP}/self-assessment/create`,
  SELF_ASSESSMENT_DETAIL: `${MainRouteConst.APP}/self-assessment/detail`,
  SELF_ASSESSMENT_EDIT: `${MainRouteConst.APP}/self-assessment/edit`,

  EVENT_TYPE: `${MainRouteConst.APP}/event-type-management`,
  EVENT_TYPE_CREATE: `${MainRouteConst.APP}/event-type-management/create`,

  ISSUE_NOTE: `${MainRouteConst.APP}/issue-note-management`,
  ISSUE_NOTE_CREATE: `${MainRouteConst.APP}/issue-note-management/create`,

  DIVISION: `${MainRouteConst.APP}/division`,
  DIVISION_CREATE: `${MainRouteConst.APP}/division/create`,

  DIVISION_MAPPING: `${MainRouteConst.APP}/mapping-division`,
  DIVISION_MAPPING_CREATE: `${MainRouteConst.APP}/mapping-division/create`,

  ATTACHMENT_KIT: `${MainRouteConst.APP}/attachment-kit`,
  ATTACHMENT_KIT_CREATE: `${MainRouteConst.APP}/attachment-kit/create`,

  MAIL_MANAGEMENT: `${MainRouteConst.APP}/mail-management`,
  MAIL_MANAGEMENT_CREATE: `${MainRouteConst.APP}/mail-management/create`,

  TRANSFER_TYPE: `${MainRouteConst.APP}/transfer-type`,
  TRANSFER_TYPE_CREATE: `${MainRouteConst.APP}/transfer-type/create`,

  PLAN_DRAWING: `${MainRouteConst.APP}/plan-drawing`,
  CARGO: `${MainRouteConst.APP}/cargo`,
  CARGO_TYPE: `${MainRouteConst.APP}/cargo-type`,
  VESSEL_SCREENING: `${MainRouteConst.APP}/vessel-screening`,
  VESSEL_SCREENING_CREATE: `${MainRouteConst.APP}/vessel-screening/create`,

  INCIDENTS: `${MainRouteConst.APP}/incidents`,
  INCIDENTS_CREATE: `${MainRouteConst.APP}/incidents/create`,
  INCIDENTS_SUMMARY: `${MainRouteConst.APP}/summary-incidents`,

  PILOT_TERMINAL_FEEDBACK: `${MainRouteConst.APP}/pilot-terminal-feedback`,
  PILOT_TERMINAL_FEEDBACK_CREATE: `${MainRouteConst.APP}/pilot-terminal-feedback/create`,
  CREW_GROUPING: `${MainRouteConst.APP}/crew-grouping`,
  NOTIFICATION: `${MainRouteConst.APP}/notification`,
  COUNTRY: `${MainRouteConst.APP}/country-master`,
  MODULE_CONFIGURATION: `${MainRouteConst.APP}/module-configuration`,
  WATCH_LIST: `${MainRouteConst.APP}/watch-list`,

  getDetailDivisionMappingById(id = ':id') {
    return `${MainRouteConst.APP}/mapping-division/${id}`;
  },

  getDetailUserProfileById(id = ':id') {
    return `${MainRouteConst.APP}/user-profile/detail/${id}`;
  },
  getUserById(id = ':id') {
    return `${MainRouteConst.APP}/user-management/detail/${id}`;
  },
  getRoleAndPermissionById(id = ':id') {
    return `${MainRouteConst.APP}/role-management/detail/${id}`;
  },
  getAuditTypeById(id = ':id') {
    return `${MainRouteConst.APP}/audit-type-management/detail/${id}`;
  },
  getVesselTypeById(id = ':id') {
    return `${MainRouteConst.APP}/vessel-type-management/detail/${id}`;
  },
  getAuthorityMasterById(id = ':id') {
    return `${MainRouteConst.APP}/authority-master-management/detail/${id}`;
  },
  getFleetById(id = ':id') {
    return `${MainRouteConst.APP}/fleet-management/detail/${id}`;
  },
  getGroupById(id = ':id') {
    return `${MainRouteConst.APP}/group-management/detail/${id}`;
  },
  getCompanyById(id = ':id') {
    return `${MainRouteConst.APP}/company-management/detail/${id}`;
  },
  getVesselById(id = ':id') {
    return `${MainRouteConst.APP}/vessel-management/detail/${id}`;
  },
  getCDIById(id = ':id') {
    return `${MainRouteConst.APP}/cdi-management/detail/${id}`;
  },
  getCharterOwnerById(id = ':id') {
    return `${MainRouteConst.APP}/charter-owner-management/detail/${id}`;
  },
  getPscActionById(id = ':id') {
    return `${MainRouteConst.APP}/psc-action-management/detail/${id}`;
  },
  getOwnerBusinessById(id = ':id') {
    return `${MainRouteConst.APP}/owner-business-management/detail/${id}`;
  },
  getAuditTimeTableById(id = ':id') {
    return `${MainRouteConst.APP}/audit-time-table-management/detail/${id}`;
  },
  getLocationById(id = ':id') {
    return `${MainRouteConst.APP}/location-management/detail/${id}`;
  },
  getShipDirectResponsibleById(id = ':id') {
    return `${MainRouteConst.APP}/ship-direct-responsible-management/detail/${id}`;
  },
  getShipDepartmentById(id = ':id') {
    return `${MainRouteConst.APP}/ship-department-management/detail/${id}`;
  },
  getCategoryById(id = ':id') {
    return `${MainRouteConst.APP}/category-management/detail/${id}`;
  },
  getMainCategoryById(id = ':id') {
    return `${MainRouteConst.APP}/main-category-management/detail/${id}`;
  },
  getSecondCategoryById(id = ':id') {
    return `${MainRouteConst.APP}/second-category-management/detail/${id}`;
  },
  getRiskFactorById(id = ':id') {
    return `${MainRouteConst.APP}/risk-factor-management/detail/${id}`;
  },
  getTerminalById(id = ':id') {
    return `${MainRouteConst.APP}/terminal/detail/${id}`;
  },
  getThirdCategoryById(id = ':id') {
    return `${MainRouteConst.APP}/third-category-management/detail/${id}`;
  },
  getTopicById(id = ':id') {
    return `${MainRouteConst.APP}/topic-management/detail/${id}`;
  },

  getFocusRequestById(id = ':id') {
    return `${MainRouteConst.APP}/focus-request-management/detail/${id}`;
  },

  ReportTemplateDetail(id = ':id') {
    return `${MainRouteConst.APP}/report-template-management/detail/${id}`;
  },
  getShoreRankById(id = ':id') {
    return `${MainRouteConst.APP}/shore-rank-management/detail/${id}`;
  },
  shoreDepartmentDetail(id = ':id') {
    return `${MainRouteConst.APP}/shore-department/detail/${id}`;
  },
  auditCheckListDetail(id = ':id') {
    return `${MainRouteConst.APP}/audit-checklist-management/detail/${id}`;
  },
  getPortById(id = ':id') {
    return `${MainRouteConst.APP}/port-management/detail/${id}`;
  },
  getShipRankById(id = ':id') {
    return `${MainRouteConst.APP}/ship-rank-management/detail/${id}`;
  },
  getVIQById(id = ':id') {
    return `${MainRouteConst.APP}/viq/detail/${id}`;
  },
  getDMSById(id = ':id') {
    return `${MainRouteConst.APP}/dms/detail/${id}`;
  },
  getPlanningAndRequestById(id = ':id') {
    return `${MainRouteConst.APP}/planning-and-request-management/detail/${id}`;
  },
  getReportOfFindingById(id = ':id') {
    return `${MainRouteConst.APP}/report-of-finding-management/detail/${id}`;
  },
  getPSCDeficiencyById(id = ':id') {
    return `${MainRouteConst.APP}/psc-deficiency/detail/${id}`;
  },

  getInspectionMappingById(id = ':id') {
    return `${MainRouteConst.APP}/inspection-mapping/detail/${id}`;
  },

  getAuditInspectionWorkspaceById(id = ':id') {
    return `${MainRouteConst.APP}/audit-inspection-workspace/detail/${id}`;
  },

  getAuditInspectionChecklistById(id = ':id', idChecklist: ':idChecklist') {
    return `${MainRouteConst.APP}/audit-inspection-workspace/detail/${id}?checklist=${idChecklist}`;
  },

  getInternalAuditReportById(id = ':id') {
    return `${MainRouteConst.APP}/internal-audit-report/detail/${id}`;
  },

  getDepartmentMasterById(id = ':id') {
    return `${MainRouteConst.APP}/department-master/detail/${id}`;
  },

  getRankMasterById(id = ':id') {
    return `${MainRouteConst.APP}/rank-master/detail/${id}`;
  },

  getInspectorTimeOffById(id = ':id') {
    return `${MainRouteConst.APP}/inspector-time-off/detail/${id}`;
  },

  getNatureOfFindingsMasterById(id = ':id') {
    return `${MainRouteConst.APP}/nature-of-findings/detail/${id}`;
  },
  getWorkFlowById(id = ':id') {
    return `${MainRouteConst.APP}/work-flow/detail/${id}`;
  },
  getAppTypePropertyById(id = ':id') {
    return `${MainRouteConst.APP}/app-type-property/detail/${id}`;
  },

  getCategoryMappingById(id = ':id') {
    return `${MainRouteConst.APP}/category-mapping/detail/${id}`;
  },
  getElementMasterById(id = ':id') {
    return `${MainRouteConst.APP}/element-master/detail/${id}`;
  },
  getSurveyClassInfoById(id = ':id') {
    return `${MainRouteConst.APP}/survey-class-info/${id}`;
  },
  getStandardMasterById(id = ':id') {
    return `${MainRouteConst.APP}/standard-master/detail/${id}`;
  },
  getInspectionFollowUpById(id = ':id') {
    return `${MainRouteConst.APP}/inspection-follow-up/detail/${id}`;
  },

  getSelfAssessmentById(id = ':id') {
    return `${MainRouteConst.APP}/self-assessment/detail/${id}`;
  },
  getSelfAssessmentDeclarationById(id = ':id') {
    return `${MainRouteConst.APP}/self-assessment/declaration/detail/${id}`;
  },
  getEventTypeById(id = ':id') {
    return `${MainRouteConst.APP}/event-type-management/detail/${id}`;
  },
  getTransferTypeById(id = ':id') {
    return `${MainRouteConst.APP}/transfer-type/detail/${id}`;
  },
  getSailGeneralReportById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/detail/${id}`;
  },
  getSailGeneralReportIncidentById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/incident/detail`;
  },
  getCreateSailGeneralReportIncidentById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/incident/create`;
  },
  getSailGeneralReportTechnicalById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/Technical/detail/${id}`;
  },
  getIssueNoteById(id = ':id') {
    return `${MainRouteConst.APP}/issue-note-management/detail/${id}`;
  },
  getIncidentTypeById(id = ':id') {
    return `${MainRouteConst.APP}/incident-type/detail/${id}`;
  },
  getAttachmentKiteById(id = ':id') {
    return `${MainRouteConst.APP}/attachment-kit/detail/${id}`;
  },
  getMailManagementById(id = ':id') {
    return `${MainRouteConst.APP}/mail-management/detail/${id}`;
  },
  getInspectionPSCById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/inspections-post-state-control/detail`;
  },
  getCreateInspectionPSCById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/inspections-post-state-control/create`;
  },
  getExternalInspectionById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/inspections-external/detail`;
  },
  getCreateExternalInspectionById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/inspections-external/create`;
  },
  getStandardAndMatrix(id = ':id') {
    return `${MainRouteConst.APP}/self-assessment/detail/${id}?standard-and-matrix`;
  },
  getCreateSailReportInspectionInternalById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/inspections-internal/create`;
  },
  getSailReportInspectionInternalById(id = ':id') {
    return `${MainRouteConst.APP}/sail-general-report/${id}/inspections-internal/detail`;
  },
  getVesselScreeningById(id = ':id', status = ':status') {
    return `${MainRouteConst.APP}/vessel-screening/${status}/${id}`;
  },
  getVesselScreeningIncidentSafetyById(id = ':id', status = ':status') {
    return `${MainRouteConst.APP}/vessel-screening/${status}/${id}/incident`;
  },
  getVesselScreeningPSCById(id = ':id', status = ':status') {
    return `${MainRouteConst.APP}/vessel-screening/${status}/${id}/port-state-control`;
  },
  getVesselScreeningInternalById(id = ':id', status = ':status') {
    return `${MainRouteConst.APP}/vessel-screening/${status}/${id}/internal-inspection`;
  },
  getVesselScreeningExternalById(id = ':id', status = ':status') {
    return `${MainRouteConst.APP}/vessel-screening/${status}/${id}/external-inspection`;
  },

  getIncidentsById(id = ':id') {
    return `${MainRouteConst.APP}/incidents/detail/${id}`;
  },

  getVesselScreeningPilotTerminalFeedbackById(id = ':id', status = ':status') {
    return `${MainRouteConst.APP}/vessel-screening/${status}/${id}/pilot-terminal-feedback`;
  },
  getPilotTerminalFeedbackById(id = ':id', status = ':status') {
    return `${MainRouteConst.APP}/pilot-terminal-feedback/${status}/${id}`;
  },
  getVoyageInfoById(id = ':id', voyageId = ':voyageId') {
    return `${MainRouteConst.APP}/vessel-screening/view/${id}?tab=basic-info&voyageInfoId=${voyageId}`;
  },
  getModuleConfigurationDetailById(id = ':id', companyId = ':companyId') {
    return `${MainRouteConst.APP}/module-configuration/${id}/companyId=${companyId}`;
  },
  getListModuleConfigByCompanyID(id = ':id') {
    return `${MainRouteConst.APP}/module-configuration/${id}`;
  },
};
