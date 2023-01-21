import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  GetPortStateControlsParams,
  GetPortStateControlsResponse,
  CreatePortStateControlParams,
  PortStateControlDetailResponse,
  UpdatePortStateControlParams,
} from 'models/api/port-state-control/port-state-control.model';
import queryString from 'query-string';
import { ASSETS_API_PORT_STATE_CONTROL } from './endpoints/config.endpoint';

export const getListPortStateControlActionsApi = (
  dataParams: GetPortStateControlsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPortStateControlsResponse>(
    `${ASSETS_API_PORT_STATE_CONTROL}?${params}`,
  );
};

export const deletePortStateControlActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_PORT_STATE_CONTROL}/${dataParams}`,
  );

export const createPortStateControlActionsApi = (
  dataParams: CreatePortStateControlParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_PORT_STATE_CONTROL, dataParams)
    .catch((error) => Promise.reject(error));

export const getPortStateControlDetailActionsApi = (
  dataParams: CommonApiParam,
) => {
  const { id, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<PortStateControlDetailResponse>(
    `${ASSETS_API_PORT_STATE_CONTROL}/${id}?${params}`,
  );
};

export const updatePortStateControlDetailActionsApi = (
  dataParams: UpdatePortStateControlParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_PORT_STATE_CONTROL}/${dataParams.id}`,
    dataParams.data,
  );
