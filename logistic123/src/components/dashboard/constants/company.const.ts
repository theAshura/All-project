import { ColumnTableType } from 'components/common/table-antd/TableAntd';
import { AppRouteConst } from 'constants/route.const';
import { openNewPage } from 'helpers/utils.helper';

export enum ModalDashboardType {
  WORKLOAD = 'WORKLOAD',
  UPCOMING_AUDIT_PLAN_VESSEL = 'UPCOMING_AUDIT_PLAN_VESSEL',
  UPCOMING_REPORTS_VESSEL = 'UPCOMING_REPORTS_VESSEL',
  NON_CONFORMITY = 'NON_CONFORMITY',
  OBSERVATIONS = 'OBSERVATIONS',
  NUMBER_AUDIT_TIME_TABLE = 'NUMBER_AUDIT_TIME_TABLE',
  NUMBER_REPORT_OF_FINDING = 'NUMBER_REPORT_OF_FINDING',
  NUMBER_INTERNAL_AUDIT_REPORT = 'NUMBER_INTERNAL_AUDIT_REPORT',

  HIDDEN = 'HIDDEN',
}

export const columnUpcomingAuditPlanVessel: ColumnTableType[] = [
  {
    title: 'Action',
    dataIndex: 'action',
    sortField: 'action',
    width: 45,
  },
  {
    title: 'Vessel code',
    dataIndex: 'vesselCode',
    sortField: 'vesselCode',
    isSort: true,
    width: 90,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    sortField: 'vesselName',
    isSort: true,
    width: 90,
    isHightLight: true,
  },
  {
    title: 'Upcoming audit plans',
    dataIndex: 'upComingPr',
    sortField: 'upComingPr',
    isSort: true,
    width: 150,
  },
];
export const columnUpcomingAuditPlanVesselDetail: ColumnTableType[] = [
  {
    title: 'Audit plan ref. ID',
    dataIndex: 'auditNo',
    sortField: 'auditNo',
    isSort: true,
    width: 100,
    isHightLight: true,
  },
  {
    title: 'Planned Inspection Date From',
    dataIndex: 'plannedFromDate',
    sortField: 'plannedFromDate',
    isSort: true,
    width: 150,
  },
  {
    title: 'Lead inspector name',
    dataIndex: 'username',
    sortField: 'username',
    isSort: true,
    width: 150,
  },
];

export const columnUpcomingReportVessel: ColumnTableType[] = [
  {
    title: 'Action',
    dataIndex: 'action',
    sortField: 'action',
    width: 45,
  },
  {
    title: 'Vessel code',
    dataIndex: 'vesselCode',
    sortField: 'vesselCode',
    isSort: true,
    width: 100,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    sortField: 'vesselName',
    isSort: true,
    width: 100,
    isHightLight: true,
  },
  {
    title: 'Upcoming reports',
    dataIndex: 'upComingIAR',
    sortField: 'upComingIAR',
    isSort: true,
    width: 150,
  },
];

export const columnUpcomingReportVesselDetail: ColumnTableType[] = [
  {
    title: 'Report s.no',
    dataIndex: 'serialNumber',
    sortField: 'serialNumber',
    isSort: true,
    width: 100,
    isHightLight: true,
  },
  {
    title: 'Ref.id',
    dataIndex: 'refId',
    sortField: 'refId',
    isSort: true,
    width: 50,
  },
  {
    title: 'Lead inspector name',
    dataIndex: 'username',
    sortField: 'username',
    isSort: true,
    width: 150,
  },
];

export const columnNonConformity: ColumnTableType[] = [
  {
    title: 'Action',
    dataIndex: 'action',
    sortField: 'action',
    width: 60,
  },
  {
    title: 'Vessel code',
    dataIndex: 'vesselCode',
    sortField: 'vesselCode',
    isSort: true,
    width: 200,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    sortField: 'vesselName',
    isSort: true,
    width: 200,
    isHightLight: true,
  },
  {
    title: 'Total open non-conformity',
    dataIndex: 'total',
    sortField: 'total',
    isSort: true,
    width: 200,
  },
];

export const columnNonConformityDetail: ColumnTableType[] = [
  {
    title: 'Inspection report ref. ID',
    dataIndex: 'refId',
    sortField: 'refId',
    isSort: true,
    width: 200,
    isHightLight: true,
  },
  {
    title: 'Findings Ref.No',
    dataIndex: 'refNo',
    sortField: 'refNo',
    isSort: true,
    width: 200,
  },
  {
    title: 'Inspection type',
    dataIndex: 'auditType',
    sortField: 'auditType',
    isSort: true,
    width: 200,
  },

  {
    title: 'Findings',
    dataIndex: 'findings',
    sortField: 'findings',
    isSort: true,
    width: 200,
  },
  {
    title: 'is significant',
    dataIndex: 'isSignificant',
    sortField: 'isSignificant',
    isSort: true,
    width: 200,
  },
];

