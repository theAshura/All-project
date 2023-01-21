import queryString from 'query-string';
import { CountryMasterCreationBody } from 'models/api/country-master/country-master.model';
import { requestAuthorized } from 'helpers/request';
import { CommonApiParam } from 'models/common.model';
import { SUPPORT_API_COUNTRY } from './endpoints/config.endpoint';

export const getListCountryMasterAPI = (data: CommonApiParam) => {
  const params = queryString.stringify(data);
  return requestAuthorized.get<CommonApiParam>(
    `${SUPPORT_API_COUNTRY}/list?${params}`,
  );
};

export const createNewCountryMasterAPI = (body: CountryMasterCreationBody) =>
  requestAuthorized.post<any>(SUPPORT_API_COUNTRY, body);
