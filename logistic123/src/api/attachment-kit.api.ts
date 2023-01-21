import { requestAuthorized } from 'helpers/request';
import {
  ListAttachmentKitResponse,
  AttachmentKitData,
} from 'models/api/attachment-kit/attachment-kit.model';
import { CommonApiParam } from 'models/common.model';

import queryString from 'query-string';
import { ASSETS_API_ATTACHMENT_KIT } from './endpoints/config.endpoint';

export const getLisAttachmentKitActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListAttachmentKitResponse>(
    `${ASSETS_API_ATTACHMENT_KIT}?${params}`,
  );
};

export const deleteAttachmentKitActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_ATTACHMENT_KIT}/${dataParams}`);

export const createAttachmentKitActionsApi = (dataParams: AttachmentKitData) =>
  requestAuthorized
    .post<void>(ASSETS_API_ATTACHMENT_KIT, dataParams)
    .catch((error) => Promise.reject(error));

export const getAttachmentKitDetailApi = (id: string) =>
  requestAuthorized.get(`${ASSETS_API_ATTACHMENT_KIT}/${id}`);

export const updateAttachmentKitActionsApi = (
  dataParams: AttachmentKitData,
) => {
  const { id, ...other } = dataParams;
  return requestAuthorized
    .put<void>(`${ASSETS_API_ATTACHMENT_KIT}/${id}`, other)
    .catch((error) => Promise.reject(error));
};
