import { ASSETS_API_MAP_VIEW } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import {
  GetListInspectionInspector,
  GetPrAuditors,
  GetMapViewPort,
  GetAuditors,
} from './model';

export const getListMapViewInspection = (params?: GetListInspectionInspector) =>
  requestAuthorized.post<void>(`${ASSETS_API_MAP_VIEW}/inspection`, params);

export const getListMapViewInspector = (params?: GetListInspectionInspector) =>
  requestAuthorized.post<void>(`${ASSETS_API_MAP_VIEW}/inspector`, params);

export const getListAuditorsInCompanies = (params?: GetAuditors) =>
  requestAuthorized.post<void>(
    `iam/api/v1/workflow/planning-request/auditors-in-companies`,
    params,
  );

// just for inspection and if have port or country call this api for inspector
export const getListPrAuditorsInCompanies = (params?: GetPrAuditors) =>
  requestAuthorized.post<void>(
    `assets/api/v1/planning-request/pr-auditors`,
    params,
  );

export const getListMapViewPort = (params?: GetMapViewPort) =>
  requestAuthorized.post<void>(`${ASSETS_API_MAP_VIEW}/port`, params);
