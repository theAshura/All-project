import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetCategoryMappingsResponse,
  CategoryMappingDetailResponse,
} from '../../api/category-mapping/category-mapping.model';

export interface CategoryMappingStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listCategoryMappings: GetCategoryMappingsResponse;
  categoryMappingDetail: CategoryMappingDetailResponse;
  errorList: ErrorField[];
}
