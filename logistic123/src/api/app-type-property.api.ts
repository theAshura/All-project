import { requestAuthorized } from 'helpers/request';
import {
  AppTypeProperty,
  ListAppTypePropertyResponse,
} from 'models/api/app-type-property/app-type-property.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_APP_TYPE_PROPERTY } from './endpoints/config.endpoint';

export const getListAppTypePropertyActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListAppTypePropertyResponse>(
    `${ASSETS_API_APP_TYPE_PROPERTY}?${params}`,
  );
};

export const deleteAppTypePropertyActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_APP_TYPE_PROPERTY}/${dataParams}`,
  );

export const createAppTypePropertyActionsApi = (dataParams: AppTypeProperty) =>
  requestAuthorized
    .post<AppTypeProperty>(ASSETS_API_APP_TYPE_PROPERTY, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailAppTypePropertyActionApi = (id: string) =>
  requestAuthorized.get<AppTypeProperty>(
    `${ASSETS_API_APP_TYPE_PROPERTY}/${id}`,
  );

export const updateAppTypePropertyActionApi = (
  id: string,
  data: AppTypeProperty,
) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_APP_TYPE_PROPERTY}/${id}`, data)
    .catch((error) => Promise.reject(error));
