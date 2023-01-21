import { AppRouteConst } from 'constants/route.const';
/* eslint-disable no-unused-vars */
export const ROLES_SCOPE = ['SuperAdmin', 'Admin', 'User']; // Only add in bottom, NOT Fix order

export enum RoleScope {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  User = 'User',
}

export const FIXED_ROLE_NAME = {
  INSPECTOR: 'Inspector',
  INSPECTOR_INTERNAL: 'Inspector (Internal)',
  INSPECTOR_EXTERNAL: 'Inspector (External)',
  AUDITEE: 'Auditee',
  PILOT: 'Pilot',
  OPERATOR_DOCHOLDER: 'Operator / DOC Holder',
};

export const LIST_INSPECTORS = [
  FIXED_ROLE_NAME.INSPECTOR,
  FIXED_ROLE_NAME.INSPECTOR_INTERNAL,
  FIXED_ROLE_NAME.INSPECTOR_EXTERNAL,
];

export const ROLES = ['SuperAdmin', 'Admin', 'Auditor', 'Auditee'];

export enum Features {
  AUDIT_INSPECTION = 'Audit & Inspection',
  GROUP_COMPANY = 'Group & Company',
  USER_ROLE = 'User & Roles',
  CONFIGURATION = 'Configuration',
  QUALITY_ASSURANCE = 'Quality Assurance',
  MASTER_DASHBOARD = 'Dashboard',
  HOME_PAGE = 'Homepage',
}

export enum SubFeatures {
  // homepage
  HOME_PAGE = 'Homepage',
  // Dashboard Master
  VIEW_DASHBOARD = 'Dashboard',

  // ============ Start User and Role ============
  ROLE_AND_PERMISSION = 'Role and permission',
  USER = 'User',

  // ============ Start User and Role ============

  // ============ Start Group Company ============
  COMPANY_TYPE = 'Company Type',
  COMPANY = 'Company',
  GROUP_MASTER = 'Group master',
  // ============ End Group Company ============

  // ============ Start Audit & Inspection ============
  PLANNING_AND_REQUEST = 'Planning & request',
  AUDIT_INSPECTION_WORKSPACE = 'Audit Inspection Workspace',
  REPORT_OF_FINDING = 'Report of Findings',
  INTERNAL_AUDIT_REPORT = 'Internal Audit Report',
  MAP_VIEW = 'Map view',
  AUDIT_TIME_TABLE = 'Audit Time Table',
  INSPECTION_FOLLOW_UP = 'Inspection Follow Up',
  // ============ End Audit & Inspection ============

  // ============ Start Quality Assurance ============
  QA_DASHBOARD = 'Dashboard',
  SELF_ASSESSMENT_SUB_FEATURE = 'Self-Assessment',
  STANDARD_MASTER = 'Self-Assessment::Standard Master',
  ELEMENT_MASTER = 'Self-Assessment::Element Master',
  SELF_ASSESSMENT = 'Self-Assessment::Self-Assessment',

  SAILING_REPORT = 'Sailing Report',
  SAIL_GENERAL_REPORT = 'Sailing Report::Sailing General Report',

  INCIDENTS_SUB_FEATURE = 'Incidents',
  INCIDENTS_SUMMARY = 'Incidents::Summary',
  INCIDENTS = 'Incidents::Incidents',

  VESSEL_SCREENING_SUB_FEATURE = 'Vessel Screening',
  VESSEL_SCREENING = 'Vessel Screening::Vessel Screening',

  PILOT_TERMINAL_FEEDBACK_SUB_FEATURE = 'Pilot/Terminal Feedback',
  PILOT_TERMINAL_FEEDBACK = 'Pilot/Terminal Feedback::Pilot/Terminal Feedback',

  // ============ End Quality Assurance ============

