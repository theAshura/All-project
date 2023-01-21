import { requestAuthorized } from 'helpers/request';
import {
  GetAnalysisSectionResponse,
  GetRemarksByDateResponse,
  RemarkParam,
} from 'models/api/home-page/home-page.model';
import queryString from 'query-string';
import {
  ASSETS_API,
  HOME_PAGE_API,
  NOTIFICATION_API,
} from './endpoints/config.endpoint';

export const getListActivityApi = (dataParams?: any) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(`${NOTIFICATION_API}?${params}`);
};

export const getAnalysisDataApi = () =>
  requestAuthorized.get<GetAnalysisSectionResponse>(
    `${HOME_PAGE_API}/analysis-section`,
  );

export const createRemarkApi = (dataParams: RemarkParam) =>
  requestAuthorized
    .post<RemarkParam>(`${ASSETS_API}/homepage-remark`, dataParams)
    .catch((error) => Promise.reject(error));

export const getRemarksByDateApi = (dataParams?: RemarkParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetRemarksByDateResponse>(
    `${ASSETS_API}/homepage-remark?${params}`,
  );
};

export const updateRemarksByDateApi = (dataParams: RemarkParam) =>
  requestAuthorized
    .put<void>(`${ASSETS_API}/homepage-remark/${dataParams.id}`, {
      remark: dataParams.remark,
    })
    .catch((error) => Promise.reject(error));

export const deleteRemarksByDateApi = (dataParams?: RemarkParam) => {
  requestAuthorized.delete<void>(`${ASSETS_API}/homepage-remark/${dataParams}`);
};
