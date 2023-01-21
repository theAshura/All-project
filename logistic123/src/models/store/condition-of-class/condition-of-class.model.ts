import {
  GetConditionOfClassResponse,
  ConditionOfClassDetailResponse,
} from 'models/api/condition-of-class/condition-of-class.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface ConditionOfClassStoreModel {
  loading: boolean;
  loadingCompany: boolean;
  disable: boolean;
  params: CommonApiParam;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
  listConditionOfClass: GetConditionOfClassResponse;
  conditionOfClassDetail: ConditionOfClassDetailResponse;
}