  // ============ Start Configuration ============
  // Configuration::Common
  CONFIGURATION_COMMON_SUB_FEATURES = 'Common',
  DIVISION = 'Common::Division',
  CREW_GROUPING = 'Common::Crew Grouping',
  DEPARTMENT_MASTER = 'Common::Department',
  DIVISION_MAPPING = 'Common::Division Mapping',
  AUDIT_TYPE = 'Common::Audit type',
  LOCATION_MASTER = 'Common::Location master',
  MAIN_CATEGORY = 'Common::Main category',
  PORT_MASTER = 'Common::Port master',
  VESSEL = 'Common::Vessel',
  VIQ = 'Common::Vessel inspection questionnaire',
  VESSEL_TYPE = 'Common::Vessel type',
  WORKFLOW_CONFIGURATION = 'Common::Workflow configuration',

  // Configuration::Inspection
  CONFIGURATION_INSPECTION_SUB_FEATURES = 'Inspection',
  APP_TYPE_PROPERTY = 'Inspection::App Type Property',
  ATTACHMENT_KIT = 'Inspection::Attachment Kit',
  CATEGORY_MAPPING = 'Inspection::Category mapping',
  CHARTER_OWNER = 'Inspection::Charter/Owner',
  CDI = 'Inspection::Chemical Distribution Institute',
  DEVICE_CONTROL = 'Inspection::Device Control',
  DMS = 'Inspection::DMS',
  FLEET = 'Inspection::Fleet',
  FOCUS_REQUEST = 'Inspection::Focus request',
  MAIL_MANAGEMENT = 'Inspection::Mail Template',
  MOBILE_CONFIG = 'Inspection::Mobile config',
  NATURE_OF_FINDINGS_MASTER = 'Inspection::Nature of Findings',
  RANK_MASTER = 'Inspection::Rank',
  SECOND_CATEGORY = 'Inspection::Second category',
  THIRD_CATEGORY = 'Inspection::Third category',
  INSPECTOR_TIME_OFF = 'Inspection::Inspector time off',
  TOPIC = 'Inspection::Topic',
  REPEATED_FINDING = 'Inspection::Repeated Finding',
  REPORT_TEMPLATE = 'Inspection::Report template master',
  AUDIT_CHECKLIST = 'Inspection::Audit Checklist',
  INSPECTION_MAPPING = 'Inspection::Inspection Mapping',

  // START_NEW_PAGE
  ANSWER_VALUE = 'Inspection::Answer Value',
  // END_NEW_PAGE

  // Configuration::QA
  CONFIGURATION_QA_SUB_FEATURES = 'QA',
  AUTHORITY_MASTER = 'QA::Authority master',
  CARGO = 'QA::Cargo',
  CARGO_TYPE = 'QA::Cargo Type',
  EVENT_TYPE = 'QA::Event Type',
  INCIDENT_TYPE = 'QA::Incident Master',
  INJURY_BODY = 'QA::Injury Body',
  INJURY_MASTER = 'QA::Injury Master',
  ISSUE_NOTE = 'QA::Technical Issue Note',
  PLAN_DRAWING = 'QA::Plans Drawings Master',
  PSC_ACTION = 'QA::PSC Action',
  PSC_DEFICIENCY = 'QA::PSC Deficiency',
  RISK_FACTOR = 'QA::Risk factor',
  TERMINAL = 'QA::Terminal',
  TRANSFER_TYPE = 'QA::Transfer Type',
  VESSEL_OWNER_BUSINESS = 'QA::Vessel Owner Business',
  // ============ End Configuration ============

  // AUDIT_INSPECTION = 'Audit Inspection Workspace',
  // VISIT_REPORT = 'Visit Report',
  // SHIP_DEPARTMENT = 'Ship department',
  // SHIP_RANK = 'Ship rank',
  // SHIP_DIRECT_RESPONSIBLE = 'Ship direct responsible',
  // SHORE_RANK = 'Shore rank',
  // SHORE_DEPARTMENT = 'Shore department',
  MODULE_MANAGEMENT = 'Module management',
  // FEATURE_CONFIG = 'Feature config',
}

