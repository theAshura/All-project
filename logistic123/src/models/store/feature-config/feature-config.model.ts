import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetFeatureConfigsResponse,
  FeatureConfigDetailResponse,
} from '../../api/feature-config/feature-config.model';

export interface FeatureConfigStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listFeatureConfigs: GetFeatureConfigsResponse;
  auditTypeDetail: FeatureConfigDetailResponse;
  errorList: ErrorField[];
}
