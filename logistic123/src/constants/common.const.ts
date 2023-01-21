import { CONFIG } from '../config';
import { AppRouteConst } from './route.const';

export const API_BASE_URL = CONFIG.BASE_URL;
export const BASE_URL = `${API_BASE_URL}`;

export const exportOptions = [
  { value: 'csv', label: 'Export CSV' },
  { value: 'pdf', label: 'Export PDF' },
];
export const MAX_LENGTH_DECIMAL = 4;
export const MAX_LENGTH_IMO = 15;
export const MAX_LENGTH_TEXT = 128;
export const MAX_LENGTH_NAME = 128;
export const MAX_LENGTH_CODE = 20;
export const MAX_LENGTH_TEXT2 = 150;
export const MAX_LENGTH_OPTIONAL = 250;
export const MAX_LEGNTH_DESCRIPTION = 500;

export const TOOLTIP_COLOR = '#3B9FF3';

export enum MaxLength {
  MAX_LENGTH_TEXT = 128,
  MAX_LENGTH_CODE = 20,
  MAX_LENGTH_OPTIONAL = 250,
  MAX_LENGTH_COMMENTS = 5000,
  MAX_LENGTH_NUMBER = 10,
}
export enum MinLength {
  MIN_LENGTH_TEXT = 2,
}
export enum ExportType {
  PDF = 'pdf',
  CSV = 'csv',
}

export enum KeyPress {
  ENTER = 13,
}

export enum CommonQuery {
  EDIT = '?edit',
  EDIT_CAR_ONLY = '?editCarOnly',
}

export enum CoordinateType {
  LATITUDE = 'Latitude',
  LONGITUDE = 'Longitude',
}
export enum Direct {
  N = 'N',
  S = 'S',
  E = 'E',
  W = 'W',
}
export enum TypeShoreShip {
  SHORE = 'shore',
  SHIP = 'ship',
}

export enum MasterDataId {
  MAIN_CATEGORY = 'main-category',
  CDI = 'cdi',
  CHARTER_OWNER = 'charter-owner',
  CRITICALITY = 'criticality',
  LOCATION = 'location',
  POTENTIAL_RISK = 'potential-risk',
  SDR = 'sdr',
  SHIP_DEPARTMENT = 'ship-department',
  SHIP_RANK = 'ship-rank',
  SHORE_DEPARTMENT = 'shore-department',
  SHORE_RANK = 'shore-rank',
  SMS = 'sms',
  VESSEL_TYPE = 'vessel-type',
  VIQ = 'viq',
  TOPIC_ID = 'topicId',
  THIRD_CATEGORY = 'third-category',
  SECOND_CATEGORY = 'second-category',
  DEPARTMENT = 'department',
  REG = 'reg',
  INFOR = 'infor',
}
export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  APPLICATION = 'application',
  ATTACHMENT = 'attachment',
}
export enum FilePrefix {
  ATTACHMENT = 'attachments',
  AVATAR = 'avatars',
}

export enum ReportHeaderTopicType {
  HEADER = 'header',
  SUB_HEADER = 'sub_header',
}

export enum ReportTemplateModule {
  INTERNAL_AUDIT_REPORT = 'internal_audit_report',
}

export enum WorkFlowType {
  PLANNING_REQUEST = 'Planning request',
  AUDIT_CHECKLIST = 'Audit checklist',
  REPORT_FINDING = 'Report finding',
  INTERNAL_AUDIT_REPORT = 'Internal audit report',
  CAR_CAP = 'CAR/CAP',
  SELF_ASSESSMENT = 'Self assessment',
  Incidents = 'Incidents',
}

export enum ActivePermission {
  CREATOR = 'creator',
  REVIEWER = 'reviewer',
  APPROVER = 'approver',
  AUDITOR = 'auditor',
  CLOSE_OUT = 'close_out',
  OWNER_MANAGER = 'owner/manager',
  PUBLISHER = 'publisher',
  VERIFICATION = 'verification',
}

