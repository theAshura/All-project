import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetEventTypesResponse,
  EventTypeDetailResponse,
  GetCompanysResponse,
  checkExitResponse,
} from '../../api/event-type/event-type.model';

export interface EventTypeStoreModel {
  loading: boolean;
  loadingCompany: boolean;
  disable: boolean;
  params: CommonApiParam;
  isExistField: checkExitResponse;
  listEventTypes: GetEventTypesResponse;
  listCompany: GetCompanysResponse;
  EventTypeDetail: EventTypeDetailResponse;
  errorList: ErrorField[];
}
