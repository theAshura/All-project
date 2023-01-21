import { requestAuthorized } from 'helpers/request';
import {
  GetIncidentTypesParams,
  GetIncidentTypesResponse,
  CreateIncidentTypeParams,
  IncidentTypeDetailResponse,
  UpdateIncidentTypeParams,
  CheckExitCodeParams,
} from 'models/api/incident-type/incident-type.model';
import queryString from 'query-string';
import {
  ASSETS_API_INCIDENT_TYPE,
  ASSETS_API_COMPANY_SUPPORT,
} from './endpoints/config.endpoint';

export const getListIncidentTypesActionsApi = (
  dataParams: GetIncidentTypesParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetIncidentTypesResponse>(
    `${ASSETS_API_INCIDENT_TYPE}?${params}`,
  );
};

export const deleteIncidentTypeActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_INCIDENT_TYPE}/${dataParams}`);

export const createIncidentTypeActionsApi = (
  dataParams: CreateIncidentTypeParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_INCIDENT_TYPE, dataParams)
    .catch((error) => Promise.reject(error));

export const getIncidentTypeDetailActionsApi = (id: string) =>
  requestAuthorized.get<IncidentTypeDetailResponse>(
    `${ASSETS_API_INCIDENT_TYPE}/${id}`,
  );

export const updateIncidentTypeDetailActionsApi = (
  dataParams: UpdateIncidentTypeParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INCIDENT_TYPE}/${dataParams.id}`,
    dataParams.data,
  );

export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
