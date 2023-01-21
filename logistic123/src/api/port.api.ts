import { requestAuthorized } from 'helpers/request';
import {
  ListPortResponse,
  ParamsListPort,
  Port,
} from 'models/api/port/port.model';
import queryString from 'query-string';
import {
  ASSETS_API_PORT,
  ASSETS_API_TIME_ZONE,
} from './endpoints/config.endpoint';

export const getListPortActionsApi = (dataParams: ParamsListPort) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListPortResponse>(
    `${ASSETS_API_PORT}?${params}`,
  );
};

export const getListPortStrongPreferenceActionsApi = (
  dataParams: ParamsListPort,
) =>
  requestAuthorized.post<ListPortResponse>(
    `${ASSETS_API_PORT}/strong-preference`,
    dataParams,
  );

export const deletePortActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_PORT}/${dataParams}`);

export const createPortActionsApi = (dataParams: Port) =>
  requestAuthorized
    .post<Port>(ASSETS_API_PORT, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailPortActionApi = (id: string) =>
  requestAuthorized.get<Port>(`${ASSETS_API_PORT}/${id}`);

export const updatePortActionApi = (id: string, data: Port) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_PORT}/${id}`, data)
    .catch((error) => Promise.reject(error));

export const getGMTActionsApi = () =>
  requestAuthorized.get(ASSETS_API_TIME_ZONE);