export enum IARReviewPermission {
  REVIEWER_1 = 'reviewer1',
  REVIEWER_2 = 'reviewer2',
  REVIEWER_3 = 'reviewer3',
  REVIEWER_4 = 'reviewer4',
  REVIEWER_5 = 'reviewer5',
}

export enum FeatureModule {
  HOME_PAGE = 'HOME_PAGE',
  MASTER_DASHBOARD = 'MASTER_DASHBOARD',
  AUDIT_INSPECTION = 'AUDIT_INSPECTION',
  GROUP_COMPANY = 'GROUP_COMPANY',
  USER_ROLE = 'USER_ROLE',
  CONFIGURATION = 'CONFIGURATION',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE',
}

export const PATH_FEATURE = {
  HOME_PAGE: [AppRouteConst.HOME_PAGE],
  MASTER_DASHBOARD: [AppRouteConst.DASHBOARD_MASTER],
  AUDIT_INSPECTION: [
    AppRouteConst.DASHBOARD,
    AppRouteConst.MAP_VIEW,
    AppRouteConst.REPORT_OF_FINDING,
    AppRouteConst.PLANNING,
    AppRouteConst.INTERNAL_AUDIT_REPORT,
    AppRouteConst.AUDIT_INSPECTION_WORKSPACE,
    AppRouteConst.AUDIT_TIME_TABLE,
    AppRouteConst.INSPECTION_FOLLOW_UP,
  ],
  GROUP_COMPANY: [
    AppRouteConst.COMPANY_TYPE,
    AppRouteConst.GROUP,
    AppRouteConst.COMPANY,
  ],
  USER_ROLE: [AppRouteConst.ROLE, AppRouteConst.USER],
  CONFIGURATION: [
    AppRouteConst.APP_TYPE_PROPERTY,
    AppRouteConst.CHECKLIST,
    AppRouteConst.CHECKLIST_TEMPLATE_MASTER,
    AppRouteConst.AUDIT_TYPE,
    AppRouteConst.CATEGORY,
    AppRouteConst.VESSEL,
    AppRouteConst.VESSEL_TYPE,
    AppRouteConst.FLEET,
    AppRouteConst.CHARTER_OWNER,
    AppRouteConst.LOCATION,
    AppRouteConst.SHIP_DIRECT_RESPONSIBLE,
    AppRouteConst.SHIP_DEPARTMENT,
    AppRouteConst.MAIN_CATEGORY,
    AppRouteConst.SECOND_CATEGORY,
    AppRouteConst.TERMINAL,
    AppRouteConst.THIRD_CATEGORY,
    AppRouteConst.TOPIC,
    AppRouteConst.CDI,
    AppRouteConst.ATTACHMENT_KIT,
    AppRouteConst.MAIL_MANAGEMENT,
    AppRouteConst.SHORE_DEPARTMENT,
    AppRouteConst.SHORE_RANK,
    AppRouteConst.AUTHORITY_MASTER,
    AppRouteConst.SHIP_RANK,
    AppRouteConst.VIQ,
    // START_NEW_PAGE
    AppRouteConst.VALUE_MANAGEMENT,
    // END_NEW_PAGE
    AppRouteConst.DMS,
    AppRouteConst.REPEATED_FINDING,
    AppRouteConst.DIVISION,
    AppRouteConst.DIVISION_MAPPING,
    AppRouteConst.PLAN_DRAWING,
    AppRouteConst.PSC_ACTION,
    AppRouteConst.OWNER_BUSINESS,
    AppRouteConst.PSC_DEFICIENCY,
    AppRouteConst.MOBILE_CONFIG,
    AppRouteConst.DEVICE_CONTROL,
    AppRouteConst.DEPARTMENT_MASTER,
    AppRouteConst.NATURE_OF_FINDINGS_MASTER,
    AppRouteConst.PORT,
    AppRouteConst.RANK_MASTER,
    AppRouteConst.WORK_FLOW,
    AppRouteConst.CATEGORY_MAPPING,
    AppRouteConst.FOCUS_REQUEST,
    AppRouteConst.INSPECTOR_TIME_OFF,
    AppRouteConst.MODULE_MANAGEMENT,
    AppRouteConst.FEATURE_CONFIG,
    AppRouteConst.EVENT_TYPE,
    AppRouteConst.INCIDENT_TYPE,
    AppRouteConst.ISSUE_NOTE,
    AppRouteConst.INJURY_BODY,
    AppRouteConst.INJURY_MASTER,
    AppRouteConst.PSC_ACTION,
    AppRouteConst.OWNER_BUSINESS,
    AppRouteConst.PSC_DEFICIENCY,
    AppRouteConst.TRANSFER_TYPE,
    AppRouteConst.CARGO,
    AppRouteConst.CARGO_TYPE,
    AppRouteConst.RISK_FACTOR,
    AppRouteConst.CREW_GROUPING,
    AppRouteConst.COUNTRY,
    AppRouteConst.INSPECTION_MAPPING,
    AppRouteConst.AUDIT_CHECKLIST,
    AppRouteConst.REPORT_TEMPLATE,
    AppRouteConst.MODULE_CONFIGURATION,
  ],
  QUALITY_ASSURANCE: [
    AppRouteConst.QA_DASHBOARD,
    AppRouteConst.STANDARD_MASTER,
    AppRouteConst.ELEMENT_MASTER,
    AppRouteConst.SELF_ASSESSMENT,
    AppRouteConst.SAIL_GENERAL_REPORT,
    AppRouteConst.VESSEL_SCREENING,
    AppRouteConst.INCIDENTS,
    AppRouteConst.INCIDENTS_SUMMARY,
    AppRouteConst.PILOT_TERMINAL_FEEDBACK,
  ],
};

