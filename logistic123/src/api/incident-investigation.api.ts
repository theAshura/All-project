import { requestAuthorized } from 'helpers/request';
import {
  GetIncidentInvestigationsParams,
  GetIncidentInvestigationsResponse,
  CreateIncidentInvestigationParams,
  IncidentInvestigationDetailResponse,
  UpdateIncidentInvestigationParams,
} from 'models/api/incident-investigation/incident-investigation.model';
import queryString from 'query-string';
import { ASSETS_API_INCIDENT_INVESTIGATION } from './endpoints/config.endpoint';

export const getListIncidentInvestigationActionsApi = (
  dataParams: GetIncidentInvestigationsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetIncidentInvestigationsResponse>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}?${params}`,
  );
};

export const deleteIncidentInvestigationActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}/${dataParams}`,
  );

export const createIncidentInvestigationActionsApi = (
  dataParams: CreateIncidentInvestigationParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_INCIDENT_INVESTIGATION, dataParams)
    .catch((error) => Promise.reject(error));

export const getIncidentInvestigationDetailActionsApi = (id: string) =>
  requestAuthorized.get<IncidentInvestigationDetailResponse>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}/${id}`,
  );

export const updateIncidentInvestigationDetailActionsApi = (
  dataParams: UpdateIncidentInvestigationParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}/${dataParams.id}`,
    dataParams.data,
  );
