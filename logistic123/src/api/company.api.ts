import { requestAuthorized } from 'helpers/request';
import {
  CompanyManagement,
  GetCompanyManagementParams,
  GetCompanysParams,
} from 'models/api/company/company.model';
import axios from 'axios';
import queryString from 'query-string';
import {
  CreateManagementParams,
  UpdateCompanyManagementParams,
  IEmailCompanyConfig,
} from 'models/store/company/company.model';
import { API_BASE_URL } from 'constants/common.const';
import { ASSETS_API_COMPANY } from './endpoints/config.endpoint';

export const getListCompanyManagementApi = (
  dataParams: GetCompanyManagementParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCompanyManagementParams>(
    `${ASSETS_API_COMPANY}?${params}`,
  );
};

export const createCompanyManagementApi = (
  dataParams: CreateManagementParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_COMPANY, dataParams)
    .catch((error) => Promise.reject(error));

export const getListCompanyManagementDetailApi = (id: string) =>
  requestAuthorized.get<GetCompanyManagementParams>(
    `${ASSETS_API_COMPANY}/${id}`,
  );

export const deleteCompanyManagementApi = (id: string) =>
  requestAuthorized.delete(`${ASSETS_API_COMPANY}/${id}`);

export const updateCompanyManagementApi = (
  dataParams: UpdateCompanyManagementParams,
) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_COMPANY}/${dataParams.id}`, dataParams?.data)
    .catch((error) => Promise.reject(error));

export const getEmailCompanyConfigApi = () =>
  requestAuthorized.get<IEmailCompanyConfig>(
    `${ASSETS_API_COMPANY}/mail-config`,
  );

export const getListCompanyAxiosApi = (dataParams: any, token: string) => {
  const params = queryString.stringify(dataParams);
  return axios.get<any>(
    `${API_BASE_URL}${ASSETS_API_COMPANY}/child-company?${params}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const switchCompanyApi = (dataParams: any) =>
  requestAuthorized
    .post<void>('/assets/api/v1/user/switch-company', dataParams)
    .catch((error) => Promise.reject(error));

export const getListChildCompanyApi = (dataParams: any) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(
    `${ASSETS_API_COMPANY}/child-company?${params}`,
  );
};

export const getListSubCompanyApi = (dataParams: GetCompanysParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<CompanyManagement[]>(
    `${ASSETS_API_COMPANY}/sub-company?${params}`,
  );
};