export enum ActionTypeEnum {
  CREATE = 'Create',
  DELETE = 'Delete',
  EXPORT = 'Export',
  UPDATE = 'Update',
  VIEW = 'View',
  EXECUTE = 'Execute',
  EMAIL = 'Email',
}

export const ROLE_AND_PERMISSION_WITH_LINKS = [
  {
    name: `${Features.AUDIT_INSPECTION}::${SubFeatures.MAP_VIEW}`,
    link: AppRouteConst.MAP_VIEW,
  },
  {
    name: `${Features.AUDIT_INSPECTION}::${SubFeatures.PLANNING_AND_REQUEST}`,
    link: AppRouteConst.PLANNING_AND_REQUEST,
  },
  {
    name: `${Features.AUDIT_INSPECTION}::${SubFeatures.AUDIT_TIME_TABLE}`,
    link: AppRouteConst.AUDIT_TIME_TABLE,
  },
  {
    name: `${Features.AUDIT_INSPECTION}::${SubFeatures.AUDIT_INSPECTION_WORKSPACE}`,
    link: AppRouteConst.AUDIT_INSPECTION_WORKSPACE,
  },
  {
    name: `${Features.AUDIT_INSPECTION}::${SubFeatures.REPORT_OF_FINDING}`,
    link: AppRouteConst.REPORT_OF_FINDING,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.REPORT_TEMPLATE}`,
    link: AppRouteConst.REPORT_TEMPLATE,
  },
  {
    name: `${Features.AUDIT_INSPECTION}::${SubFeatures.INTERNAL_AUDIT_REPORT}`,
    link: AppRouteConst.INTERNAL_AUDIT_REPORT,
  },
  {
    name: `${Features.AUDIT_INSPECTION}::${SubFeatures.INSPECTION_FOLLOW_UP}`,
    link: AppRouteConst.INSPECTION_FOLLOW_UP,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.QA_DASHBOARD}`,
    link: AppRouteConst.QA_DASHBOARD,
  },

  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.STANDARD_MASTER}`,
    link: AppRouteConst.STANDARD_MASTER,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.ELEMENT_MASTER}`,
    link: AppRouteConst.ELEMENT_MASTER,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.SELF_ASSESSMENT}`,
    link: AppRouteConst.SELF_ASSESSMENT,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.SAIL_GENERAL_REPORT}`,
    link: AppRouteConst.SAIL_GENERAL_REPORT,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.INCIDENTS_SUMMARY}`,
    link: AppRouteConst.INCIDENTS_SUMMARY,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.PILOT_TERMINAL_FEEDBACK}`,
    link: AppRouteConst.PILOT_TERMINAL_FEEDBACK,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.INCIDENTS}`,
    link: AppRouteConst.INCIDENTS,
  },
  {
    name: `${Features.QUALITY_ASSURANCE}::${SubFeatures.VESSEL_SCREENING}`,
    link: AppRouteConst.VESSEL_SCREENING,
  },
  {
    name: `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY_TYPE}`,
    link: AppRouteConst.COMPANY_TYPE,
  },
  {
    name: `${Features.GROUP_COMPANY}::${SubFeatures.COMPANY}`,
    link: AppRouteConst.COMPANY,
  },
  {
    name: `${Features.USER_ROLE}::${SubFeatures.USER}`,
    link: AppRouteConst.USER,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.APP_TYPE_PROPERTY}`,
    link: AppRouteConst.APP_TYPE_PROPERTY,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.ATTACHMENT_KIT}`,
    link: AppRouteConst.ATTACHMENT_KIT,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.AUTHORITY_MASTER}`,
    link: AppRouteConst.AUTHORITY_MASTER,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.INJURY_BODY}`,
    link: AppRouteConst.INJURY_BODY,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.CARGO}`,
    link: AppRouteConst.CARGO,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.CARGO_TYPE}`,
    link: AppRouteConst.CARGO_TYPE,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.CATEGORY_MAPPING}`,
    link: AppRouteConst.CATEGORY_MAPPING,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.CHARTER_OWNER}`,
    link: AppRouteConst.CHARTER_OWNER,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.CDI}`,
    link: AppRouteConst.CDI,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.CREW_GROUPING}`,
    link: AppRouteConst.CREW_GROUPING,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.DIVISION}`,
    link: AppRouteConst.DIVISION,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.DIVISION_MAPPING}`,
    link: AppRouteConst.DIVISION_MAPPING,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.DEPARTMENT_MASTER}`,
    link: AppRouteConst.DEPARTMENT_MASTER,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.DEVICE_CONTROL}`,
    link: AppRouteConst.DEVICE_CONTROL,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.AUDIT_CHECKLIST}`,
    link: AppRouteConst.AUDIT_CHECKLIST,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.INSPECTION_MAPPING}`,
    link: AppRouteConst.INSPECTION_MAPPING,
  },
  // {
  //   name: `${Features.CONFIGURATION}::${SubFeatures.DMS}`,
  //   link: AppRouteConst.DMS,
  // },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.EVENT_TYPE}`,
    link: AppRouteConst.EVENT_TYPE,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.FOCUS_REQUEST}`,
    link: AppRouteConst.FOCUS_REQUEST,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.INJURY_MASTER}`,
    link: AppRouteConst.INJURY_MASTER,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.AUDIT_TYPE}`,
    link: AppRouteConst.AUDIT_TYPE,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.ISSUE_NOTE}`,
    link: AppRouteConst.ISSUE_NOTE,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.LOCATION_MASTER}`,
    link: AppRouteConst.LOCATION,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.MAIL_MANAGEMENT}`,
    link: AppRouteConst.MAIL_MANAGEMENT,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.MAIN_CATEGORY}`,
    link: AppRouteConst.MAIN_CATEGORY,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.MOBILE_CONFIG}`,
    link: AppRouteConst.MOBILE_CONFIG,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.NATURE_OF_FINDINGS_MASTER}`,
    link: AppRouteConst.NATURE_OF_FINDINGS_MASTER,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.PLAN_DRAWING}`,
    link: AppRouteConst.PLAN_DRAWING,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.PSC_ACTION}`,
    link: AppRouteConst.PSC_ACTION,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.PSC_DEFICIENCY}`,
    link: AppRouteConst.PSC_DEFICIENCY,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.PORT_MASTER}`,
    link: AppRouteConst.PORT,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.RANK_MASTER}`,
    link: AppRouteConst.RANK_MASTER,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.RISK_FACTOR}`,
    link: AppRouteConst.RISK_FACTOR,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.SECOND_CATEGORY}`,
    link: AppRouteConst.SECOND_CATEGORY,
  },

  {
    name: `${Features.CONFIGURATION}::${SubFeatures.REPEATED_FINDING}`,
    link: AppRouteConst.REPEATED_FINDING,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.TERMINAL}`,
    link: AppRouteConst.TERMINAL,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.THIRD_CATEGORY}`,
    link: AppRouteConst.THIRD_CATEGORY,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.INSPECTOR_TIME_OFF}`,
    link: AppRouteConst.INSPECTOR_TIME_OFF,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.TOPIC}`,
    link: AppRouteConst.TOPIC,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.TRANSFER_TYPE}`,
    link: AppRouteConst.TRANSFER_TYPE,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.ANSWER_VALUE}`,
    link: AppRouteConst.VALUE_MANAGEMENT,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.VESSEL}`,
    link: AppRouteConst.VESSEL,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.VESSEL_OWNER_BUSINESS}`,
    link: AppRouteConst.OWNER_BUSINESS,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.VIQ}`,
    link: AppRouteConst.VIQ,
  },
  {
    name: `${Features.CONFIGURATION}::${SubFeatures.VESSEL_TYPE}`,
    link: AppRouteConst.VESSEL_TYPE,
  },
];
