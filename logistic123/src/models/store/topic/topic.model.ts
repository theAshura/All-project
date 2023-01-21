import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetTopicsResponse,
  TopicDetailResponse,
} from '../../api/topic/topic.model';

export interface TopicStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listTopics: GetTopicsResponse;
  topicDetail: TopicDetailResponse;
  errorList: ErrorField[];
}
