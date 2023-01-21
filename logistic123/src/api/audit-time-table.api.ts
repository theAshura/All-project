import { requestAuthorized } from 'helpers/request';
import {
  GetAuditTimeTablesParams,
  GetAuditTimeTablesResponse,
  CreateAuditTimeTableParams,
  AuditTimeTableDetailResponse,
  UpdateAuditTimeTableParams,
  DateCalendarsResponse,
} from 'models/api/audit-time-table/audit-time-table.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_AUDIT_TIME_TABLE } from './endpoints/config.endpoint';

export const getListAuditTimeTablesActionsApi = (
  dataParams: GetAuditTimeTablesParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAuditTimeTablesResponse>(
    `${ASSETS_API_AUDIT_TIME_TABLE}?${params}`,
  );
};

export const deleteAuditTimeTableActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_AUDIT_TIME_TABLE}/${dataParams}`,
  );

export const createAuditTimeTableActionsApi = (
  dataParams: CreateAuditTimeTableParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_AUDIT_TIME_TABLE, dataParams)
    .catch((error) => Promise.reject(error));

export const getAuditTimeTableDetailActionsApi = (id: string) =>
  requestAuthorized.get<AuditTimeTableDetailResponse>(
    `${ASSETS_API_AUDIT_TIME_TABLE}/${id}`,
  );

export const updateAuditTimeTablePermissionDetailActionsApi = (
  dataParams: UpdateAuditTimeTableParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_TIME_TABLE}/${dataParams.id}`,
    dataParams.data,
  );

export const submitAuditTimeTableActionsApi = (dataParams: string) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_TIME_TABLE}/${dataParams}/submit`,
  );

export const getDataCalendarApi = (dataParams: CommonApiParam) =>
  requestAuthorized.get<DateCalendarsResponse>(
    `${ASSETS_API_AUDIT_TIME_TABLE}/${dataParams.id}/calendar`,
  );

export const recallApi = (id: string) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_TIME_TABLE}/${id}/undo-submit`,
  );

export const closeOutApi = (params?: { remark?: string; id: string }) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_TIME_TABLE}/${params.id}/close-out`,
    params,
  );
