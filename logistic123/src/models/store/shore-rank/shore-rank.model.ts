import {
  ListShoreRankResponse,
  ShoreRank,
} from 'models/api/shore-rank/shore-rank.model';
import { CommonApiParam, ErrorField } from '../../common.model';

export interface ShoreRankState {
  loading: boolean;
  disable: boolean;
  listShoreRank: ListShoreRankResponse;
  shoreRankDetail: ShoreRank;
  errorList: ErrorField[];
  params: CommonApiParam;
}
