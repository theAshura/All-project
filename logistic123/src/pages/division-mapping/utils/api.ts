import { ASSETS_API } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { CreateDivisionMapping } from './model';

export const getListDivisionMappingActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(`${ASSETS_API}/division-mapping?${params}`);
};

export const createDivisionMappingApiRequest = (
  params?: CreateDivisionMapping,
) => requestAuthorized.post<void>(`assets/api/v1/division-mapping`, params);

export const getDivisionMappingDetailActionsApi = (id: string) =>
  requestAuthorized.get<any>(`${ASSETS_API}/division-mapping/${id}`);

export const updateDivisionMappingActionsApi = (params: any) =>
  requestAuthorized.put<any>(
    `${ASSETS_API}/division-mapping/${params?.id}`,
    params,
  );

export const deleteDivisionMappingActionsApi = (id: string) =>
  requestAuthorized.delete<any>(`${ASSETS_API}/division-mapping/${id}`);
