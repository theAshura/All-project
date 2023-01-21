import { CommonApiParam, CommonErrorResponse } from 'models/common.model';
import {
  GetStandardMastersResponse,
  StandardMasterDetailResponse,
} from '../../api/standard-master/standard-master.model';

export interface StandardMasterStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listStandardMasters: GetStandardMastersResponse;
  standardMasterDetail: StandardMasterDetailResponse;
  errorList: CommonErrorResponse;
  dataFilter: CommonApiParam;
}
