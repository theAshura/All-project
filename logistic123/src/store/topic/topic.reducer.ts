import { TopicStoreModel } from 'models/store/topic/topic.model';
import { createReducer } from 'typesafe-actions';
import {
  getListTopicActions,
  deleteTopicActions,
  updateTopicActions,
  createTopicActions,
  getTopicDetailActions,
  clearTopicReducer,
  updateParamsActions,
  clearTopicErrorsReducer,
} from './topic.action';

const INITIAL_STATE: TopicStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listTopics: undefined,
  topicDetail: null,
  errorList: undefined,
};

const topicReducer = createReducer<TopicStoreModel>(INITIAL_STATE)
  .handleAction(getListTopicActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListTopicActions.success, (state, { payload }) => ({
    ...state,
    listTopics: payload,
    loading: false,
  }))
  .handleAction(getListTopicActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteTopicActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteTopicActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },

    loading: false,
  }))
  .handleAction(deleteTopicActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateTopicActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateTopicActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateTopicActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createTopicActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createTopicActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createTopicActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getTopicDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getTopicDetailActions.success, (state, { payload }) => ({
    ...state,
    topicDetail: payload,
    loading: false,
  }))
  .handleAction(getTopicDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearTopicErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearTopicReducer, () => ({
    ...INITIAL_STATE,
  }));

export default topicReducer;
