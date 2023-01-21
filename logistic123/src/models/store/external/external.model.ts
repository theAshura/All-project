import {
  GetDetailExternal,
  GetExternalResponse,
} from 'models/api/external/external.model';
import { CommonApiParam, CommonErrorResponse } from 'models/common.model';

export interface ExternalStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  detailExternal: GetDetailExternal;
  listExternal: GetExternalResponse;
  errorList: CommonErrorResponse;
  dataFilter: CommonApiParam;
}
