import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';

import queryString from 'query-string';
import {
  ListPSCDeficiencyResponse,
  PSCDeficiency,
} from 'models/api/psc-deficiency/psc-deficiency.model';
import { ASSETS_API_PSC_DEFICIENCY } from './endpoints/config.endpoint';

export const getListPSCDeficiencyActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListPSCDeficiencyResponse>(
    `${ASSETS_API_PSC_DEFICIENCY}?${params}`,
  );
};

export const deletePSCDeficiencyActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_PSC_DEFICIENCY}/${dataParams}`);

export const createPSCDeficiencyActionsApi = (dataParams: PSCDeficiency) =>
  requestAuthorized
    .post<PSCDeficiency>(ASSETS_API_PSC_DEFICIENCY, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailPSCDeficiencyActionApi = (id: string) =>
  requestAuthorized.get<PSCDeficiency>(`${ASSETS_API_PSC_DEFICIENCY}/${id}`);

export const updatePSCDeficiencyActionApi = (id: string, data: PSCDeficiency) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_PSC_DEFICIENCY}/${id}`, data)
    .catch((error) => Promise.reject(error));
