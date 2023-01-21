import {
  RankMaster,
  ListRankMasterResponse,
} from 'models/api/rank-master/rank-master.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface RankMasterState {
  loading: boolean;
  disable: boolean;
  listRankMaster: ListRankMasterResponse;
  rankMasterDetail: RankMaster;
  errorList: ErrorField[];
  params: CommonApiParam;
}