export const columnObservations: ColumnTableType[] = [
  {
    title: 'Action',
    dataIndex: 'action',
    sortField: 'action',
    width: 60,
  },
  {
    title: 'Vessel code',
    dataIndex: 'vesselCode',
    sortField: 'vesselCode',
    isSort: true,
    width: 200,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    sortField: 'vesselName',
    isSort: true,
    width: 200,
    isHightLight: true,
  },
  {
    title: 'Total open observations',
    dataIndex: 'total',
    sortField: 'total',
    isSort: true,
    width: 200,
  },
];

export const columnObservationsDetail: ColumnTableType[] =
  columnNonConformityDetail;

export const columnAuditTimeTable: ColumnTableType[] = [
  {
    title: 'Inspection time table Ref.ID',
    dataIndex: 'refNo',
    sortField: 'refNo',
    isSort: true,
    isHightLight: true,
    width: 120,
  },
  {
    title: 'Plan Ref.ID',
    dataIndex: 'auditRefId',
    sortField: 'auditRefId',
    isSort: true,
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.planningRequestId &&
      openNewPage(
        AppRouteConst.getPlanningAndRequestById(data?.planningRequestId),
      ),
    width: 75,
  },
  {
    title: 'Inspection time table S.No',
    dataIndex: 'sNo',
    sortField: 'sNo',
    isSort: true,
    width: 30,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    sortField: 'vesselName',
    isSort: true,
    width: 85,
  },
  {
    title: 'Lead inspector',
    dataIndex: 'leadAuditor',
    sortField: 'leadAuditor',
    isSort: true,
    width: 110,
  },
  {
    title: 'planned audit from date',
    dataIndex: 'plannedFromDate',
    sortField: 'plannedFromDate',
    isSort: true,
    width: 165,
    isDateTime: true,
  },
];

export const columnInternalAuditReport: ColumnTableType[] = [
  {
    title: 'Inspection report Ref.ID',
    dataIndex: 'refId',
    sortField: 'refId',
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.id &&
      openNewPage(AppRouteConst.getInternalAuditReportById(data?.id)),
    isSort: true,
    width: 40,
  },
  {
    title: 'Plan Ref.ID',
    dataIndex: 'auditRef.ID',
    sortField: 'auditRef.ID',
    isSort: true,
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.auditRefId &&
      openNewPage(AppRouteConst.getPlanningAndRequestById(data?.auditRefId)),
    width: 40,
  },
  {
    title: 'Inspection Report S.No',
    dataIndex: 'sNo',
    sortField: 'sNo',
    isSort: true,
    width: 40,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    sortField: 'vesselName',
    isSort: true,
    width: 85,
  },
  {
    title: 'Lead inspector',
    dataIndex: 'leadAuditor',
    sortField: 'leadAuditor',
    isSort: true,
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sortField: 'status',
    isSort: true,
    width: 50,
  },
];
export const columnInternalAuditReportCompany: ColumnTableType[] = [
  {
    title: 'Inspection report Ref.ID',
    dataIndex: 'refId',
    sortField: 'refId',
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.id &&
      openNewPage(AppRouteConst.getInternalAuditReportById(data?.id)),
    isSort: true,
    width: 40,
  },
  {
    title: 'Plan Ref.ID',
    dataIndex: 'auditRef.ID',
    sortField: 'auditRef.ID',
    isSort: true,
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.auditRefId &&
      openNewPage(AppRouteConst.getPlanningAndRequestById(data?.auditRefId)),
    width: 40,
  },
  {
    title: 'Inspection Report S.No',
    dataIndex: 'serialNumber',
    sortField: 'sNo',
    isSort: true,
    width: 40,
  },
  {
    title: 'Vessel name',
    dataIndex: ['iarPlanningRequest', 'vesselName'],
    sortField: 'vesselName',
    isSort: true,
    width: 85,
  },
  {
    title: 'Company',
    dataIndex: ['iarPlanningRequest', 'auditCompanyName'],
    sortField: 'vesselName',
    isSort: true,
    width: 85,
  },
  {
    title: 'Lead inspector',
    dataIndex: 'leadAuditor',
    sortField: 'leadAuditor',
    isSort: true,
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sortField: 'status',
    isSort: true,
    width: 50,
  },
];
export const columnInternalAuditReportCompanyAuditor: ColumnTableType[] = [
  {
    title: 'Inspection report Ref.ID',
    dataIndex: 'refId',
    sortField: 'refId',
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.id &&
      openNewPage(AppRouteConst.getInternalAuditReportById(data?.id)),
    isSort: true,
    width: 40,
  },
  {
    title: 'Plan Ref.ID',
    dataIndex: 'auditRef.ID',
    sortField: 'auditRef.ID',
    isSort: true,
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.auditRefId &&
      openNewPage(AppRouteConst.getPlanningAndRequestById(data?.auditRefId)),
    width: 40,
  },
  {
    title: 'Inspection Report S.No',
    dataIndex: 'serialNumber',
    sortField: 'sNo',
    isSort: true,
    width: 40,
  },
  {
    title: 'Vessel name',
    dataIndex: ['iarPlanningRequest', 'vesselName'],
    sortField: 'vesselName',
    isSort: true,
    width: 85,
  },
  {
    title: 'Company',
    dataIndex: ['iarPlanningRequest', 'auditCompanyName'],
    sortField: 'vesselName',
    isSort: true,
    width: 85,
  },
  {
    title: 'Lead inspector',
    dataIndex: 'leadAuditor',
    sortField: 'leadAuditor',
    isSort: true,
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sortField: 'status',
    isSort: true,
    width: 50,
  },
];

