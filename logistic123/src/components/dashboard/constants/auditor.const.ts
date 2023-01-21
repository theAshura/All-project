import { ColumnTableType } from 'components/common/table-antd/TableAntd';
import { AppRouteConst } from 'constants/route.const';
import { openNewPage } from 'helpers/utils.helper';

export const columnAuditTimeTableNotClosedOut: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
    onClickHightLight: (data) =>
      data &&
      data?.planningRequestId &&
      openNewPage(
        AppRouteConst.getPlanningAndRequestById(data?.planningRequestId),
      ),
  },
  {
    title: `S.No`,
    dataIndex: 'sno',
    width: 30,
    isHightLight: true,
  },
  {
    title: 'Vessel Name',
    dataIndex: 'vesselName',
    width: 85,
  },
  {
    title: 'Company name',
    dataIndex: 'auditCompanyName',
    width: 85,
  },
  {
    title: 'Audit Ref.Id',
    dataIndex: 'auditRefId',
    width: 75,
  },
  {
    title: 'Actual Inspection From Date',
    dataIndex: 'actualFromDate',
    isDateTime: true,
    width: 155,
  },
];

export const columnUpcomingAuditPlanVessel: ColumnTableType[] = [
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
    title: 'Upcoming audit plans',
    dataIndex: 'upComingPr',
    sortField: 'upComingPr',
    isSort: true,
    width: 200,
  },
];

export const columnUpcomingReportVessel: ColumnTableType[] = [
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
    title: 'Upcoming inspection reports',
    dataIndex: 'upComingIAR',
    sortField: 'upComingIAR',
    isSort: true,
    width: 200,
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
    title: 'Total open non-conformity finding',
    dataIndex: 'total',
    sortField: 'total',
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

export const columnAuditTimeTable: ColumnTableType[] = [
  {
    title: 'Reference number',
    dataIndex: 'refNo',
    sortField: 'refNo',
    isSort: true,
    width: 120,
  },
  {
    title: 'Audit ref ID',
    dataIndex: 'auditRefId',
    sortField: 'auditRefId',
    isSort: true,
    width: 75,
  },
  {
    title: 'S.No',
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
    title: 'Audit Ref.ID',
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
    title: 'Ref.ID',
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
    title: 'S.No',
    dataIndex: 'serialNumber',
    sortField: 'serialNumber',
    isSort: true,
    isHightLight: true,
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
    title: 'Status',
    dataIndex: 'status',
    sortField: 'status',
    isSort: true,
    width: 50,
  },
];

export const columnReportOfFinding: ColumnTableType[] = [
  {
    title: 'Audit Ref.ID',
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
    title: 'Ref.ID',
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
    title: 'S.No',
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

export const columnAuditPlansNeedReviewing: ColumnTableType[] = [
  {
    title: 'Ref.ID',
    dataIndex: 'refId',
    width: 40,
    isHightLight: true,
    onClickHightLight: (data) => {
      if (data && data?.id) {
        openNewPage(AppRouteConst.getPlanningAndRequestById(data?.id));
      }
    },
  },
  {
    title: `S.No`,
    dataIndex: 'sno',
    width: 30,
    isHightLight: true,
  },
  {
    title: 'Vessel Name',
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
    dataIndex: 'leadAuditor',
    width: 130,
  },
  {
    title: 'Planned Inspection Date From',
    dataIndex: 'actualFromDate',
    width: 165,
    isDateTime: true,
  },
  {
    title: 'Planned Inspection Date To',
    dataIndex: 'actualToDate',
    width: 145,
    isDateTime: true,
  },
];

export enum ModalTabType {
  AUDIT_TIME_TABLE_NOT_CLOSE_OUT = 'AUDIT_TIME_TABLE_NOT_CLOSE_OUT',
  AUDIT_PLAN_NEED_REVIEW = 'AUDIT_PLAN_NEED_REVIEW',
  UPCOMING_AUDIT_PLAN_VESSEL = 'UPCOMING_AUDIT_PLAN_VESSEL',
  UPCOMING_REPORTS_VESSEL = 'UPCOMING_REPORTS_VESSEL',
  NON_CONFORMITY = 'NON_CONFORMITY',
  OBSERVATIONS = 'OBSERVATIONS',
  NUMBER_AUDIT_TIME_TABLE = 'NUMBER_AUDIT_TIME_TABLE',
  NUMBER_REPORT_OF_FINDING = 'NUMBER_REPORT_OF_FINDING',
  NUMBER_INTERNAL_AUDIT_REPORT = 'NUMBER_INTERNAL_AUDIT_REPORT',
  HIDDEN = 'HIDDEN',
}

export const OutstandingIssue = [
  {
    name: 'Number of open non-conformity (last 30 days)',
    number: '12,2321',
    modalType: ModalTabType.NON_CONFORMITY,
  },
  {
    name: 'Number of open observations (last 30 days)',
    number: '12,2321',
    modalType: ModalTabType.OBSERVATIONS,
  },
  {
    name: 'Number of inspection time tables not closed out',
    number: '12,2321',
    modalType: ModalTabType.NUMBER_AUDIT_TIME_TABLE,
  },
  {
    name: 'Number of report of findings not closed out',
    number: '12,2321',
    modalType: ModalTabType.NUMBER_REPORT_OF_FINDING,
  },
  {
    name: 'Number of inspection reports not closed out',
    number: '12,2321',
    modalType: ModalTabType.NUMBER_INTERNAL_AUDIT_REPORT,
  },
];
