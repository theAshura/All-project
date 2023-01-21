import { requestAuthorized } from 'helpers/request';
import {
  // GetEventTypesParams,
  GetEventTypesResponse,
  GetCompanysResponse,
  CreateEventTypeParams,
  EventTypeDetailResponse,
  UpdateEventTypeParams,
  GetCompanysParams,
  CheckExitCodeParams,
} from 'models/api/event-type/event-type.model';
import { CheckUniqueResponsive, CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_EVENT_TYPE,
  ASSETS_API_COMPANY,
  ASSETS_API_COMPANY_SUPPORT,
} from './endpoints/config.endpoint';

export const getListEventTypesActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetEventTypesResponse>(
    `${ASSETS_API_EVENT_TYPE}?${params}`,
  );
};

export const getListCompanyActionsApi = (dataParams: GetCompanysParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCompanysResponse>(
    `${ASSETS_API_COMPANY}?${params}`,
  );
};

export const deleteEventTypeActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_EVENT_TYPE}/${dataParams}`);

export const createEventTypeActionsApi = (dataParams: CreateEventTypeParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_EVENT_TYPE, dataParams)
    .catch((error) => Promise.reject(error));

export const getEventTypeDetailActionsApi = (id: string) =>
  requestAuthorized.get<EventTypeDetailResponse>(
    `${ASSETS_API_EVENT_TYPE}/${id}`,
  );

export const updateEventTypePermissionDetailActionsApi = (
  dataParams: UpdateEventTypeParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_EVENT_TYPE}/${dataParams.id}`,
    dataParams.data,
  );

export const getListSubCompanyApi = (dataParams: GetCompanysParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCompanysResponse>(
    `${ASSETS_API_COMPANY}/sub-company?${params}`,
  );
};

export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<CheckUniqueResponsive>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