export enum ModuleQuality {
  QA_DASHBOARD = 'QA_DASHBOARD',
  SELF_ASSESSMENT = 'SELF_ASSESSMENT',
  SAILING_REPORT = 'SAILING_REPORT',
  VESSEL_SCREENING = 'VESSEL_SCREENING',
  INCIDENTS = 'INCIDENTS',
  PILOT_TERMINAL_FEEDBACK = 'PILOT_TERMINAL_FEEDBACK',
}

export enum ModuleConfiguration {
  COMMON = 'COMMON',
  QA = 'QA',
  INSPECTION = 'INSPECTION',
  COUNTRY_MASTER = 'COUNTRY_MASTER',
}

export const PATH_FEATURE_QUALITY = {
  QA_DASHBOARD: [AppRouteConst.QA_DASHBOARD],
  SELF_ASSESSMENT: [
    AppRouteConst.STANDARD_MASTER,
    AppRouteConst.ELEMENT_MASTER,
    AppRouteConst.SELF_ASSESSMENT,
  ],
  SAILING_REPORT: [AppRouteConst.SAIL_GENERAL_REPORT],
  VESSEL_SCREENING: [AppRouteConst.VESSEL_SCREENING],
  INCIDENTS: [AppRouteConst.INCIDENTS, AppRouteConst.INCIDENTS_SUMMARY],
  PILOT_TERMINAL_FEEDBACK: [AppRouteConst.PILOT_TERMINAL_FEEDBACK],
};

