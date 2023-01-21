import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { ASSETS_API_VESSEL_SCREENING } from 'api/endpoints/config.endpoint';
import { GetListVesselScreeningParams } from '../models/common.model';
import {
  GetListVesselScreeningClassDispensations,
  UpdateVesselClassDispensationsParams,
} from '../models/vessel-class-dispensations.model';

export const getListVesselClassDispensationsApi = (
  id: string,
  dataParams: GetListVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselScreeningClassDispensations>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/class-dispensations?${params}`,
  );
};

export const updateVesselClassDispensationsApi = (
  dataParams: UpdateVesselClassDispensationsParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/class-dispensations`,
    data,
  );
};
