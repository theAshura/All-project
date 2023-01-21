import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  CategoryDetailResponse,
  Category,
} from '../../api/category/category.model';

export interface CategoryStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listCategorys: Category[];
  categoryDetail: CategoryDetailResponse;
  errorList: ErrorField[];
}
