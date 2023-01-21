import {
  GetTopicsResponse,
  CreateTopicParams,
  UpdateTopicParams,
  TopicDetailResponse,
} from 'models/api/topic/topic.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface ParamsDeleteTopic {
  id: string;
  isDetail?: boolean;
  getListTopic: () => void;
}

export const getListTopicActions = createAsyncAction(
  `@topic/GET_LIST_TOPIC_ACTIONS`,
  `@topic/GET_LIST_TOPIC_ACTIONS_SUCCESS`,
  `@topic/GET_LIST_TOPIC_ACTIONS_FAIL`,
)<CommonApiParam, GetTopicsResponse, void>();

export const deleteTopicActions = createAsyncAction(
  `@topic/DELETE_TOPIC_ACTIONS`,
  `@topic/DELETE_TOPIC_ACTIONS_SUCCESS`,
  `@topic/DELETE_TOPIC_ACTIONS_FAIL`,
)<ParamsDeleteTopic, CommonApiParam, void>();

export const createTopicActions = createAsyncAction(
  `@topic/CREATE_TOPIC_ACTIONS`,
  `@topic/CREATE_TOPIC_ACTIONS_SUCCESS`,
  `@topic/CREATE_TOPIC_ACTIONS_FAIL`,
)<CreateTopicParams, void, ErrorField[]>();

export const updateTopicActions = createAsyncAction(
  `@topic/UPDATE_TOPIC_ACTIONS`,
  `@topic/UPDATE_TOPIC_ACTIONS_SUCCESS`,
  `@topic/UPDATE_TOPIC_ACTIONS_FAIL`,
)<UpdateTopicParams, void, ErrorField[]>();

export const getTopicDetailActions = createAsyncAction(
  `@topic/GET_TOPIC_DETAIL_ACTIONS`,
  `@topic/GET_TOPIC_DETAIL_ACTIONS_SUCCESS`,
  `@topic/GET_TOPIC_DETAIL_ACTIONS_FAIL`,
)<string, TopicDetailResponse, void>();

export const clearTopicReducer = createAction(
  `@topic/CLEAR_TOPIC_REDUCER`,
)<void>();

export const clearTopicErrorsReducer = createAction(
  `@topic/CLEAR_TOPIC_ERRORS_REDUCER`,
)<void>();

export const updateParamsActions = createAction(
  `@topic/UPDATE_PARAMS_ACTIONS`,
)<CommonApiParam>();
