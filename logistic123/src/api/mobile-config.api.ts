import { requestAuthorized } from 'helpers/request';
import { MobileConfig } from 'models/api/mobile-config/mobile-config';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_MOBILE_CONFIG } from './endpoints/config.endpoint';

export const getListMobileConfigActionsApi = (dataParams?: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<MobileConfig>(
    `${ASSETS_API_MOBILE_CONFIG}?${params}`,
  );
};

export const updateMobileConfigActionsApi = (dataParams) =>
  requestAuthorized.put<MobileConfig>(ASSETS_API_MOBILE_CONFIG, dataParams);
