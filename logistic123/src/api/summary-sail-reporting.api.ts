import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  GeneralReportParams,
  PendingActionParams,
  SailReportingGeneralReportResponse,
  SailReportingLatestRecordsUpdateResponse,
  SailReportingPendingActionResponse,
} from 'models/api/summary-sail-reporting/summary-sail-reporting.model';
import { ASSETS_API_SAIL_REPORTING_SUMMARY } from './endpoints/config.endpoint';

export const getSailReportingGeneralReportActionsApi = (
  dataParams: GeneralReportParams,
) => {
  const { vesselId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<SailReportingGeneralReportResponse>(
    `${ASSETS_API_SAIL_REPORTING_SUMMARY}/general-report/${vesselId}?${params}`,
  );
};

export const getSailReportingLatestRecordsUpdateActionsApi = (id: string) =>
  requestAuthorized.get<SailReportingLatestRecordsUpdateResponse>(
    `${ASSETS_API_SAIL_REPORTING_SUMMARY}/latest-records-update/${id}`,
  );

export const getSailReportingPendingActionsApi = (
  dataParams: PendingActionParams,
) => {
  const { id, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<SailReportingPendingActionResponse>(
    `${ASSETS_API_SAIL_REPORTING_SUMMARY}/pending-action/${id}?${params}`,
  );
};
