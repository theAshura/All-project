import {
  ListAuthorityMasterResponse,
  AuthorityMaster,
} from 'models/api/authority-master/authority-master.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface AuthorityMasterState {
  loading: boolean;
  disable: boolean;
  listAuthorityMasters: ListAuthorityMasterResponse;
  authorityMasterDetail: AuthorityMaster;
  errorList: ErrorField[];
  params: CommonApiParam;
}
