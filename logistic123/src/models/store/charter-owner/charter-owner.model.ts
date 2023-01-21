import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetCharterOwnersResponse,
  CharterOwnerDetailResponse,
} from '../../api/charter-owner/charter-owner.model';

export interface CharterOwnerStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listCharterOwners: GetCharterOwnersResponse;
  charterOwnerDetail: CharterOwnerDetailResponse;
  errorList: ErrorField[];
}
