import { requestAuthorized } from 'helpers/request';
import {
  CreateTerminalParams,
  GetTerminalResponse,
  Terminal,
  TerminalDetailResponse,
  UpdateTerminalParams,
} from 'models/api/terminal/terminal.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_TERMINAL } from './endpoints/config.endpoint';

export const getListTerminalActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetTerminalResponse>(
    `${ASSETS_API_TERMINAL}?${params}`,
  );
};

export const getListTerminalByMainIdActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<Terminal[]>(`${ASSETS_API_TERMINAL}?${params}`);
};

export const deleteTerminalActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_TERMINAL}/${dataParams}`);

export const createTerminalActionsApi = (dataParams: CreateTerminalParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_TERMINAL, dataParams)
    .catch((error) => Promise.reject(error));

export const getTerminalDetailActionsApi = (id: string) =>
  requestAuthorized.get<TerminalDetailResponse>(`${ASSETS_API_TERMINAL}/${id}`);

export const updateTerminalDetailActionsApi = (
  dataParams: UpdateTerminalParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_TERMINAL}/${dataParams.id}`,
    dataParams.data,
  );
