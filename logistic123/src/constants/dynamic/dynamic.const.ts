export enum DynamicLabelModuleName {
  Homepage = 'Homepage',
  Dashboard = 'Dashboard',
  AuditInspection = 'Audit & Inspection',
  AuditInspectionDashboard = 'Audit & Inspection::Dashboard',
  AuditInspectionMapView = 'Audit & Inspection::Map view',
  AuditInspectionPar = 'Audit & Inspection::Planning & request',
  AuditInspectionAuditTimeTable = 'Audit & Inspection::Audit Time Table',
  AuditInspectionInspectionWorkspace = 'Audit & Inspection::Audit Inspection Workspace',
  AuditInspectionReportOfFinding = 'Audit & Inspection::Report of Findings',
  AuditInspectionInspectionReport = 'Audit & Inspection::Internal Audit Report',
  AuditInspectionInspectionFollowUp = 'Audit & Inspection::Inspection Follow Up',
  QuantityAssurance = 'Quality Assurance',
  QuantityAssuranceSelfAssessment = 'Quality Assurance::Self-Assessment',
  QuantityAssuranceSelfAssessmentStamdardMaster = 'Quality Assurance::Self-Assessment::Standard Master',
  QuantityAssuranceSelfAssessmentElementMaster = 'Quality Assurance::Self-Assessment::Element Master',
  QuantityAssuranceSelfAssessmentSelfAssessment = 'Quality Assurance::Self-Assessment::Self-Assessment',
  QuantityAssuranceSailingReport = 'Quality Assurance::Sailing Report',
  QuantityAssuranceSailingReportSailingGeneralReport = 'Quality Assurance::Sailing Report::Sailing General Report',
  QuantityAssuranceIncidents = 'Quality Assurance::Incidents',
  QuantityAssuranceIncidentsSummary = 'Quality Assurance::Incidents::Summary',
  QuantityAssuranceIncidentsIncidents = 'Quality Assurance::Incidents::Incidents',
  QuantityAssurancePilotTerminalFeedback = 'Quality Assurance::Pilot/Terminal Feedback',
  QuantityAssurancePilotTerminalFeedbackPilotTerminalFeedback = 'Quality Assurance::Pilot/Terminal Feedback::Pilot/Terminal Feedback',
  QuantityAssuranceVesselScreening = 'Quality Assurance::Vessel Screening',
  QuantityAssuranceVesselScreeningVesselScreening = 'Quality Assurance::Vessel Screening::Vessel Screening',
  GroupCompany = 'Group & Company',
  GroupCompanyCompanyType = 'Group & Company::Company Type',
  GroupCompanyCompany = 'Group & Company::Company',
  UserRoles = 'User & Roles',
  UserRolesRoleAndPermission = 'User & Roles::Role and permission',
  UserRolesUser = 'User & Roles::User',
  Configuration = 'Configuration',
  ConfigurationQAInjuryBody = 'Configuration::QA::Injury Body',
  ConfigurationInspectionFocusRequest = 'Configuration::Inspection::Focus Request',
  ConfigurationCommon = 'Configuration::Common',
  ConfigurationCommonCrewGrouping = 'Configuration::Common::Crew Grouping',
  ConfigurationCommonDivision = 'Configuration::Common::Division',
  ConfigurationCommonDepartment = 'Configuration::Common::Department',
  ConfigurationCommonDivisionMapping = 'Configuration::Common::Division Mapping',
  ConfigurationCommonAudittype = 'Configuration::Common::Audit type',
  ConfigurationCommonLocationmaster = 'Configuration::Common::Location master',
  ConfigurationCommonMaincategory = 'Configuration::Common::Main category',
  ConfigurationCommonPortmaster = 'Configuration::Common::Port master',
  ConfigurationCommonVessel = 'Configuration::Common::Vessel',
  ConfigurationCommonVesselinspectionQuestionnaire = 'Configuration::Common::Vessel inspection questionnaire',
  ConfigurationCommonVesseltype = 'Configuration::Common::Vessel type',
  ConfigurationCommonWorkflowConfiguration = 'Configuration::Common::Workflow configuration',
  ConfigurationInspection = 'Configuration::Inspection',
  ConfigurationInspectionAppTypeProperty = 'Configuration::Inspection::App Type Property',
  ConfigurationInspectionAttachmentKit = 'Configuration::Inspection::Attachment Kit',
  ConfigurationInspectionCategoryMapping = 'Configuration::Inspection::Category mapping',
  ConfigurationInspectionCharterOwner = 'Configuration::Inspection::Charter/Owner',
  ConfigurationInspectionChemicalDistributionInstitute = 'Configuration::Inspection::Chemical Distribution Institute',
  ConfigurationInspectionDeviceControl = 'Configuration::Inspection::Device Control',
  ConfigurationInspectionAuditChecklist = 'Configuration::Inspection::Audit Checklist',
  ConfigurationInspectionInspectionMapping = 'Configuration::Inspection::Inspection Mapping',
  ConfigurationInspectionMailTemplate = 'Configuration::Inspection::Mail Template',
  ConfigurationInspectionMobileconfig = 'Configuration::Inspection::Mobile config',
  ConfigurationInspectionNatureOfFindings = 'Configuration::Inspection::Nature of Findings',
  ConfigurationInspectionRank = 'Configuration::Inspection::Rank',
  ConfigurationInspectionRepeatedFinding = 'Configuration::Inspection::Repeated Finding',
  ConfigurationInspectionReportTemplateMaster = 'Configuration::Inspection::Report template master',
  ConfigurationInspectionSecondCategory = 'Configuration::Inspection::Second category',
  ConfigurationInspectionThirdCategory = 'Configuration::Inspection::Third category',
  ConfigurationInspectionInspectorTimeOff = 'Configuration::Inspection::Inspector time off',
  ConfigurationInspectionTopic = 'Configuration::Inspection::Topic',
  ConfigurationInspectionAnswerValue = 'Configuration::Inspection::Answer Value',
  ConfigurationQA = 'Configuration::QA',
  ConfigurationQAAuthorityMaster = 'Configuration::QA::Authority master',
  ConfigurationQACargo = 'Configuration::QA::Cargo',
  ConfigurationQACargoType = 'Configuration::QA::Cargo Type',
  ConfigurationQAEventType = 'Configuration::QA::Event Type',
  ConfigurationQAIncidentMaster = 'Configuration::QA::Incident Master',
  ConfigurationQAInjuryMaster = 'Configuration::QA::Injury Master',
  ConfigurationQATechnicalIssueNote = 'Configuration::QA::Technical Issue Note',
  ConfigurationQAPlansDrawingsMaster = 'Configuration::QA::Plans Drawings Master',
  ConfigurationQAPSCAction = 'Configuration::QA::PSC Action',
  ConfigurationQAPSCDeficiency = 'Configuration::QA::PSC Deficiency',
  ConfigurationQATerminal = 'Configuration::QA::Terminal',
  ConfigurationQATransferType = 'Configuration::QA::Transfer Type',
  ConfigurationCommonAGGrid = 'Configuration::Common::AG-Grid',
  Watchlist = 'Watchlist',
  Notification = 'Notification',
  UserProfile = 'User Profile',
}

