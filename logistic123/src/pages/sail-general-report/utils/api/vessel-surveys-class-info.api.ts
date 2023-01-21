import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { ASSETS_API_VESSEL_SCREENING } from 'api/endpoints/config.endpoint';
import { GetListVesselScreeningParams } from '../models/common.model';
import {
  GetListVesselScreeningSurveysClassInfo,
  UpdateVesselSurveysClassInfoParams,
} from '../models/vessel-surveys-class-info.model';

export const getListVesselSurveyClassInfoActionsApi = (
  id: string,
  dataParams: GetListVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselScreeningSurveysClassInfo>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/survey-class-info?${params}`,
  );
};

export const updateVesselSurveyClassInfoctionsApi = (
  dataParams: UpdateVesselSurveysClassInfoParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/survey-class-info`,
    data,
  );
};
