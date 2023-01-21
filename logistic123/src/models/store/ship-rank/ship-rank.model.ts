import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetShipRanksResponse,
  ShipRankDetailResponse,
} from '../../api/ship-rank/ship-rank.model';

export interface ShipRankStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listShipRanks: GetShipRanksResponse;
  ShipRankDetail: ShipRankDetailResponse;
  errorList: ErrorField[];
}