export const DEFAULT_MODULE_LABELS = {
  Homepage: 'Homepage',
  Dashboard: 'Dashboard',
  'Audit & Inspection': 'Audit & Inspection',
  'Audit & Inspection::Dashboard': 'Dashboard',
  'Audit & Inspection::Map view': 'Map view',
  'Audit & Inspection::Planning & request': 'Planning & request',
  'Audit & Inspection::Audit Time Table': 'Audit Time Table',
  'Audit & Inspection::Audit Inspection Workspace':
    'Audit Inspection Workspace',
  'Audit & Inspection::Report of Findings': 'Report of Findings',
  'Audit & Inspection::Internal Audit Report': 'Internal Audit Report',
  'Audit & Inspection::Inspection Follow Up': 'Inspection Follow Up',
  'Quality Assurance': 'Quality Assurance',
  'Quality Assurance::Self-Assessment': 'Self-Assessment',
  'Quality Assurance::Self-Assessment::Standard Master': 'Standard Master',
  'Quality Assurance::Self-Assessment::Element Master': 'Element Master',
  'Quality Assurance::Self-Assessment::Self-Assessment': 'Self-Assessment',
  'Quality Assurance::Sailing Report': 'Sailing Report',
  'Quality Assurance::Sailing Report::Sailing General Report':
    'Sailing General Report',
  'Quality Assurance::Incidents': 'Incidents',
  'Quality Assurance::Incidents::Summary': 'Summary',
  'Quality Assurance::Incidents::Incidents': 'Incidents',
  'Quality Assurance::Pilot/Terminal Feedback': 'Terminal Feedback',
  'Quality Assurance::Pilot/Terminal Feedback::Pilot/Terminal Feedback':
    'Pilot/Terminal Feedback',
  'Quality Assurance::Vessel Screening': 'Vessel Screening',
  'Quality Assurance::Vessel Screening::Vessel Screening': 'Vessel Screening',
  'Group & Company': 'Group & Company',
  'Group & Company::Company Type': 'Company Type',
  'Group & Company::Company': 'Company',
  'User & Roles': 'User & Roles',
  'User & Roles::Role and permission': 'Role and permission',
  'User & Roles::User': 'User',
  Configuration: 'Configuration',
  'Configuration::Common': 'Common',
  'Configuration::Common::Crew Grouping': 'Crew Grouping',
  'Configuration::Common::Division': 'Division',
  'Configuration::Common::Department': 'Department',
  'Configuration::Common::Division Mapping': 'Division Mapping',
  'Configuration::Common::Audit type': 'Audit type',
  'Configuration::Common::Location master': 'Location master',
  'Configuration::Common::Main category': 'Main category',
  'Configuration::Common::Port master': 'Port master',
  'Configuration::Common::Vessel': 'Vessel',
  'Configuration::Common::Vessel inspection questionnaire':
    'Vessel inspection questionnaire',
  'Configuration::Common::Vessel type': 'Vessel type',
  'Configuration::Common::Workflow configuration': 'Workflow configuration',
  'Configuration::Inspection': 'Inspection',
  'Configuration::Inspection::App Type Property': 'App Type Property',
  'Configuration::Inspection::Attachment Kit': 'Attachment Kit',
  'Configuration::Inspection::Category mapping': 'Category mapping',
  'Configuration::Inspection::Charter/Owner': 'Charter/Owner',
  'Configuration::Inspection::Chemical Distribution Institute':
    'Chemical Distribution Institute',
  'Configuration::Inspection::Device Control': 'Device Control',
  'Configuration::Inspection::Audit Checklist': 'Audit Checklist',
  'Configuration::Inspection::Inspection Mapping': 'Inspection Mapping',
  'Configuration::Inspection::Mail Template': 'Mail Template',
  'Configuration::Inspection::Mobile config': 'Mobile config',
  'Configuration::Inspection::Nature of Findings': 'Nature of Findings',
  'Configuration::Inspection::Rank': 'Rank',
  'Configuration::Inspection::Repeated Finding': 'Repeated Finding',
  'Configuration::Inspection::Report template master': 'Report template master',
  'Configuration::Inspection::Second category': 'Second category',
  'Configuration::Inspection::Third category': 'Third category',
  'Configuration::Inspection::Inspector time off': 'Inspector time off',
  'Configuration::Inspection::Topic': 'Topic',
  'Configuration::Inspection::Answer Value': 'Answer Value',
  'Configuration::QA': 'QA',
  'Configuration::QA::Authority master': 'Authority master',
  'Configuration::QA::Cargo': 'Cargo',
  'Configuration::QA::Cargo Type': 'Cargo Type',
  'Configuration::QA::Event Type': 'Event Type',
  'Configuration::QA::Incident Master': 'Incident Master',
  'Configuration::QA::Injury Master': 'Injury Master',
  'Configuration::QA::Injury Body': 'Injury Body',
  'Configuration::Inspection::Focus Request': 'Focus Request',
  'Configuration::QA::Technical Issue Note': 'Technical Issue Note',
  'Configuration::QA::Plans Drawings Master': 'Plans Drawings Master',
  'Configuration::QA::PSC Action': 'PSC Action',
  'Configuration::QA::PSC Deficiency': 'PSC Deficiency',
  'Configuration::QA::Terminal': 'Terminal',
  'Configuration::QA::Transfer Type': 'Transfer Type',
};

export enum ModulePage {
  List = 'list',
  Create = 'create',
  View = 'view',
  Edit = 'edit',
}
