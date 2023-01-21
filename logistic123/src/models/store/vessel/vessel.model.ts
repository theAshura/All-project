import { ListVesselResponse, Vessel } from 'models/api/vessel/vessel.model';
import { AvatarType, CommonApiParam, ErrorField } from 'models/common.model';

export interface VesselManagementState {
  loading: boolean;
  disable: boolean;
  listVesselResponse: ListVesselResponse;
  vesselDetail: Vessel;
  errorList: ErrorField[];
  params: CommonApiParam;
  dataFilter: CommonApiParam;
  avatarVessel?: AvatarType;
}
