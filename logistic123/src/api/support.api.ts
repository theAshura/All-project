import { requestAuthorized } from 'helpers/request';
import {
  GetCountryParams,
  GetProvinceParams,
  Image,
  GetCountryResponsive,
} from 'models/api/support.model';

import queryString from 'query-string';
import {
  SUPPORT_API_COUNTRY,
  SUPPORT_API_UPLOAD,
} from './endpoints/config.endpoint';

export const getCountryApi = (dataParams: GetCountryParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCountryResponsive>(
    `${SUPPORT_API_COUNTRY}?${params}`,
  );
};

export const getProvinceApi = (dataParams: GetProvinceParams) => {
  const params = queryString.stringify(dataParams?.data);
  return requestAuthorized.get<GetProvinceParams>(
    `${SUPPORT_API_COUNTRY}/${dataParams.countryId}/province?${params}`,
  );
};

export const uploadFileApi = (dataParams: FormData) =>
  requestAuthorized.post<Image[]>(SUPPORT_API_UPLOAD, dataParams);

export const getUrlImageApi = (id: string) =>
  requestAuthorized.get<Image>(`${SUPPORT_API_UPLOAD}/${id}/detail`);
