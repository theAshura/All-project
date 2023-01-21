import { GMT, ListPortResponse, Port } from 'models/api/port/port.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface PortState {
  loading: boolean;
  disable: boolean;
  listPort: ListPortResponse;
  listPortStringPreference: ListPortResponse;
  portDetail: Port;
  errorList: ErrorField[];
  params: CommonApiParam;
  GMTs: Array<GMT>;
}
