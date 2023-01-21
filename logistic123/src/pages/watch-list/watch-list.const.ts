import { AppRouteConst } from 'constants/route.const';
import { openNewPage } from 'helpers/utils.helper';

export enum WatchlistModuleEnum {
  INSPECTION_TIME_TABLE = 'Inspection time table',
  PLANNING = 'Planning',
  REPORT_FINDING = 'Report finding',
  INSPECTION_REPORT = 'Inspection report',
  SELF_ASSESSMENT = 'Self assessment',
  SELF_DECLARATION = 'Self declaration',
  INSPECTION_FOLLOW_UP = 'Inspection follow up',
  INSPECTION_MAPPING = 'Inspection mapping',
  INSPECTION_CHECKLIST = 'Inspection checklist',
  REPORT_TEMPLATE = 'Report template',
  INSPECTION_WORKSPACE = 'Inspection workspace',
  CONDITION_OF_CLASS_DISPENSATIONS = 'Condition of Class/Dispensations',
  SURVEY_CLASS_INFO = 'Survey/Class Info',
  MAINTENANCE_PERFORMANCE = 'Maintenance Performance',
  OTHER_TECHNICAL_RECORDS = 'Other Technical Records',
  DRY_DOCKING = 'Dry Docking',
  INCIDENTS = 'Incidents',
  INJURIES = 'Injuries',
  OTHER_SMS_RECORDS = 'Other SMS Records',
  PORT_STATE_CONTROL = 'Port State Control',
  EXTERNAL_INSPECTIONS = 'External Inspections',
  INTERNAL_INSPECTIONS_AUDITS = 'Internal Inspections/Audits',
  SAFETY_ENGAGEMENT = 'Safety Engagement',
  PLAN_AND_DRAWINGS = 'Plans and Drawings',
  PILOT_TERMINAL_FEEDBACK = 'Pilot/Terminal Feedback',
  VESSEL_SCREENING = 'Vessel Screening',
}

export const handleRedirectToTargetPage = (
  referenceModuleName,
  referenceId,
) => {
  switch (referenceModuleName) {
    case WatchlistModuleEnum.INSPECTION_TIME_TABLE:
      openNewPage(AppRouteConst.getAuditTimeTableById(referenceId));
      break;
    case WatchlistModuleEnum.PLANNING:
      openNewPage(AppRouteConst.getPlanningAndRequestById(referenceId));
      break;
    case WatchlistModuleEnum.REPORT_FINDING:
      openNewPage(AppRouteConst.getReportOfFindingById(referenceId));
      break;
    case WatchlistModuleEnum.INSPECTION_REPORT:
      openNewPage(AppRouteConst.getInternalAuditReportById(referenceId));
      break;
    case WatchlistModuleEnum.INSPECTION_FOLLOW_UP:
      openNewPage(AppRouteConst.getInspectionFollowUpById(referenceId));
      break;
    case WatchlistModuleEnum.SELF_ASSESSMENT:
      openNewPage(AppRouteConst.getSelfAssessmentById(referenceId));
      break;
    case WatchlistModuleEnum.INCIDENTS:
      openNewPage(AppRouteConst.getIncidentsById(referenceId));
      break;
    case WatchlistModuleEnum.PILOT_TERMINAL_FEEDBACK:
      openNewPage(AppRouteConst.getPilotTerminalFeedbackById(referenceId));
      break;
    case WatchlistModuleEnum.VESSEL_SCREENING:
      openNewPage(AppRouteConst.getVesselScreeningById(referenceId));
      break;
    case WatchlistModuleEnum.INSPECTION_WORKSPACE:
      openNewPage(AppRouteConst.getAuditInspectionWorkspaceById(referenceId));
      break;
    default:
      break;
  }
};