export const PATH_FEATURE_CONFIGURATION = {
  COMMON: [
    AppRouteConst.DIVISION,
    AppRouteConst.CREW_GROUPING,
    AppRouteConst.DEPARTMENT_MASTER,
    AppRouteConst.DIVISION_MAPPING,
    AppRouteConst.AUDIT_TYPE,
    AppRouteConst.LOCATION,
    AppRouteConst.MAIN_CATEGORY,
    AppRouteConst.PORT,
    AppRouteConst.VESSEL,
    AppRouteConst.VIQ,
    AppRouteConst.VESSEL_TYPE,
    AppRouteConst.WORK_FLOW,
  ],
  INSPECTION: [
    AppRouteConst.APP_TYPE_PROPERTY,
    AppRouteConst.ATTACHMENT_KIT,
    AppRouteConst.CATEGORY_MAPPING,
    AppRouteConst.CHARTER_OWNER,
    AppRouteConst.CDI,
    AppRouteConst.DEVICE_CONTROL,
    AppRouteConst.FOCUS_REQUEST,
    AppRouteConst.MAIL_MANAGEMENT,
    AppRouteConst.MOBILE_CONFIG,
    AppRouteConst.NATURE_OF_FINDINGS_MASTER,
    AppRouteConst.RANK_MASTER,
    AppRouteConst.SECOND_CATEGORY,
    AppRouteConst.THIRD_CATEGORY,
    AppRouteConst.INSPECTOR_TIME_OFF,
    AppRouteConst.TOPIC,
    AppRouteConst.REPEATED_FINDING,
    AppRouteConst.VALUE_MANAGEMENT,
    AppRouteConst.AUDIT_CHECKLIST,
    AppRouteConst.INSPECTION_MAPPING,
    AppRouteConst.REPORT_TEMPLATE,
  ],
  QA: [
    AppRouteConst.AUTHORITY_MASTER,
    AppRouteConst.CARGO,
    AppRouteConst.CARGO_TYPE,
    AppRouteConst.EVENT_TYPE,
    AppRouteConst.INCIDENT_TYPE,
    AppRouteConst.INJURY_BODY,
    AppRouteConst.INJURY_MASTER,
    AppRouteConst.ISSUE_NOTE,
    AppRouteConst.PLAN_DRAWING,
    AppRouteConst.PSC_ACTION,
    AppRouteConst.PSC_DEFICIENCY,
    AppRouteConst.RISK_FACTOR,
    AppRouteConst.TERMINAL,
    AppRouteConst.TRANSFER_TYPE,
    AppRouteConst.OWNER_BUSINESS,
  ],
  COUNTRY_MASTER: [AppRouteConst.COUNTRY],
};

export const COLOR = {
  BLUE_3: '#3b9ff3',
};

export enum FillAuditChecklistStatus {
  YET_TO_START = 'Yet To Start', // color draff
  IN_PROGRESS = 'In-progress', // color submitted
  COMPLETED = 'Completed', // color plan successfully
}
export enum QuestionOptionsType {
  YES_NO = 'Yes/No',
  YES_NO_NA = 'Yes/No/NA',
  RADIO = 'Radio list',
  COMBO = 'Combo list',
}

export enum AuditWorkspaceStatus {
  NEW = 'New',
  DRAFT = 'Draft',
  FINAL = 'Final',
  SUBMITTED = 'Submitted',
}

export enum DeviceControlStatus {
  ACTIVATE = 'Activate',
  DE_ACTIVATE = 'De-activate',
  PURGE = 'Purge',
}

// Fields Form Const
export const fieldsPRForm = [
  'vesselId',
  'vesselTypeId',
  'fleetId',
  'dateOfLastAudit',
  'typeOfAudit',
  'fromPortId',
  'toPortId',
  'toPortEstimatedTimeArrival',
  'toPortEstimatedTimeDeparture',
  'fromPortEstimatedTimeArrival',
  'fromPortEstimatedTimeDeparture',
  'plannedFromDate',
  'plannedToDate',
  'auditTypeIds',
  'auditorIds',
  'leadAuditorId',
  'memo',
  'attachments',
  'officeComments',
  'additionalReviewers',
  'entityType',
  'companyId',
  'departmentIds',
  'workingType',
  'locationId',
];

