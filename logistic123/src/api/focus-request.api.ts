import { requestAuthorized } from 'helpers/request';
import {
  GetFocusRequestsParams,
  GetFocusRequestsResponse,
  CreateFocusRequestParams,
  FocusRequestDetailResponse,
  UpdateFocusRequestParams,
} from 'models/api/focus-request/focus-request.model';
import queryString from 'query-string';
import { ASSETS_API_FOCUS_REQUEST } from './endpoints/config.endpoint';

export const getListFocusRequestsActionsApi = (
  dataParams: GetFocusRequestsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetFocusRequestsResponse>(
    `${ASSETS_API_FOCUS_REQUEST}?${params}`,
  );
};

export const deleteFocusRequestActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_FOCUS_REQUEST}/${dataParams}`);

export const createFocusRequestActionsApi = (
  dataParams: CreateFocusRequestParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_FOCUS_REQUEST, dataParams)
    .catch((error) => Promise.reject(error));

export const getFocusRequestDetailActionsApi = (id: string) =>
  requestAuthorized.get<FocusRequestDetailResponse>(
    `${ASSETS_API_FOCUS_REQUEST}/${id}`,
  );

export const updateFocusRequestPermissionDetailActionsApi = (
  dataParams: UpdateFocusRequestParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_FOCUS_REQUEST}/${dataParams.id}`,
    dataParams.data,
  );
