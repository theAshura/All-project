import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetPscActionResponse,
  PscActionDetailResponse,
} from '../../api/psc-action/psc-action.model';

export interface PscActionStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listPscActions: GetPscActionResponse;
  pscActionDetail: PscActionDetailResponse;
  errorList: ErrorField[];
}
