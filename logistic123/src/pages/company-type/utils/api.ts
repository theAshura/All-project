import { ASSETS_API_COMPANY_TYPE } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ResponsesCompanyType, CompanyTypeBody } from './model';

export const getListCompanyTypeActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ResponsesCompanyType>(
    `${ASSETS_API_COMPANY_TYPE}?${params}`,
  );
};

export const createCompanyTypeApiRequest = (params?: CompanyTypeBody) =>
  requestAuthorized.post<void>(ASSETS_API_COMPANY_TYPE, params);

export const getCompanyTypeDetailActionsApi = (id: string) =>
  requestAuthorized.get<any>(`${ASSETS_API_COMPANY_TYPE}/${id}`);

export const updateCompanyTypeActionsApi = (params: CompanyTypeBody) =>
  requestAuthorized.put<any>(
    `${ASSETS_API_COMPANY_TYPE}/${params?.id}`,
    params,
  );

export const deleteCompanyTypeActionsApi = (id: string) =>
  requestAuthorized.delete<any>(`${ASSETS_API_COMPANY_TYPE}/${id}`);
