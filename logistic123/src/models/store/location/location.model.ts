import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetLocationsResponse,
  LocationDetailResponse,
} from '../../api/location/location.model';

export interface LocationStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listLocations: GetLocationsResponse;
  locationDetail: LocationDetailResponse;
  errorList: ErrorField[];
}