export const fieldsVesselForm = [
  'image',
  'imoNumber',
  'vesselTypeId',
  'name',
  'code',
  'countryFlag',
  'callSign',
  'buildDate',
  'age',
  'shipyardName',
  'shipyardCountry',
  'officialNumber',
  'classificationSocietyId',
  'vesselClass',
  'hullNumber',
  'fleetName',
  'divisionId',
  'status',
  'docHolderId',
  'cimoNumber',
  'docHolderCode',
  'docResponsiblePartyInspection',
  'docResponsiblePartyQA',
  'deadWeightTonnage',
  'ownerIds',
  'customerRestricted',
  'blacklistOnMOUWebsite',
];

export const fieldsATPForm = [
  'appCode',
  'appName',
  'eligibleSyncLocation',
  'dataLifeSpan',
  'fileValidity',
  'autoDeactive',
  'autoPurge',
  'networkMode',
  'downloadLimit',
  'USBPath',
  'isAutoFlush',
  'enableVesselFieldAudit',
  'androidVersion',
  'iOSVersion',
  'windowsVersion',
];

export const fieldVoyageInfo = [
  'voyageStatus',
  'voyageNo',
  'opsCoordinator',
  'companyCode',
  'consecutive',
  'firstTCI',
  'lastTCI',
  'totalLoadCargoVol',
  'tradeAreaNo',
  'firstLoadPortNo',
  'firstLoadPort',
  'vesselType',
  'lastDischargePortNo',
  'lastDischargePort',
  'fixtureNo',
  'estimateId',
  'cargoGradesList',
  'cargoCounterpartyShortnames',
  'imosUrl',
  'oprType',
  'vesselCode',
  'vesselName',
];

export const arrDateInWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const arrMonthInYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const printOptions = [
  // { value: 'All', label: 'All' },
  { value: 'External', label: 'External' },
  { value: 'Internal', label: 'Internal' },
];

export const FORMAT_DATE = 'DD/MM/YYYY';
export const FORMAT_DATE_YEAR = 'YYYY-MM-DD';
export const FORMAT_DATE_TIME = 'DD/MM/YYYY HH:mm';
export const FORMAT_DATE_TIME_SECOND = 'DD/MM/YYYY HH:mm:ss';

export enum STATUS_COORDINATES {
  WITHOUT_DIRECTION = 'WITHOUT_DIRECTION',
  OVER_DEGREE = 'OVER_DEGREE',
  EQUAL_MAX_DEGREE = 'EQUAL_MAX_DEGREE',
  OVER_MINUTE = 'OVER_MINUTE',
  OVER_SECOND = 'EQUAL_SECOND',
  TRUE = 'TRUE',
}

