export interface GeneralReportParams {
  vesselId: string;
  currentDate: string;
}
export interface PendingActionParams {
  id: string;
  fromDate: string;
  toDate: string;
}

export interface SailReportingGeneralReportResponse {
  incidentsLast3Months: string;
  injuriesLast3Months: string;
  openFindingsExternalInspection: string;
  openFindingsPortStateControl: string;
  openInternalInspection: string;
  overdueCriticalJobs: string;
  overdueJobs: string;
  overdueClassDispensations: string;
}

export interface SailReportingLatestRecordsUpdateResponse {
  [key: string]: string;
}
export interface SailReportingPendingActionResponse {
  otherPendingSMS: string;
  otherPendingTechnical: string;
}

export interface SailReportingSummaryStoreModel {
  loading: boolean;
  generalReportDetail: SailReportingGeneralReportResponse;
  latestRecordsUpdate: SailReportingLatestRecordsUpdateResponse;
  pendingAction: SailReportingPendingActionResponse;
}
