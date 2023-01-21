import { requestAuthorized } from 'helpers/request';
import {
  GetInspectorTimeOffsParams,
  GetInspectorTimeOffsResponse,
  CreateInspectorTimeOffParams,
  InspectorTimeOffDetailResponse,
  UpdateInspectorTimeOffParams,
} from 'models/api/inspector-time-off/inspector-time-off.model';
import queryString from 'query-string';
import { ASSETS_API_INSPECTOR_TIME_OFF } from './endpoints/config.endpoint';

export const getListInspectorTimeOffsActionsApi = (
  dataParams: GetInspectorTimeOffsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectorTimeOffsResponse>(
    `${ASSETS_API_INSPECTOR_TIME_OFF}?${params}`,
  );
};

export const deleteInspectorTimeOffActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_INSPECTOR_TIME_OFF}/${dataParams}`,
  );

export const createInspectorTimeOffActionsApi = (
  dataParams: CreateInspectorTimeOffParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_INSPECTOR_TIME_OFF, dataParams)
    .catch((error) => Promise.reject(error));

export const getInspectorTimeOffDetailActionsApi = (id: string) =>
  requestAuthorized.get<InspectorTimeOffDetailResponse>(
    `${ASSETS_API_INSPECTOR_TIME_OFF}/${id}`,
  );

export const updateInspectorTimeOffPermissionDetailActionsApi = (
  dataParams: UpdateInspectorTimeOffParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INSPECTOR_TIME_OFF}/${dataParams.id}`,
    dataParams.data,
  );
