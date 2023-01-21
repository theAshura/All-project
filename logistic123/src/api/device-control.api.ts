import { requestAuthorized } from 'helpers/request';
import {
  DeviceControl,
  ListDeviceControlResponse,
} from 'models/api/device-control/device-control.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_DEVICE_CONTROL } from './endpoints/config.endpoint';

export const getListDeviceControlActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListDeviceControlResponse>(
    `${ASSETS_API_DEVICE_CONTROL}?${params}`,
  );
};

export const deleteDeviceControlActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_DEVICE_CONTROL}/${dataParams}`);

export const createDeviceControlActionsApi = (dataParams: DeviceControl) =>
  requestAuthorized
    .post<DeviceControl>(ASSETS_API_DEVICE_CONTROL, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailDeviceControlActionApi = (id: string) =>
  requestAuthorized.get<DeviceControl>(`${ASSETS_API_DEVICE_CONTROL}/${id}`);

export const updateDeviceControlActionApi = (id: string, data: DeviceControl) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_DEVICE_CONTROL}/${id}`, data)
    .catch((error) => Promise.reject(error));
