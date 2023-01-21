import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';

import {
  GetListModuleConfigurationData,
  GetListModuleConfigurationResponse,
  LabelConfigDetailResponse,
  ListLabelConfigResponse,
  UpdateModuleConfigDetailBody,
} from 'models/store/module-configuration/module-configuration.model';
import { ASSETS_API_MODULE_CONFIGURATION } from './endpoints/config.endpoint';

export const getListModuleConfigurationActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListModuleConfigurationResponse>(
    `${ASSETS_API_MODULE_CONFIGURATION}?${params}`,
  );
};

export const getDetailModuleConfigurationActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListModuleConfigurationData>(
    `${ASSETS_API_MODULE_CONFIGURATION}/detail?${params}`,
  );
};

export const updateDetailModuleConfigurationActionsApi = (
  body: UpdateModuleConfigDetailBody,
) => {
  const { id, ...other } = body;

  return requestAuthorized.put<{ id: string; message: string }>(
    `${ASSETS_API_MODULE_CONFIGURATION}/${id}`,
    other,
  );
};

export const getListLabelActionsApi = (dataParams: CommonApiParam) => {
  const { id, ...other } = dataParams;
  const params = queryString.stringify(other);

  return requestAuthorized.get<ListLabelConfigResponse>(
    `${ASSETS_API_MODULE_CONFIGURATION}/${id}/label-config?${params}`,
  );
};

export const getDetailLabelActionsApi = (dataParams: CommonApiParam) => {
  const { id, labelId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<LabelConfigDetailResponse>(
    `${ASSETS_API_MODULE_CONFIGURATION}/${id}/label-config/${labelId}?${params}`,
    other,
  );
};

export const updateDetailLabelActionsApi = (dataParams: CommonApiParam) => {
  const {
    id,
    labelId,
    language,
    userDefinedLabel,
    description,
    companyId,
    action,
  } = dataParams;
  return requestAuthorized.put<{ message: string; id: string }>(
    `${ASSETS_API_MODULE_CONFIGURATION}/${id}/label-config/${labelId}`,
    { language, userDefinedLabel, description, companyId, action },
  );
};
