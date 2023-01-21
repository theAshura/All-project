import {
  OtherSMSRequests,
  UpdateOtherSMSRequestParams,
  GetVesselScreeningOtherSMSResponse,
} from 'pages/vessel-screening/utils/models/other-sms.model';
import { ASSETS_API_VESSEL_SCREENING } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';

export const getListVesselScreeningOtherSMSApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<GetVesselScreeningOtherSMSResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/other-sms-records?${params}`,
  );
};

export const getOtherSMSRequestDetailApi = (dataParams: CommonApiParam) => {
  const { vesselScreeningId, id } = dataParams;
  return requestAuthorized.get<OtherSMSRequests>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/other-sms-records/${id}`,
  );
};

export const updateVesselScreeningOtherSMSRequestApi = (
  dataParams: UpdateOtherSMSRequestParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/other-sms-records`,
    data,
  );
};
