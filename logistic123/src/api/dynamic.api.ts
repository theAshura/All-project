import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  IDynamicLabels,
  IModuleDynamicLabel,
} from 'models/api/dynamic/dynamic.model';
import { ASSETS_API } from './endpoints/config.endpoint';

export const getListConfigCompanyDynamicLabelsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<IDynamicLabels[]>(
    `${ASSETS_API}/label-config-company?${params}`,
  );
};

export const getListConfigModuleDynamicLabelsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<IModuleDynamicLabel[]>(
    `${ASSETS_API}/module-config-company?${params}`,
  );
};
