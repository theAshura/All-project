import { ASSETS_API } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';

export const getListDivisionActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(`${ASSETS_API}/division?${params}`);
};

export const createDivisionApiRequest = (params?: any) =>
  requestAuthorized.post<void>(`assets/api/v1/division`, params);

export const getDivisionDetailActionsApi = (id: string) =>
  requestAuthorized.get<any>(`${ASSETS_API}/division/${id}`);

export const updateDivisionActionsApi = (params: any) =>
  requestAuthorized.put<any>(`${ASSETS_API}/division/${params?.id}`, params);

export const deleteDivisionActionsApi = (id: string) =>
  requestAuthorized.delete<any>(`${ASSETS_API}/division/${id}`);
