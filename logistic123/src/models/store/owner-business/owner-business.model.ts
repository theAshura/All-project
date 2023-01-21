import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetOwnerBusinessResponse,
  OwnerBusinessDetailResponse,
} from '../../api/owner-business/owner-business.model';

export interface OwnerBusinessStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listOwnerBusiness: GetOwnerBusinessResponse;
  ownerBusinessDetail: OwnerBusinessDetailResponse;
  errorList: ErrorField[];
}
