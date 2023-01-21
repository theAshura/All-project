import {
  GetMainCategoryResponse,
  MainCategoryDetailResponse,
} from 'models/api/main-category/main-category.model';
import { CommonApiParam, ErrorField } from 'models/common.model';

export interface MainCategoryStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listMainCategories: GetMainCategoryResponse;
  mainCategoryDetail: MainCategoryDetailResponse;
  errorList: ErrorField[];
}
