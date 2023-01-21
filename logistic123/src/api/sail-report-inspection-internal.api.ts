import { GetExternalParams } from 'models/api/external/external.model';
import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  CreateSailReportInspectionInternalParams,
  UpdateSailReportInspectionInternalParams,
  SailReportInspectionInternal,
  GetSailReportInspectionInternalParams,
  GetSailReportInspectionInternalResponse,
} from 'models/api/sail-report-inspection-internal/sail-report-inspection-internal.model';
import { ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL } from './endpoints/config.endpoint';

export const getListSailReportInspectionInteralApi = (
  dataParams: GetExternalParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(
    `${ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL}?${params}`,
  );
};

export const createSailReportInspectionInternalApi = (
  dataParams: CreateSailReportInspectionInternalParams,
) =>
  requestAuthorized
    .post<void>(`${ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL}`, dataParams)
    .catch((error) => Promise.reject(error));

export const updateSailReportInspectionInternalApi = (
  dataParams: UpdateSailReportInspectionInternalParams,
) =>
  requestAuthorized
    .put<void>(
      `${ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL}/${dataParams.id}`,
      dataParams.data,
    )
    .catch((error) => Promise.reject(error));

export const getSailReportInspectionInternalDetailApi = (id: string) =>
  requestAuthorized
    .get<SailReportInspectionInternal>(
      `${ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL}/${id}`,
    )
    .catch((error) => Promise.reject(error));

export const getListSailReportInspectionInternalApi = (
  dataParams: GetSailReportInspectionInternalParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetSailReportInspectionInternalResponse>(
    `${ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL}?${params}`,
  );
};

export const deleteSailReportInspectionInternalApi = (id: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL}/${id}`,
  );
