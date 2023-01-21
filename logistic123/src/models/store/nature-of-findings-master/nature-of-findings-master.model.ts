import {
  NatureOfFindingsMaster,
  ListNatureOfFindingsMasterResponse,
} from 'models/api/nature-of-findings-master/nature-of-findings-master.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface NatureOfFindingsMasterState {
  loading: boolean;
  disable: boolean;
  listNatureOfFindingsMaster: ListNatureOfFindingsMasterResponse;
  NatureOfFindingsMasterDetail: NatureOfFindingsMaster;
  errorList: ErrorField[];
  params: CommonApiParam;
}
