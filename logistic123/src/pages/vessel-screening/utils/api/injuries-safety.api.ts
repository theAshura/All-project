import {
  InjuriesSafetyRequests,
  UpdateInjuriesSafetyRequestParams,
  GetVesselScreeningInjuriesSafetyResponse,
} from 'pages/vessel-screening/utils/models/injuries-safety.model';
import { ASSETS_API_VESSEL_SCREENING } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';

export const getListVesselScreeningInjuriesSafetyApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<GetVesselScreeningInjuriesSafetyResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/injury?${params}`,
  );
};

export const getInjuriesSafetyRequestDetailApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, id } = dataParams;
  return requestAuthorized
    .get<InjuriesSafetyRequests>(
      `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/injury/${id}`,
    )
    .catch((error) => Promise.reject(error));
};

export const updateVesselScreeningInjuriesSafetyRequestApi = (
  dataParams: UpdateInjuriesSafetyRequestParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/injury`,
    data,
  );
};
