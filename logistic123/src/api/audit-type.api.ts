import { requestAuthorized } from 'helpers/request';
import {
  GetAuditTypesParams,
  GetAuditTypesResponse,
  CreateAuditTypeParams,
  AuditTypeDetailResponse,
  UpdateAuditTypeParams,
} from 'models/api/audit-type/audit-type.model';
import queryString from 'query-string';
import { ASSETS_API_AUDIT_TYPE } from './endpoints/config.endpoint';

// const params = queryString.stringify({ lang: 'en' });

export const getListAuditTypesActionsApi = (
  dataParams: GetAuditTypesParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAuditTypesResponse>(
    `${ASSETS_API_AUDIT_TYPE}?${params}`,
  );
};

export const deleteAuditTypeActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_AUDIT_TYPE}/${dataParams}`);

export const createAuditTypeActionsApi = (dataParams: CreateAuditTypeParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_AUDIT_TYPE, dataParams)
    .catch((error) => Promise.reject(error));

export const getAuditTypeDetailActionsApi = (id: string) =>
  requestAuthorized.get<AuditTypeDetailResponse>(
    `${ASSETS_API_AUDIT_TYPE}/${id}`,
  );

export const updateAuditTypePermissionDetailActionsApi = (
  dataParams: UpdateAuditTypeParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_AUDIT_TYPE}/${dataParams.id}`,
    dataParams.data,
  );
