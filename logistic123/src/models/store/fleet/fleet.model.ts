import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetFleetsResponse,
  FleetDetailResponse,
  GetCompanysResponse,
} from '../../api/fleet/fleet.model';

export interface FleetStoreModel {
  loading: boolean;
  loadingCompany: boolean;
  disable: boolean;
  params: CommonApiParam;
  listFleets: GetFleetsResponse;
  listCompany: GetCompanysResponse;
  FleetDetail: FleetDetailResponse;
  errorList: ErrorField[];
}
