import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  GetTopicsResponse,
  CreateTopicParams,
  TopicDetailResponse,
  UpdateTopicParams,
} from 'models/api/topic/topic.model';
import queryString from 'query-string';
import { ASSETS_API_TOPIC } from './endpoints/config.endpoint';

export const getListTopicsActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetTopicsResponse>(
    `${ASSETS_API_TOPIC}?${params}`,
  );
};

export const deleteTopicActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_TOPIC}/${dataParams}`);

export const createTopicActionsApi = (dataParams: CreateTopicParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_TOPIC, dataParams)
    .catch((error) => Promise.reject(error));

export const getTopicDetailActionsApi = (id: string) =>
  requestAuthorized.get<TopicDetailResponse>(`${ASSETS_API_TOPIC}/${id}`);

export const updateTopicPermissionDetailActionsApi = (
  dataParams: UpdateTopicParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_TOPIC}/${dataParams.id}`,
    dataParams.data,
  );
