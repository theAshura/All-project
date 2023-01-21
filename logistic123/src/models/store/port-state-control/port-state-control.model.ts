import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetPortStateControlsResponse,
  PortStateControlDetailResponse,
} from '../../api/port-state-control/port-state-control.model';

export interface PortStateControlStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listPortStateControls: GetPortStateControlsResponse;
  portStateControlDetail: PortStateControlDetailResponse;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
