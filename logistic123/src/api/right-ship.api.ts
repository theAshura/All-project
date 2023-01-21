import { requestAuthorized } from 'helpers/request';
import { CommonApiParam } from 'models/common.model';
import { RightShipResponse } from 'models/store/right-ship/right-ship.model';
import queryString from 'query-string';
import {
  ASSETS_API_RIGHT_SHIP,
  ASSETS_API_RIGHT_SHIP_SYNC,
} from './endpoints/config.endpoint';

export const getListRightShipActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<RightShipResponse>(
    `${ASSETS_API_RIGHT_SHIP}?${params}`,
  );
};

export const createRightShipSyncApi = (params: {
  companyId: string;
  fromDate: string;
  toDate: string;
}) =>
  requestAuthorized
    .post<void>(ASSETS_API_RIGHT_SHIP_SYNC, params)
    .catch((error) => Promise.reject(error));
