import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  SecondCategoryDetailResponse,
  GetSecondCategoryResponse,
} from '../../api/second-category/second-category.model';

export interface SecondCategoryStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listSecondCategories: GetSecondCategoryResponse;
  secondCategoryDetail: SecondCategoryDetailResponse;
  errorList: ErrorField[];
}
