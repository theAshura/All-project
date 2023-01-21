import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import {
  ASSETS_API_INCIDENT_INVESTIGATION,
  ASSETS_API_INCIDENT_SUMMARY,
} from 'api/endpoints/config.endpoint';
import {
  GetListIncidentResponse,
  CreateIncidentParams,
  IncidentDetail,
  UpdateIncidentParams,
  NumberIncident,
  IncidentPlace,
  TypeOfIncident,
  ReviewStatus,
  RiskDetail,
} from '../models/common.model';

export const getListIncidentActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListIncidentResponse>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}?${params}`,
  );
};

export const deleteIncidentActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}/${dataParams}`,
  );

export const createIncidentActionsApi = (dataParams: CreateIncidentParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_INCIDENT_INVESTIGATION, dataParams)
    .catch((error) => Promise.reject(error));

export const getIncidentDetailActionsApi = (id: string) =>
  requestAuthorized.get<IncidentDetail>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}/${id}`,
  );

export const updateIncidentDetailActionsApi = (
  dataParams: UpdateIncidentParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INCIDENT_INVESTIGATION}/${dataParams.id}`,
    dataParams.data,
  );

// summary

export const getNumberIncidentActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<NumberIncident[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/number-incidents?${params}`,
  );
};

export const getIncidentPlaceActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<IncidentPlace[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/incident-place?${params}`,
  );
};

export const getTypeOfIncidentActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<TypeOfIncident[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/incident-types?${params}`,
  );
};

export const getReviewStatusActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ReviewStatus[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/review-status?${params}`,
  );
};

export const getRiskDetailActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<RiskDetail[]>(
    `${ASSETS_API_INCIDENT_SUMMARY}/risk-details?${params}`,
  );
};
