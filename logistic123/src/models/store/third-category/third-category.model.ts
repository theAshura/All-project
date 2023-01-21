import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  ThirdCategoryDetailResponse,
  GetThirdCategoryResponse,
} from '../../api/third-category/third-category.model';

export interface ThirdCategoryStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listThirdCategories: GetThirdCategoryResponse;
  thirdCategoryDetail: ThirdCategoryDetailResponse;
  errorList: ErrorField[];
}
