import { ErrorField, CommonApiParam } from 'models/common.model';
import { GetCDIsResponse, CDIDetailResponse } from '../../api/cdi/cdi.model';

export interface CDIStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listCDIs: GetCDIsResponse;
  CDIDetail: CDIDetailResponse;
  errorList: ErrorField[];
}
