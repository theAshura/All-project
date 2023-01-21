import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  CreateSurveyClassInfoParams,
  DeleteSurveyClassInfoParams,
  GetDetailSurveyClassInfo,
  GetSurveyClassInfoParams,
  GetSurveyClassInfoResponse,
  UpdateSurveyClassInfoParams,
} from 'models/api/survey-class-info/survey-class-info.model';
import { ASSETS_API_SURVEY_CLASS_INFO } from './endpoints/config.endpoint';

export const getListSurveyClassInfoActionsApi = (
  dataParams: GetSurveyClassInfoParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetSurveyClassInfoResponse>(
    `${ASSETS_API_SURVEY_CLASS_INFO}?${params}`,
  );
};
export const createSurveyClassInfoActionsApi = (
  body: CreateSurveyClassInfoParams,
) => requestAuthorized.post<void>(ASSETS_API_SURVEY_CLASS_INFO, body);
export const updateSurveyClassInfoActionsApi = (
  updateParams: UpdateSurveyClassInfoParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_SURVEY_CLASS_INFO}/${updateParams?.id}`,
    updateParams?.body,
  );
export const deleteSurveyClassInfoActionsApi = (
  params: DeleteSurveyClassInfoParams,
) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_SURVEY_CLASS_INFO}/${params.id}`,
  );
export const getDetailSurveyClassInfoActionsApi = (id: string) =>
  requestAuthorized.get<GetDetailSurveyClassInfo>(
    `${ASSETS_API_SURVEY_CLASS_INFO}/${id}`,
  );
