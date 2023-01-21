import {
  ListVesselTypeResponse,
  VesselType,
} from 'models/api/vessel-type/vessel-type.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface VesselTypeState {
  loading: boolean;
  disable: boolean;
  listVesselTypes: ListVesselTypeResponse;
  vesselTypeDetail: VesselType;
  errorList: ErrorField[];
  params: CommonApiParam;
}
