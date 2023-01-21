import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import pages, { groups } from './pages';

const mapLocationToBreadCrumb = {
  [BREAD_CRUMB.DASHBOARD]: {
    title: 'Dashboard',
    breadCrumbs: [groups.auditInspection, pages.dashboard],
  },
  [BREAD_CRUMB.INSPECTION_DASHBOARD]: {
    title: 'Inspection Dashboard',
    breadCrumbs: [groups.auditInspection, pages.inspectionDashboard],
  },
  [BREAD_CRUMB.USER]: {
    title: 'User Management',
    breadCrumbs: [groups.UserRoles, pages.user],
  },
  [BREAD_CRUMB.USER_CREATE]: {
    title: 'Create new',
    breadCrumbs: [groups.UserRoles, pages.user, pages.newUserManagement],
  },
  [BREAD_CRUMB.USER_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.UserRoles, pages.user, pages.getUserById],
  },

  [BREAD_CRUMB.USER_PROFILE]: {
    title: 'Edit',
    breadCrumbs: [pages.getUserProfileById],
  },
  [BREAD_CRUMB.USER_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.UserRoles, pages.user, pages.editManagementDetail],
  },
  [BREAD_CRUMB.ROLE]: {
    title: 'Role And Permission',
    breadCrumbs: [groups.UserRoles, pages.roleAndPermission],
  },
  [BREAD_CRUMB.ROLE_AND_PERMISSION_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.UserRoles,
      pages.roleAndPermission,
      pages.newRoleAndPermission,
    ],
  },
  [BREAD_CRUMB.ROLE_AND_PERMISSION_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.UserRoles,
      pages.roleAndPermission,
      pages.editRoleAndPermission,
    ],
  },
  [BREAD_CRUMB.ROLE_AND_PERMISSION_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.UserRoles,
      pages.roleAndPermission,
      pages.userRoleAndPermissionDetail,
    ],
  },

  [BREAD_CRUMB.GROUP]: {
    title: 'Group Management',
    breadCrumbs: [groups.groupCompany, pages.group],
  },
  [BREAD_CRUMB.GROUP_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.groupCompany,
      pages.group,
      pages.groupManagementCreate,
    ],
  },
  [BREAD_CRUMB.GROUP_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.groupCompany, pages.group, pages.groupManagementEdit],
  },
  [BREAD_CRUMB.GROUP_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.groupCompany, pages.group, pages.getGroupById],
  },

  [BREAD_CRUMB.AUDIT_TYPE]: {
    title: 'Inspection Type',
    breadCrumbs: [groups.configuration, pages.auditType],
  },
  [BREAD_CRUMB.AUDIT_TYPE_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.auditType,
      pages.newAuditTypeManagement,
    ],
  },
  [BREAD_CRUMB.AUDIT_TYPE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.auditType,
      pages.getAuditTypeById,
    ],
  },
  [BREAD_CRUMB.AUDIT_TYPE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.auditType,
      pages.editAuditTypeManagement,
    ],
  },
  [BREAD_CRUMB.CHARTER_OWNER]: {
    title: 'Charter Owner Management',
    breadCrumbs: [groups.configuration, pages.charterOwner],
  },
  [BREAD_CRUMB.CHARTER_OWNER_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.charterOwner,
      pages.charterOwnerManagementCreate,
    ],
  },
  [BREAD_CRUMB.CHARTER_OWNER_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.charterOwner,
      pages.charterOwnerManagementDetail,
    ],
  },
  [BREAD_CRUMB.CHARTER_OWNER_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.charterOwner,
      pages.editCharterOwnerManagement,
    ],
  },
  [BREAD_CRUMB.PSC_ACTION]: {
    title: 'PSC Action',
    breadCrumbs: [groups.configuration, pages.pscAction],
  },
  [BREAD_CRUMB.PSC_ACTION_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.pscAction,
      pages.pscActionManagementCreate,
    ],
  },
  [BREAD_CRUMB.PSC_ACTION_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.pscAction,
      pages.pscActionManagementDetail,
    ],
  },
  [BREAD_CRUMB.PSC_ACTION_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.pscAction,
      pages.editPscActionManagement,
    ],
  },
  [BREAD_CRUMB.OWNER_BUSINESS]: {
    title: "Owner's Business",
    breadCrumbs: [groups.configuration, pages.ownerBusiness],
  },
  [BREAD_CRUMB.OWNER_BUSINESS_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.ownerBusiness,
      pages.ownerBusinessManagementCreate,
    ],
  },
  [BREAD_CRUMB.OWNER_BUSINESS_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.ownerBusiness,
      pages.ownerBusinessManagementDetail,
    ],
  },
  [BREAD_CRUMB.OWNER_BUSINESS_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.ownerBusiness,
      pages.editOwnerBusinessManagement,
    ],
  },
  [BREAD_CRUMB.LOCATION]: {
    title: 'Location',
    breadCrumbs: [groups.configuration, pages.location],
  },
  [BREAD_CRUMB.LOCATION_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.location,
      pages.locationManagementCreate,
    ],
  },
  [BREAD_CRUMB.LOCATION_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.location,
      pages.locationManagementDetail,
    ],
  },
  [BREAD_CRUMB.LOCATION_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.location,
      pages.editLocationManagement,
    ],
  },

  [BREAD_CRUMB.MODULE_MANAGEMENT]: {
    title: 'Module Management',
    breadCrumbs: [groups.configuration, pages.moduleManagement],
  },

  [BREAD_CRUMB.AUDIT_TIME_TABLE]: {
    title: 'Inspection Time Table Management',
    breadCrumbs: [groups.auditInspection, pages.auditTimeTable],
  },
  [BREAD_CRUMB.AUDIT_TIME_TABLE_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.auditInspection,
      pages.auditTimeTable,
      pages.auditTimeTableManagementCreate,
    ],
  },
  [BREAD_CRUMB.AUDIT_TIME_TABLE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.auditInspection,
      pages.auditTimeTable,
      pages.auditTimeTableManagementDetail,
    ],
  },
  [BREAD_CRUMB.AUDIT_TIME_TABLE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.auditInspection,
      pages.auditTimeTable,
      pages.editAuditTimeTableManagement,
    ],
  },
  [BREAD_CRUMB.SHIP_DIRECT_RESPONSIBLE]: {
    title: 'Ship Direct Responsible Management',
    breadCrumbs: [groups.configuration, pages.shipDirectResponsible],
  },
  [BREAD_CRUMB.SHIP_DIRECT_RESPONSIBLE_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.shipDirectResponsible,
      pages.shipDirectResponsibleManagementCreate,
    ],
  },
  [BREAD_CRUMB.SHIP_DIRECT_RESPONSIBLE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.shipDirectResponsible,
      pages.shipDirectResponsibleManagementDetail,
    ],
  },
  [BREAD_CRUMB.SHIP_DIRECT_RESPONSIBLE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.shipDirectResponsible,
      pages.editShipDirectResponsibleManagement,
    ],
  },
  [BREAD_CRUMB.SHIP_DEPARTMENT]: {
    title: 'Ship Department Management',
    breadCrumbs: [groups.configuration, pages.shipDepartment],
  },
  [BREAD_CRUMB.SHIP_DEPARTMENT_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.shipDepartment,
      pages.shipDepartmentManagementCreate,
    ],
  },
  [BREAD_CRUMB.SHIP_DEPARTMENT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.shipDepartment,
      pages.shipDepartmentManagementDetail,
    ],
  },
  [BREAD_CRUMB.SHIP_DEPARTMENT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.shipDepartment,
      pages.editShipDepartmentManagement,
    ],
  },
  [BREAD_CRUMB.CATEGORY]: {
    title: 'Category Management',
    breadCrumbs: [groups.configuration, pages.category],
  },
  [BREAD_CRUMB.CATEGORY_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.category,
      pages.categoryManagementCreate,
    ],
  },
  [BREAD_CRUMB.CATEGORY_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.category,
      pages.categoryManagementDetail,
    ],
  },
  [BREAD_CRUMB.CATEGORY_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.category,
      pages.editCategoryManagement,
    ],
  },
  [BREAD_CRUMB.MAIN_CATEGORY]: {
    title: 'Main Category',
    breadCrumbs: [groups.configuration, pages.mainCategory],
  },
  [BREAD_CRUMB.MAIN_CATEGORY_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.mainCategory,
      pages.mainCategoryManagementCreate,
    ],
  },
  [BREAD_CRUMB.MAIN_CATEGORY_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.mainCategory,
      pages.mainCategoryManagementDetail,
    ],
  },
  [BREAD_CRUMB.MAIN_CATEGORY_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.mainCategory,
      pages.editMainCategoryManagement,
    ],
  },
  [BREAD_CRUMB.SECOND_CATEGORY]: {
    title: 'Second Category',
    breadCrumbs: [groups.configuration, pages.secondCategory],
  },
  [BREAD_CRUMB.SECOND_CATEGORY_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.secondCategory,
      pages.secondCategoryManagementCreate,
    ],
  },
  [BREAD_CRUMB.SECOND_CATEGORY_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.secondCategory,
      pages.secondCategoryManagementDetail,
    ],
  },
  [BREAD_CRUMB.SECOND_CATEGORY_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.secondCategory,
      pages.editSecondCategoryManagement,
    ],
  },
  [BREAD_CRUMB.RISK_FACTOR]: {
    title: 'Risk Factor',
    breadCrumbs: [groups.configuration, pages.riskFactor],
  },
  [BREAD_CRUMB.RISK_FACTOR_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.riskFactor,
      pages.riskFactorManagementCreate,
    ],
  },
  [BREAD_CRUMB.RISK_FACTOR_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.riskFactor,
      pages.riskFactorManagementDetail,
    ],
  },
  [BREAD_CRUMB.RISK_FACTOR_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.riskFactor,
      pages.editRiskFactorManagement,
    ],
  },
  [BREAD_CRUMB.TERMINAL]: {
    title: 'Terminal',
    breadCrumbs: [groups.configuration, pages.terminal],
  },
  [BREAD_CRUMB.TERMINAL_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.terminal,
      pages.terminalManagementCreate,
    ],
  },
  [BREAD_CRUMB.TERMINAL_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.terminal,
      pages.terminalManagementDetail,
    ],
  },
  [BREAD_CRUMB.TERMINAL_DETAIL]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.terminal,
      pages.editTerminalManagement,
    ],
  },
  [BREAD_CRUMB.THIRD_CATEGORY]: {
    title: 'Third Category',
    breadCrumbs: [groups.configuration, pages.thirdCategory],
  },
  [BREAD_CRUMB.THIRD_CATEGORY_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.thirdCategory,
      pages.thirdCategoryManagementCreate,
    ],
  },
  [BREAD_CRUMB.THIRD_CATEGORY_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.thirdCategory,
      pages.thirdCategoryManagementDetail,
    ],
  },
  [BREAD_CRUMB.THIRD_CATEGORY_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.thirdCategory,
      pages.editThirdCategoryManagement,
    ],
  },
  [BREAD_CRUMB.TOPIC]: {
    title: 'Topic',
    breadCrumbs: [groups.configuration, pages.topic],
  },
  [BREAD_CRUMB.TOPIC_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.topic,
      pages.topicManagementCreate,
    ],
  },
  [BREAD_CRUMB.TOPIC_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.topic,
      pages.topicManagementDetail,
    ],
  },
  [BREAD_CRUMB.TOPIC_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.topic, pages.editTopicManagement],
  },
  [BREAD_CRUMB.COMPANY]: {
    title: 'Company Management',
    breadCrumbs: [groups.groupCompany, pages.companyManagement],
  },

  // START_NEW_PAGE
  [BREAD_CRUMB.VALUE_MANAGEMENT]: {
    title: 'Value Management',
    breadCrumbs: [groups.configuration, pages.valueManagement],
  },
  // END_NEW_PAGE

  [BREAD_CRUMB.REPEATED_FINDING]: {
    title: 'Repeated Finding Calculation',
    breadCrumbs: [groups.configuration, pages.repeatedFinding],
  },

  [BREAD_CRUMB.COMPANY_TYPE]: {
    title: 'Company Type',
    breadCrumbs: [groups.groupCompany, pages.companyType],
  },

  [BREAD_CRUMB.PLAN_DRAWING]: {
    title: 'Plans And Drawings',
    breadCrumbs: [groups.configuration, pages.planDrawing],
  },
  [BREAD_CRUMB.MAP_VIEW]: {
    title: 'Value Management',
    breadCrumbs: [groups.auditInspection, pages.mapView],
  },
  [BREAD_CRUMB.COMPANY_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.groupCompany,
      pages.companyManagement,
      pages.newCompanyManagement,
    ],
  },
  [BREAD_CRUMB.COMPANY_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.groupCompany,
      pages.companyManagement,
      pages.getCompanyById,
    ],
  },
  [BREAD_CRUMB.COMPANY_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.groupCompany,
      pages.companyManagement,
      pages.companyManagementEdit,
    ],
  },
  [BREAD_CRUMB.FLEET]: {
    title: 'Fleet',
    breadCrumbs: [groups.configuration, pages.fleet],
  },
  [BREAD_CRUMB.FLEET_CREATE]: {
    title: 'Create new',
    breadCrumbs: [groups.configuration, pages.fleet, pages.newfleetManagement],
  },
  [BREAD_CRUMB.FLEET_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.fleet, pages.getFleetById],
  },
  [BREAD_CRUMB.FLEET_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.fleet, pages.editFleetManagement],
  },
  [BREAD_CRUMB.VESSEL_TYPE]: {
    title: 'Vessel Type',
    breadCrumbs: [groups.configuration, pages.vesselType],
  },
  [BREAD_CRUMB.AUTHORITY_MASTER]: {
    title: 'Authority Management',
    breadCrumbs: [groups.configuration, pages.authorityMaster],
  },
  [BREAD_CRUMB.VESSEL_TYPE_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.vesselType,
      pages.vesselTypeCreate,
    ],
  },
  [BREAD_CRUMB.VESSEL_TYPE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.vesselType,
      pages.vesselTypeDetail,
    ],
  },
  [BREAD_CRUMB.VESSEL_TYPE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.vesselType, pages.vesselTypeEdit],
  },
  [BREAD_CRUMB.VESSEL]: {
    title: 'Vessel',
    breadCrumbs: [groups.configuration, pages.vessel],
  },
  [BREAD_CRUMB.VESSEL_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.vessel,
      pages.vesselManagementCreate,
    ],
  },
  [BREAD_CRUMB.VESSEL_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.vessel,
      pages.vesselManagementEdit,
    ],
  },
  [BREAD_CRUMB.VESSEL_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.vessel, pages.getVesselById],
  },

  // port
  [BREAD_CRUMB.PORT]: {
    title: 'Port',
    breadCrumbs: [groups.configuration, pages.portManagement],
  },
  [BREAD_CRUMB.PORT_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.portManagement,
      pages.portManagementCreate,
    ],
  },
  [BREAD_CRUMB.PORT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.portManagement,
      pages.portManagementEdit,
    ],
  },
  [BREAD_CRUMB.PORT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.portManagement,
      pages.portManagementDetail,
    ],
  },

  // CDI
  [BREAD_CRUMB.CDI]: {
    title: 'Inspection Type management',
    breadCrumbs: [groups.configuration, pages.cdi],
  },
  [BREAD_CRUMB.CDI_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.cdi,
      pages.newAuditTypeManagement,
    ],
  },
  [BREAD_CRUMB.CDI_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.cdi, pages.getCDIById],
  },
  [BREAD_CRUMB.CDI_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.cdi,
      pages.editAuditTypeManagement,
    ],
  },

  // shore rank
  [BREAD_CRUMB.SHORE_RANK]: {
    title: 'Shore Rank Management',
    breadCrumbs: [groups.configuration, pages.shoreRankManagement],
  },
  [BREAD_CRUMB.SHORE_RANK_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.shoreRankManagement,
      pages.shoreRankManagementCreate,
    ],
  },
  [BREAD_CRUMB.SHORE_RANK_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.shoreRankManagement,
      pages.getShoreRankById,
    ],
  },
  [BREAD_CRUMB.SHORE_RANK_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.shoreRankManagement,
      pages.shoreRankManagementEdit,
    ],
  },

  // focus request
  [BREAD_CRUMB.FOCUS_REQUEST]: {
    title: 'Focus Request Management',
    breadCrumbs: [groups.configuration, pages.focusRequest],
  },

  // injury master
  [BREAD_CRUMB.INJURY_MASTER]: {
    title: 'Injury Master',
    breadCrumbs: [groups.configuration, pages.injuryMaster],
  },

  // injury body
  [BREAD_CRUMB.INJURY_BODY]: {
    title: 'Body Parts Injury',
    breadCrumbs: [groups.configuration, pages.injuryBody],
  },

  // InspectorTimeOff
  [BREAD_CRUMB.INSPECTOR_TIME_OFF]: {
    title: 'Time Off Management',
    breadCrumbs: [groups.configuration, pages.inspectorTimeOff],
  },

  // shore department
  [BREAD_CRUMB.SHORE_DEPARTMENT]: {
    title: 'Shore Department Management',
    breadCrumbs: [groups.configuration, pages.shoreDepartment],
  },
  [BREAD_CRUMB.SHORE_DEPARTMENT_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.shoreDepartment,
      pages.shoreDepartmentCreate,
    ],
  },
  [BREAD_CRUMB.SHORE_DEPARTMENT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.shoreDepartment,
      pages.shoreDepartmentEdit,
    ],
  },
  [BREAD_CRUMB.SHORE_DEPARTMENT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.shoreDepartment,
      pages.shoreDepartmentDetail,
    ],
  },

  [BREAD_CRUMB.AUDIT_CHECKLIST]: {
    title: 'Audit Checklist',
    breadCrumbs: [groups.configuration, pages.auditCheckListTemplate],
  },
  [BREAD_CRUMB.AUDIT_CHECKLIST_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.auditCheckListTemplate,
      pages.auditCheckListTemplateCreate,
    ],
  },
  [BREAD_CRUMB.AUDIT_CHECKLIST_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.auditCheckListTemplate,
      pages.auditCheckListTemplateEdit,
    ],
  },
  [BREAD_CRUMB.AUDIT_CHECKLIST_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.auditCheckListTemplate,
      pages.auditCheckListTemplateDetail,
    ],
  },

  // planning and request
  [BREAD_CRUMB.PLANNING]: {
    title: 'Planning Management',
    breadCrumbs: [groups.auditInspection, pages.planningAndRequest],
  },
  [BREAD_CRUMB.PLANNING_AND_REQUEST_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.auditInspection,
      pages.planningAndRequest,
      pages.planningAndRequestCreate,
    ],
  },
  [BREAD_CRUMB.PLANNING_AND_REQUEST_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.auditInspection,
      pages.planningAndRequest,
      pages.planningAndRequestEdit,
    ],
  },
  [BREAD_CRUMB.PLANNING_AND_REQUEST_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.auditInspection,
      pages.planningAndRequest,
      pages.planningAndRequestDetail,
    ],
  },

  // report of finding
  [BREAD_CRUMB.REPORT_OF_FINDING]: {
    title: 'Report of findings',
    breadCrumbs: [groups.auditInspection, pages.reportOfFinding],
  },
  [BREAD_CRUMB.REPORT_OF_FINDING_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.auditInspection,
      pages.reportOfFinding,
      pages.reportOfFindingCreate,
    ],
  },
  [BREAD_CRUMB.REPORT_OF_FINDING_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.auditInspection,
      pages.reportOfFinding,
      pages.reportOfFindingEdit,
    ],
  },
  [BREAD_CRUMB.REPORT_OF_FINDING_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.auditInspection,
      pages.reportOfFinding,
      pages.reportOfFindingDetail,
    ],
  },

  // report template
  [BREAD_CRUMB.REPORT_TEMPLATE]: {
    title: 'Planning Management',
    breadCrumbs: [groups.configuration, pages.reportTemplate],
  },
  [BREAD_CRUMB.REPORT_TEMPLATE_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.reportTemplate,
      pages.newReportTemplate,
    ],
  },
  [BREAD_CRUMB.REPORT_TEMPLATE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.reportTemplate,
      pages.editReportTemplate,
    ],
  },
  [BREAD_CRUMB.REPORT_TEMPLATE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.reportTemplate,
      pages.reportTemplateDetail,
    ],
  },

  //  ship rank

  [BREAD_CRUMB.SHIP_RANK]: {
    title: 'Ship Rank Management',
    breadCrumbs: [groups.configuration, pages.shipRank],
  },
  [BREAD_CRUMB.SHIP_RANK_CREATE]: {
    title: 'Create new',
    breadCrumbs: [groups.configuration, pages.shipRank, pages.newShipRank],
  },
  [BREAD_CRUMB.SHIP_RANK_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.shipRank, pages.shipRankDetail],
  },
  [BREAD_CRUMB.SHIP_RANK_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.shipRank, pages.editShipRank],
  },

  //  ship rank

  [BREAD_CRUMB.VIQ]: {
    title: 'Vessel Inspection Questionnaires',
    breadCrumbs: [groups.configuration, pages.VIQ],
  },
  [BREAD_CRUMB.VIQ_CREATE]: {
    title: 'Create new',
    breadCrumbs: [groups.configuration, pages.VIQ, pages.newVIQ],
  },
  [BREAD_CRUMB.VIQ_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.VIQ, pages.VIQDetail],
  },
  [BREAD_CRUMB.VIQ_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.VIQ, pages.editVIQ],
  },

  //  dms
  [BREAD_CRUMB.DMS]: {
    title: 'Document Management System (DMS)',
    breadCrumbs: [groups.configuration, pages.DMS],
  },
  [BREAD_CRUMB.DMS_CREATE]: {
    title: 'Create new',
    breadCrumbs: [groups.configuration, pages.DMS, pages.DMSCreate],
  },
  [BREAD_CRUMB.DMS_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.DMS, pages.DMSDetail],
  },
  [BREAD_CRUMB.DMS_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.DMS, pages.DMSEdit],
  },
  //  Division
  [BREAD_CRUMB.DIVISION]: {
    title: 'Division',
    breadCrumbs: [groups.configuration, pages.division],
  },
  [BREAD_CRUMB.DIVISION_MAPPING]: {
    title: 'Division Mapping',
    breadCrumbs: [groups.configuration, pages.divisionMapping],
  },

  //  Attachment Kit
  [BREAD_CRUMB.ATTACHMENT_KIT]: {
    title: 'Attachment Kit',
    breadCrumbs: [groups.configuration, pages.attachmentKit],
  },
  [BREAD_CRUMB.ATTACHMENT_KIT_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.attachmentKit,
      pages.attachmentKitCreate,
    ],
  },
  [BREAD_CRUMB.ATTACHMENT_KIT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.attachmentKit,
      pages.attachmentKitDetail,
    ],
  },
  [BREAD_CRUMB.ATTACHMENT_KIT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.attachmentKit,
      pages.attachmentKitEdit,
    ],
  },

  //  Mail management
  [BREAD_CRUMB.MAIL_MANAGEMENT]: {
    title: 'Mail Management',
    breadCrumbs: [groups.configuration, pages.mailManagement],
  },
  [BREAD_CRUMB.MAIL_MANAGEMENT_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.mailManagement,
      pages.mailManagementCreate,
    ],
  },
  [BREAD_CRUMB.MAIL_MANAGEMENT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.mailManagement,
      pages.mailManagementDetail,
    ],
  },
  [BREAD_CRUMB.MAIL_MANAGEMENT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.mailManagement,
      pages.mailManagementEdit,
    ],
  },

  // mobile config
  [BREAD_CRUMB.MOBILE_CONFIG]: {
    title: 'Mobile Config',
    breadCrumbs: [groups.configuration, pages.MobileConfig],
  },

  // inspection mapping
  [BREAD_CRUMB.INSPECTION_MAPPING]: {
    title: 'Inspection Mapping',
    breadCrumbs: [groups.configuration, pages.InspectionMapping],
  },
  [BREAD_CRUMB.INSPECTION_MAPPING_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.InspectionMapping,
      pages.InspectionMappingCreate,
    ],
  },
  [BREAD_CRUMB.INSPECTION_MAPPING_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.InspectionMapping,
      pages.InspectionMappingDetail,
    ],
  },
  [BREAD_CRUMB.INSPECTION_MAPPING_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.InspectionMapping,
      pages.InspectionMappingEdit,
    ],
  },
  // psc
  [BREAD_CRUMB.PSC_DEFICIENCY]: {
    title: 'PSC Deficiency',
    breadCrumbs: [groups.configuration, pages.PSCDeficiency],
  },
  [BREAD_CRUMB.PSC_DEFICIENCY_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.PSCDeficiency,
      pages.PSCDeficiencyCreate,
    ],
  },
  [BREAD_CRUMB.PSC_DEFICIENCY_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.PSCDeficiency,
      pages.PSCDeficiencyDetail,
    ],
  },
  [BREAD_CRUMB.PSC_DEFICIENCY_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.PSCDeficiency,
      pages.PSCDeficiencyEdit,
    ],
  },

  // audit inspection workspace
  [BREAD_CRUMB.AUDIT_INSPECTION_WORKSPACE]: {
    title: 'Inspection Workspace',
    breadCrumbs: [groups.auditInspection, pages.AuditInspectionWorkspace],
  },

  [BREAD_CRUMB.AUDIT_INSPECTION_WORKSPACE_DETAIL]: {
    title: '',
    breadCrumbs: [
      groups.auditInspection,
      pages.AuditInspectionWorkspace,
      pages.AuditInspectionWorkspaceDetail,
    ],
  },

  [BREAD_CRUMB.AUDIT_INSPECTION_WORKSPACE_EDIT]: {
    title: '',
    breadCrumbs: [
      groups.auditInspection,
      pages.AuditInspectionWorkspace,
      pages.AuditInspectionWorkspaceEdit,
    ],
  },

  // internal audit report
  [BREAD_CRUMB.INTERNAL_AUDIT_REPORT]: {
    title: 'Inspection Report',
    breadCrumbs: [groups.auditInspection, pages.InternalAuditReport],
  },
  [BREAD_CRUMB.INTERNAL_AUDIT_REPORT_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.auditInspection,
      pages.InternalAuditReport,
      pages.InternalAuditReportCreate,
    ],
  },
  [BREAD_CRUMB.INTERNAL_AUDIT_REPORT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.auditInspection,
      pages.InternalAuditReport,
      pages.InternalAuditReportDetail,
    ],
  },
  [BREAD_CRUMB.INTERNAL_AUDIT_REPORT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.auditInspection,
      pages.InternalAuditReport,
      pages.InternalAuditReportEdit,
    ],
  },

  // department master
  [BREAD_CRUMB.DEPARTMENT_MASTER]: {
    title: 'Department',
    breadCrumbs: [groups.configuration, pages.DepartmentMaster],
  },
  [BREAD_CRUMB.DEPARTMENT_MASTER_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.DepartmentMaster,
      pages.DepartmentMasterCreate,
    ],
  },
  [BREAD_CRUMB.DEPARTMENT_MASTER_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.DepartmentMaster,
      pages.DepartmentMasterDetail,
    ],
  },
  [BREAD_CRUMB.DEPARTMENT_MASTER_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.DepartmentMaster,
      pages.DepartmentMasterEdit,
    ],
  },

  // rank master
  [BREAD_CRUMB.RANK_MASTER]: {
    title: 'Rank',
    breadCrumbs: [groups.configuration, pages.RankMaster],
  },
  [BREAD_CRUMB.RANK_MASTER_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.RankMaster,
      pages.RankMasterCreate,
    ],
  },
  [BREAD_CRUMB.RANK_MASTER_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.RankMaster,
      pages.RankMasterDetail,
    ],
  },
  [BREAD_CRUMB.RANK_MASTER_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.RankMaster, pages.RankMasterEdit],
  },

  // Nature of Findings
  [BREAD_CRUMB.NATURE_OF_FINDINGS_MASTER]: {
    title: 'Nature Of Findings',
    breadCrumbs: [groups.configuration, pages.NatureOfFindingsMaster],
  },
  [BREAD_CRUMB.NATURE_OF_FINDINGS_MASTER_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.NatureOfFindingsMaster,
      pages.NatureOfFindingsMasterCreate,
    ],
  },
  [BREAD_CRUMB.NATURE_OF_FINDINGS_MASTER_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.NatureOfFindingsMaster,
      pages.NatureOfFindingsMasterDetail,
    ],
  },
  [BREAD_CRUMB.NATURE_OF_FINDINGS_MASTER_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.NatureOfFindingsMaster,
      pages.NatureOfFindingsMasterEdit,
    ],
  },

  // work flow
  [BREAD_CRUMB.WORK_FLOW]: {
    title: 'WorkFlow Configuration',
    breadCrumbs: [groups.configuration, pages.WorkFlow],
  },
  [BREAD_CRUMB.WORK_FLOW_CREATE]: {
    title: 'Create new',
    breadCrumbs: [groups.configuration, pages.WorkFlow, pages.WorkFlowCreate],
  },
  [BREAD_CRUMB.WORK_FLOW_DETAIL]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.WorkFlow, pages.WorkFlowDetail],
  },
  [BREAD_CRUMB.WORK_FLOW_EDIT]: {
    title: 'Edit',
    breadCrumbs: [groups.configuration, pages.WorkFlow, pages.WorkFlowEdit],
  },

  // device control
  [BREAD_CRUMB.DEVICE_CONTROL]: {
    title: 'Device Control Manager',
    breadCrumbs: [groups.configuration, pages.DeviceControl],
  },

  // app type property
  [BREAD_CRUMB.APP_TYPE_PROPERTY]: {
    title: 'App Type Property',
    breadCrumbs: [groups.configuration, pages.AppTypeProperty],
  },
  [BREAD_CRUMB.APP_TYPE_PROPERTY_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.AppTypeProperty,
      pages.AppTypePropertyDetail,
    ],
  },
  [BREAD_CRUMB.APP_TYPE_PROPERTY_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.AppTypeProperty,
      pages.AppTypePropertyEdit,
    ],
  },

  // category mapping
  [BREAD_CRUMB.CATEGORY_MAPPING]: {
    title: 'Category Mapping',
    breadCrumbs: [groups.configuration, pages.CategoryMapping],
  },
  [BREAD_CRUMB.CATEGORY_MAPPING_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.CategoryMapping,
      pages.CategoryMappingDetail,
    ],
  },
  [BREAD_CRUMB.CATEGORY_MAPPING_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.configuration,
      pages.CategoryMapping,
      pages.CategoryMappingCreate,
    ],
  },
  [BREAD_CRUMB.CATEGORY_MAPPING_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.CategoryMapping,
      pages.CategoryMappingEdit,
    ],
  },

  // inspection follow up

  [BREAD_CRUMB.INSPECTION_FOLLOW_UP]: {
    title: 'Inspection Follow Up',
    breadCrumbs: [groups.auditInspection, pages.InspectionFollowUp],
  },
  [BREAD_CRUMB.INSPECTION_FOLLOW_UP_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.auditInspection,
      pages.InspectionFollowUp,
      pages.InspectionFollowUpDetail,
    ],
  },
  [BREAD_CRUMB.INSPECTION_FOLLOW_UP_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.auditInspection,
      pages.InspectionFollowUp,
      pages.InspectionFollowUpEdit,
    ],
  },

  // feature config
  [BREAD_CRUMB.FEATURE_CONFIG]: {
    title: 'Feature Config',
    breadCrumbs: [groups.configuration, pages.FeatureConfig],
  },

  // [BREAD_CRUMB.QA_DASHBOARD]: {
  //   title: 'QA Dashboard',
  //   breadCrumbs: [groups.qualityAssurance, pages.qaDashboard],
  // },

  // standard master

  [BREAD_CRUMB.STANDARD_MASTER]: {
    title: 'Standard Master',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.standardMaster,
    ],
  },

  [BREAD_CRUMB.STANDARD_MASTER_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.standardMaster,
      pages.standardMasterCreate,
    ],
  },
  [BREAD_CRUMB.STANDARD_MASTER_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.standardMaster,
      pages.standardMasterDetail,
    ],
  },
  [BREAD_CRUMB.STANDARD_MASTER_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.standardMaster,
      pages.standardMasterEdit,
    ],
  },

  // Self Assessment
  [BREAD_CRUMB.SELF_ASSESSMENT]: {
    title: 'Self Assessment',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.selfAssessment,
    ],
  },
  [BREAD_CRUMB.SELF_ASSESSMENT_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.selfAssessment,
      pages.selfAssessmentCreate,
    ],
  },
  [BREAD_CRUMB.SELF_ASSESSMENT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.selfAssessment,
      pages.selfAssessmentDetail,
    ],
  },
  [BREAD_CRUMB.SELF_ASSESSMENT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.selfAssessment,
      pages.selfAssessmentEdit,
    ],
  },

  [BREAD_CRUMB.ELEMENT_MASTER]: {
    title: 'Element Master',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.elementMaster,
    ],
  },
  [BREAD_CRUMB.ELEMENT_MASTER_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.elementMaster,
      pages.elementMasterCreate,
    ],
  },
  [BREAD_CRUMB.ELEMENT_MASTER_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.elementMaster,
      pages.editElementMaster,
    ],
  },
  [BREAD_CRUMB.ELEMENT_MASTER_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.selfAssessment,
      pages.elementMaster,
      pages.elementMasterDetail,
    ],
  },
  [BREAD_CRUMB.EVENT_TYPE]: {
    title: 'Event Type',
    breadCrumbs: [groups.configuration, pages.eventType],
  },
  [BREAD_CRUMB.EVENT_TYPE_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.eventType,
      pages.newEventTypeManagement,
    ],
  },
  [BREAD_CRUMB.EVENT_TYPE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.eventType,
      pages.getEventTypeById,
    ],
  },
  [BREAD_CRUMB.EVENT_TYPE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.eventType,
      pages.editEventTypeManagement,
    ],
  },

  [BREAD_CRUMB.SAIL_GENERAL_REPORT]: {
    title: 'SAIL General Report',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportCreate,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportEdit,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportDetail,
    ],
  },

  // SAIL GENERAL REPORT INCIDENT

  [BREAD_CRUMB.SAIL_GENERAL_REPORT_INCIDENT]: {
    title: 'SAIL General Report',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_INCIDENT_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportCreate,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_INCIDENT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportEdit,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_INCIDENT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportDetail,
    ],
  },

  // sail PSC

  [BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_STATE_CONTROL_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportCreate,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_STATE_CONTROL_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportEdit,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_STATE_CONTROL_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportDetail,
    ],
  },

  // sail Other Inspections

  [BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_OTHER_INSPECTIONS_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportCreate,
    ],
  },

  [BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_OTHER_INSPECTIONS_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportEdit,
    ],
  },

  [BREAD_CRUMB.SAIL_GENERAL_REPORT_PORT_OTHER_INSPECTIONS_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportDetail,
    ],
  },

  // SAIL GENERAL REPORT INPECTION AUDIT

  [BREAD_CRUMB.SAIL_GENERAL_REPORT_INTERNAL_INSPECTIONS_AUDIT_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportCreate,
    ],
  },

  [BREAD_CRUMB.SAIL_GENERAL_REPORT_INTERNAL_INPECTIONS_AUDIT_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportEdit,
    ],
  },
  [BREAD_CRUMB.SAIL_GENERAL_REPORT_INTERNAL_INPECTIONS_AUDIT_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.sailingReport,
      pages.sailGeneralReport,
      pages.sailGeneralReportDetail,
    ],
  },

  // incident type

  [BREAD_CRUMB.INCIDENT_TYPE]: {
    title: 'Incident Type',
    breadCrumbs: [groups.configuration, pages.incidentType],
  },

  // issue note
  [BREAD_CRUMB.ISSUE_NOTE]: {
    title: 'Issue Note',
    breadCrumbs: [groups.configuration, pages.issueNote],
  },
  [BREAD_CRUMB.ISSUE_NOTE_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.issueNote,
      pages.newIssueNoteManagement,
    ],
  },
  [BREAD_CRUMB.ISSUE_NOTE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.issueNote,
      pages.getIssueNoteById,
    ],
  },
  [BREAD_CRUMB.ISSUE_NOTE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.issueNote,
      pages.editIssueNoteManagement,
    ],
  },

  // transfer type
  [BREAD_CRUMB.TRANSFER_TYPE]: {
    title: 'Event Type',
    breadCrumbs: [groups.configuration, pages.transferType],
  },
  [BREAD_CRUMB.TRANSFER_TYPE_CREATE]: {
    title: 'Create new',
    breadCrumbs: [
      groups.configuration,
      pages.transferType,
      pages.transferTypeCreated,
    ],
  },
  [BREAD_CRUMB.TRANSFER_TYPE_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.transferType,
      pages.getTransferTypeById,
    ],
  },
  [BREAD_CRUMB.TRANSFER_TYPE_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.transferType,
      pages.editTransferType,
    ],
  },
  // Cargo
  [BREAD_CRUMB.CARGO]: {
    title: 'Cargo',
    breadCrumbs: [groups.configuration, pages.cargo],
  },
  // Cargo-type
  [BREAD_CRUMB.CARGO_TYPE]: {
    title: 'Cargo Type',
    breadCrumbs: [groups.configuration, pages.cargoType],
  },

  // Crew Grouping
  [BREAD_CRUMB.CREW_GROUPING]: {
    title: 'Crew Grouping',
    breadCrumbs: [groups.configuration, pages.crewGrouping],
  },

  // VESSEL SCREENING
  [BREAD_CRUMB.VESSEL_SCREENING]: {
    title: 'Vessel Screening',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.vesselScreening,
      pages.vesselScreening,
    ],
  },
  [BREAD_CRUMB.VESSEL_SCREENING_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.vesselScreening,
      pages.vesselScreening,
      pages.vesselScreeningCreate,
    ],
  },
  [BREAD_CRUMB.VESSEL_SCREENING_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.vesselScreening,
      pages.vesselScreening,
      pages.vesselScreeningDetail,
    ],
  },
  [BREAD_CRUMB.VESSEL_SCREENING_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.vesselScreening,
      pages.vesselScreening,
      pages.vesselScreeningEdit,
    ],
  },

  // INCIDENTS
  [BREAD_CRUMB.INCIDENTS]: {
    title: ' Incidents',
    breadCrumbs: [groups.qualityAssurance, groups.incidents, pages.incidents],
  },
  [BREAD_CRUMB.INCIDENTS_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.incidents,
      pages.incidents,
      pages.incidentsCreate,
    ],
  },
  [BREAD_CRUMB.INCIDENTS_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.incidents,
      pages.incidents,
      pages.incidentsDetail,
    ],
  },
  [BREAD_CRUMB.INCIDENTS_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.incidents,
      pages.incidents,
      pages.incidentsEdit,
    ],
  },

  // PILOT TERMINAL FEEDBACK
  [BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK]: {
    title: 'Pilot Feedback',
    breadCrumbs: [
      groups.qualityAssurance,
      groups.pilotTerminalFeedback,
      pages.pilotTerminalFeedback,
    ],
  },
  [BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK_CREATE]: {
    title: 'Create',
    breadCrumbs: [
      groups.qualityAssurance,
      pages.pilotTerminalFeedback,
      pages.pilotTerminalFeedbackCreate,
    ],
  },
  [BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK_DETAIL]: {
    title: 'View',
    breadCrumbs: [
      groups.qualityAssurance,
      pages.pilotTerminalFeedback,
      pages.pilotTerminalFeedbackDetail,
    ],
  },
  [BREAD_CRUMB.PILOT_TERMINAL_FEEDBACK_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.qualityAssurance,
      pages.pilotTerminalFeedback,
      pages.pilotTerminalFeedbackEdit,
    ],
  },
  [BREAD_CRUMB.COUNTRY]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.countryList],
  },
  [BREAD_CRUMB.MODULE_CONFIGURATION]: {
    title: 'View',
    breadCrumbs: [groups.configuration, pages.moduleConfigurationList],
  },
  [BREAD_CRUMB.MODULE_CONFIGURATION_VIEW]: {
    title: 'View',
    breadCrumbs: [
      groups.configuration,
      pages.moduleConfigurationList,
      pages.moduleConfigurationDetail,
    ],
  },
  [BREAD_CRUMB.MODULE_CONFIGURATION_EDIT]: {
    title: 'Edit',
    breadCrumbs: [
      groups.configuration,
      pages.moduleConfigurationList,
      pages.moduleConfigurationEdit,
    ],
  },

  [BREAD_CRUMB.MY_WATCHLIST]: {
    title: 'My Watchlist',
    breadCrumbs: [pages.watchList],
  },
};

export default mapLocationToBreadCrumb;