export const columnReportOfFinding: ColumnTableType[] = [
  {
    title: 'Report of findings Ref.ID',
    dataIndex: 'refId',
    sortField: 'refId',
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.reportFindingFormId &&
      openNewPage(
        AppRouteConst.getReportOfFindingById(data?.reportFindingFormId),
      ),
    isSort: true,
    width: 40,
  },
  {
    title: 'Plan Ref.ID',
    dataIndex: 'auditRef.ID',
    sortField: 'auditRef.ID',
    isSort: true,
    isHightLight: true,
    onClickHightLight: (data) =>
      data?.auditRefId &&
      openNewPage(AppRouteConst.getPlanningAndRequestById(data?.auditRefId)),
    width: 40,
  },
  {
    title: 'Report of findings S.No',
    dataIndex: 'sNo',
    sortField: 'sNo',
    isSort: true,
    width: 30,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    sortField: 'vesselName',
    isSort: true,
    width: 85,
  },
  {
    title: 'Lead inspector',
    dataIndex: 'leadAuditor',
    sortField: 'leadAuditor',
    isSort: true,
    width: 100,
  },
  {
    title: 'Actual inspection from date',
    dataIndex: 'plannedFromDate',
    sortField: 'plannedFromDate',
    isDateTime: true,
    isSort: true,
    width: 160,
  },
];

// list item view tab

export const columnAuditChecklistTemplates: ColumnTableType[] = [
  {
    title: 'Template code',
    dataIndex: 'code',
    width: 95,
    isHightLight: true,
  },
  {
    title: 'Template name',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: 'Revision date',
    dataIndex: 'revisionDate',
    width: 90,
    isDateTime: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 45,
  },
];

export const columnPlanningAndRequest: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
  },
  {
    title: 'Vessel name',
    dataIndex: 'vesselName',
    width: 85,
  },
  {
    title: 'Company name',
    dataIndex: 'auditCompanyName',
    width: 85,
  },
  {
    title: 'Lead inspector',
    dataIndex: 'auditorName',
    width: 85,
  },
  {
    title: 'Planned Inspection Date From',
    dataIndex: 'plannedFromDate',
    isDateTime: true,
    width: 165,
  },
  {
    title: 'Planned Inspection Date To',
    dataIndex: 'plannedToDate',
    isDateTime: true,
    width: 145,
  },
];
export const columnPlanningAndRequestAuditor: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
  },
  {
    title: 'Vessel name',
    dataIndex: ['vessel', 'name'],
    width: 85,
  },
  {
    title: 'Company',
    dataIndex: 'auditCompanyName',
    width: 85,
  },
  {
    title: 'Entity',
    dataIndex: 'entityType',
    width: 85,
  },
  {
    title: 'Lead inspector',
    dataIndex: ['leadAuditor', 'username'],
    width: 85,
  },

  {
    title: 'Planned Inspection Date From',
    dataIndex: 'plannedFromDate',
    isDateTime: true,
    width: 165,
  },
  {
    title: 'Planned Inspection Date To',
    dataIndex: 'plannedToDate',
    isDateTime: true,
    width: 145,
  },
];
export const columnInternalAuditReportTab: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
  },
  {
    title: 'S.No',
    dataIndex: 'serialNumber',
    isHightLight: true,
    width: 30,
  },
  {
    title: 'Vessel name',
    dataIndex: ['vessel', 'name'],
    width: 85,
  },
  {
    title: 'Company name',
    dataIndex: 'auditCompanyName',
    width: 85,
  },

  {
    title: 'Remarks for rejection',
    dataIndex: 'status',
    width: 45,
  },
];

