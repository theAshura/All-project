import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetFocusRequestsResponse,
  FocusRequestDetailResponse,
} from '../../api/focus-request/focus-request.model';

export interface FocusRequestStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listFocusRequests: GetFocusRequestsResponse;
  FocusRequestDetail: FocusRequestDetailResponse;
  errorList: ErrorField[];
}