export enum SCREEN_STATUS {
  CREATE = 'CREATE',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

// MENTION_MODULE_PLANNING

export const MENTION_MODULE_PLANNING = [
  {
    id: '@ETT',
    display: 'ETT - Entity',
  },
  {
    id: '@VSN',
    display: 'VSN - Vessel name',
  },
  {
    id: '@VST',
    display: 'VST - Vessel type',
  },
  {
    id: '@FLN',
    display: 'FLN - Fleet name',
  },
  {
    id: '@VIT',
    display: 'VIT - Visit type',
  },
  {
    id: '@IST',
    display: 'IST - Inspection type',
  },
  {
    id: '@DLI',
    display: 'DLI - Date of last inspection',
  },

  {
    id: '@DD',
    display: 'DD - Due date',
  },
  {
    id: '@WT',
    display: 'WT - Working type',
  },
  {
    id: '@FRP',
    display: 'FRP - From port',
  },
  {
    id: '@FPETA',
    display: 'FPETA - ETA',
  },

  {
    id: '@FPETD',
    display: 'FPETD - ETD',
  },
  {
    id: '@TP',
    display: 'TP - To port',
  },
  {
    id: '@TPETA',
    display: 'TPETA - ETA',
  },
  {
    id: '@TPETD',
    display: 'TPETD - ETD',
  },

  {
    id: '@PFD',
    display: 'PFD - Planned from date',
  },
  {
    id: '@PTD',
    display: 'PTD - Planned to date',
  },
  {
    id: '@NOI',
    display: 'NOI - Name of inspector',
  },
  {
    id: '@NLI',
    display: 'NLI - Name of lead inspector',
  },
  {
    id: '@MEM',
    display: 'MEM - Memo',
  },
];

export const MENTION_MODULE_PLANNING_CHECK = [
  {
    id: '@ETT',
    display: 'ETT - Entity',
  },
  {
    id: '@VSN',
    display: 'VSN - Vessel name',
  },
  {
    id: '@VST',
    display: 'VST - Vessel type',
  },
  {
    id: '@FLN',
    display: 'FLN - Fleet name',
  },
  {
    id: '@VIT',
    display: 'VIT - Visit type',
  },
  {
    id: '@IST',
    display: 'IST - Inspection type',
  },
  {
    id: '@DLI',
    display: 'DLI - Date of last inspection',
  },

  {
    id: '@DD',
    display: 'DD - Due date',
  },
  {
    id: '@WT',
    display: 'WT - Working type',
  },
  {
    id: '@FRP',
    display: 'FRP - From port',
  },
  {
    id: '@FPETA',
    display: 'FPETA - ETA',
  },

  {
    id: '@FPETD',
    display: 'FPETD - ETD',
  },

  {
    id: '@TPETA',
    display: 'TPETA - ETA',
  },
  {
    id: '@TPETD',
    display: 'TPETD - ETD',
  },
  {
    id: '@TP',
    display: 'TP - To port',
  },
  {
    id: '@PFD',
    display: 'PFD - Planned from date',
  },
  {
    id: '@PTD',
    display: 'PTD - Planned to date',
  },
  {
    id: '@NOI',
    display: 'NOI - Name of inspector',
  },
  {
    id: '@NLI',
    display: 'NLI - Name of lead inspector',
  },
  {
    id: '@MEM',
    display: 'MEM - Memo',
  },
];

// MENTION_MODULE_INSPECTION_REPORT
export const MENTION_MODULE_INSPECTION_REPORT = [
  {
    id: '@VSN',
    display: 'VSN - Vessel name',
  },

  {
    id: '@INN',
    display: 'INN - Inspection number',
  },
  {
    id: '@IST',
    display: 'IST - Inspection type',
  },
  {
    id: '@AFP',
    display: 'AFP - Actual inspection From port',
  },
  {
    id: '@ATP',
    display: 'ATP - Actual inspection To port',
  },
  {
    id: '@LIN',
    display: 'LIN - Lead inspector name',
  },
  {
    id: '@ISN',
    display: 'ISN - Inspector name',
  },
  {
    id: '@PFD',
    display: 'PFD - Planned from date',
  },
  {
    id: '@PTD',
    display: 'PTD - Planned to date',
  },
  {
    id: '@VIT',
    display: 'VIT - Visit type',
  },
];

// MENTION_MODULE_INSPECTION_FOLLOW_UP
export const MENTION_MODULE_INSPECTION_FOLLOW_UP = [
  {
    id: '@VSN',
    display: 'VSN - Vessel name',
  },
  {
    id: '@VSM',
    display: 'VSM - Vessel manager',
  },
  {
    id: '@INN',
    display: 'INN - Inspection number',
  },
  {
    id: '@IST',
    display: 'IST - Inspection type',
  },
  {
    id: '@AFP',
    display: 'AFP - Actual inspection From port',
  },
  {
    id: '@ATP',
    display: 'ATP - Actual inspection To port',
  },
  {
    id: '@LIN',
    display: 'LIN - Lead inspector name',
  },
  {
    id: '@ISN',
    display: 'ISN - Inspector name',
  },
  {
    id: '@PFD',
    display: 'PFD - Planned from date',
  },
  {
    id: '@PTD',
    display: 'PTD - Planned to date',
  },
];

// MENTION_MODULE_REPORT_OF_FINDING
export const MENTION_MODULE_REPORT_OF_FINDING = [
  {
    id: '@VSN',
    display: 'VSN - Vessel name',
  },
  {
    id: '@VSM',
    display: 'VSM - Vessel manager',
  },
  {
    id: '@INN',
    display: 'INN - Inspection number',
  },
  {
    id: '@IST',
    display: 'IST - Inspection type',
  },
  {
    id: '@AFP',
    display: 'AFP - Actual inspection From port',
  },
  {
    id: '@ATP',
    display: 'ATP - Actual inspection To port',
  },
  {
    id: '@LIN',
    display: 'LIN - Lead inspector name',
  },

  {
    id: '@ISN',
    display: 'ISN - Inspector name',
  },
  {
    id: '@PFD',
    display: 'PFD - Planned from date',
  },
  {
    id: '@PTD',
    display: 'PTD - Planned to date',
  },
];

export const MENTION_TIME = [
  {
    id: '#days',
    display: '#days',
  },
  {
    id: '#weeks',
    display: '#weeks',
  },
  {
    id: '#months',
    display: '#months',
  },
  {
    id: '#years',
    display: '#years',
  },
];

export const MENTIONS = [
  {
    id: '@FPETA',
    display: 'FPETA - ETA',
  },
  {
    id: '@TPETA',
    display: 'TPETA - ETA',
  },
  {
    id: '@TPETD',
    display: 'TPETD - ETD',
  },
  {
    id: '@FPETD',
    display: 'FPETD - ETD',
  },
  {
    id: '@VSM',
    display: 'VSM - Vessel manager',
  },
  {
    id: '@INN',
    display: 'INN - Inspection number',
  },
  {
    id: '@AFP',
    display: 'AFP - Actual inspection From port',
  },
  {
    id: '@ATP',
    display: 'ATP - Actual inspection To port',
  },
  {
    id: '@LIN',
    display: 'LIN - Lead inspector name',
  },
  {
    id: '@ISN',
    display: 'ISN - Inspector name',
  },
  {
    id: '@ETT',
    display: 'ETT - Entity',
  },
  {
    id: '@VSN',
    display: 'VSN - Vessel name',
  },
  {
    id: '@VST',
    display: 'VST - Vessel type',
  },
  {
    id: '@FLN',
    display: 'FLN - Fleet name',
  },
  {
    id: '@VIT',
    display: 'VIT - Visit type',
  },
  {
    id: '@IST',
    display: 'IST - Inspection type',
  },
  {
    id: '@DLI',
    display: 'DLI - Date of last inspection',
  },

  {
    id: '@FRP',
    display: 'FRP - From port',
  },
  {
    id: '@PFD',
    display: 'PFD - Planned from date',
  },
  {
    id: '@PTD',
    display: 'PTD - Planned to date',
  },
  {
    id: '@NOI',
    display: 'NOI - Name of inspector',
  },
  {
    id: '@NLI',
    display: 'NLI - Name of lead inspector',
  },
  {
    id: '@MEM',
    display: 'MEM - Memo',
  },
  {
    id: '@DD',
    display: 'DD - Due date',
  },
  {
    id: '@WT',
    display: 'WT - Working type',
  },

  {
    id: '@TP',
    display: 'TP - To port',
  },
];

export enum CompanyLevelEnum {
  MAIN_COMPANY = 'Main Company',
  INTERNAL_COMPANY = 'Internal Company',
  EXTERNAL_COMPANY = 'External Company',
}

export enum ModuleName {
  INSPECTION = 'Inspection',
  QA = 'Qa',
  MasterTable = 'Master Table',
}

export enum CompanyType {
  SHIP_MAGEMENT = 'Ship management (DOC holder)',
  SHIP_OWNER = 'Ship Owner',
  CHARTERER = 'Charterer',
}

export const INAUTIX_BASE = 'https://www.i-nautix.com';
export const LINK_CONTACT = 'https://www.i-nautix.com/contact';
export const SOLVER_LINK = 'https://www.solverminds.sg';