export const columnReportOfFindingTab: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refNo',
    width: 40,
  },
  {
    title: 'S.No',
    isHightLight: true,
    dataIndex: 'sNo',
    width: 30,
  },
  {
    title: 'Vessel name',
    dataIndex: ['vessel', 'name'],
    width: 85,
  },
  {
    title: 'Company name',
    dataIndex: 'auditCompanyName',
    width: 85,
  },
  {
    title: 'Remarks for rejection',
    dataIndex: 'status',
    width: 45,
  },
];
export const columnPlanningAndRequestVessel: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
  },
  {
    title: 'Vessel name',
    dataIndex: ['vessel', 'name'],
    width: 85,
  },

  {
    title: 'Lead inspector',
    dataIndex: ['leadAuditor', 'username'],
    width: 85,
  },
  {
    title: 'Planned Inspection Date From',
    dataIndex: 'plannedFromDate',
    isDateTime: true,
    width: 165,
  },
  {
    title: 'Planned Inspection Date To',
    dataIndex: 'plannedToDate',
    isDateTime: true,
    width: 145,
  },
];
export const columnPlanningAndRequestVesselAuditor: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
  },
  {
    title: 'S.no',
    dataIndex: 'auditNo',
    width: 85,
    isHightLight: true,
  },
  {
    title: 'Entity',
    dataIndex: 'entityType',
    width: 85,
  },
  {
    title: 'Vessel name',
    dataIndex: ['vessel', 'name'],
    width: 85,
  },

  {
    title: 'Lead inspector',
    dataIndex: ['leadAuditor', 'username'],
    width: 85,
  },
  {
    title: 'Planned Inspection Date From',
    dataIndex: 'plannedFromDate',
    isDateTime: true,
    width: 165,
  },
  {
    title: 'Planned Inspection Date To',
    dataIndex: 'plannedToDate',
    isDateTime: true,
    width: 145,
  },
  {
    title: 'Remarks for rejection ',
    dataIndex: 'plannedToDate',
    isDateTime: true,
    width: 145,
  },
];
export const columnPlanningAndRequestOffice: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
  },
  {
    title: 'Company name',
    dataIndex: 'auditCompanyName',
    width: 85,
  },

  {
    title: 'Lead inspector',
    dataIndex: ['leadAuditor', 'username'],
    width: 85,
  },
  {
    title: 'Planned Inspection Date From',
    dataIndex: 'plannedFromDate',
    isDateTime: true,
    width: 165,
  },
  {
    title: 'Planned Inspection Date To',
    dataIndex: 'plannedToDate',
    isDateTime: true,
    width: 145,
  },
];
export const columnPlanningAndRequestOfficeAuditor: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
  },
  {
    title: 'Company name',
    dataIndex: 'auditCompanyName',
    width: 85,
  },

  {
    title: 'Lead inspector',
    dataIndex: ['leadAuditor', 'username'],
    width: 85,
  },
  {
    title: 'Planned Inspection Date From',
    dataIndex: 'plannedFromDate',
    isDateTime: true,
    width: 165,
  },
  {
    title: 'Planned Inspection Date To',
    dataIndex: 'plannedToDate',
    isDateTime: true,
    width: 145,
  },
];

export const dashboardCompanyLayout = [
  { i: 'avgFindingsPerAuditPlan', x: 0, y: 0, w: 2, h: 4 },
  { i: 'rateOfOverdueReports', x: 2, y: 0, w: 2, h: 4 },
  { i: 'averageWorkloadOfAuditorByMonth', x: 0, y: 4, w: 4, h: 5 },
  { i: 'totalFindings', x: 4, y: 0, w: 8, h: 9 },
  { i: 'inspectionChecklistStatus', x: 0, y: 9, w: 4, h: 3 },
  { i: 'reportOfFindingsStatus', x: 4, y: 9, w: 4, h: 3 },
  { i: 'inspectionReportStatus', x: 8, y: 9, w: 4, h: 3 },
  { i: 'trendsOfAuditAndInspectionActivities', x: 0, y: 12, w: 12, h: 9 },
  { i: 'openTasks', x: 0, y: 21, w: 9, h: 10 },
  { i: 'numberOfUpcomingReportsByVessel', x: 9, y: 25, w: 3, h: 10 },
  { i: 'upcomingInspectionPlans', x: 0, y: 31, w: 12, h: 24.5 },
  { i: 'trendsOfOutstandingIssues', x: 0, y: 55.5, w: 8, h: 10 },
  { i: 'outstandingIssue', x: 8, y: 55.5, w: 4, h: 10 },
  { i: 'carCapNeedReviewing', x: 0, y: 40, w: 12, h: 7 },
  { i: 'trendOfOutStandingCarCapIssue', x: 0, y: 49, w: 8, h: 12 },
  { i: 'outStandingCarCapIssue', x: 8, y: 49, w: 4, h: 12 },
];
