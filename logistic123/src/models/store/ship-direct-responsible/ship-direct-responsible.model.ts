import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetShipDirectResponsiblesResponse,
  ShipDirectResponsibleDetailResponse,
} from '../../api/ship-direct-responsible/ship-direct-responsible.model';

export interface ShipDirectResponsibleStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listShipDirectResponsibles: GetShipDirectResponsiblesResponse;
  shipDirectResponsibleDetail: ShipDirectResponsibleDetailResponse;
  errorList: ErrorField[];
}
