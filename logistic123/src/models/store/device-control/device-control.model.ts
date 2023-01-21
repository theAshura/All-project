import {
  DeviceControl,
  ListDeviceControlResponse,
} from 'models/api/device-control/device-control.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface DeviceControlState {
  loading: boolean;
  disable: boolean;
  listDeviceControl: ListDeviceControlResponse;
  deviceControlDetail: DeviceControl;
  errorList: ErrorField[];
  params: CommonApiParam;
}
