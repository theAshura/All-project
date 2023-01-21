import { requestAuthorized } from 'helpers/request';
import {
  ListTemplateResponse,
  TemplateDetail,
} from 'models/api/template/template.model';

import { CommonApiParam } from 'models/common.model';

import queryString from 'query-string';
import { ASSETS_API_DATA_GRID_TEMPLATE } from './endpoints/config.endpoint';

export const getListTemplateActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListTemplateResponse>(
    `${ASSETS_API_DATA_GRID_TEMPLATE}?${params}`,
  );
};

export const deleteTemplateActionsApi = (dataParams: string[]) =>
  requestAuthorized.post<void>(`${ASSETS_API_DATA_GRID_TEMPLATE}/delete`, {
    listId: dataParams,
  });

export const createTemplateActionsApi = (dataParams: TemplateDetail) =>
  requestAuthorized
    .post<TemplateDetail>(ASSETS_API_DATA_GRID_TEMPLATE, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailTemplateActionApi = (id: string) =>
  requestAuthorized.get<TemplateDetail>(
    `${ASSETS_API_DATA_GRID_TEMPLATE}/${id}`,
  );

export const updateTemplateActionApi = (data: TemplateDetail) => {
  const { id, ...other } = data;
  return requestAuthorized
    .put<void>(`${ASSETS_API_DATA_GRID_TEMPLATE}/${id}`, other)
    .catch((error) => Promise.reject(error));
};
