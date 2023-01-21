import { requestAuthorized } from 'helpers/request';
import { CommonApiParam } from 'models/common.model';
import {
  NewMailManagement,
  ListMailManagementResponse,
  MailManagementDetail,
} from 'models/api/mail-management/mail-management.model';

import queryString from 'query-string';
import {
  ASSETS_API_MAIL_TEMPLATE,
  ASSETS_API_MAIL_TYPE,
} from './endpoints/config.endpoint';

export const getListMailManagementActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListMailManagementResponse>(
    `${ASSETS_API_MAIL_TEMPLATE}?${params}`,
  );
};

export const deleteMailManagementApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_MAIL_TEMPLATE}/${dataParams}`);

export const createMailManagementActionsApi = (dataParams: NewMailManagement) =>
  requestAuthorized
    .post<void>(ASSETS_API_MAIL_TEMPLATE, dataParams)
    .catch((error) => Promise.reject(error));

export const getMailTypeActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized
    .get<void>(`${ASSETS_API_MAIL_TYPE}?${params}`)
    .catch((error) => Promise.reject(error));
};

export const getMailManagementDetailApi = (id: string) =>
  requestAuthorized.get<MailManagementDetail>(
    `${ASSETS_API_MAIL_TEMPLATE}/${id}`,
  );

export const updateMailManagementDetailApi = (
  dataParams: NewMailManagement,
) => {
  const { id, ...other } = dataParams;
  return requestAuthorized
    .put<void>(`${ASSETS_API_MAIL_TEMPLATE}/${id}`, other)
    .catch((error) => Promise.reject(error));
};
