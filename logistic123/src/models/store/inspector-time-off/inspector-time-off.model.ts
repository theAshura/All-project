import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetInspectorTimeOffsResponse,
  InspectorTimeOffDetailResponse,
} from '../../api/inspector-time-off/inspector-time-off.model';

export interface InspectorTimeOffStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listInspectorTimeOffs: GetInspectorTimeOffsResponse;
  InspectorTimeOffDetail: InspectorTimeOffDetailResponse;
  errorList: ErrorField[];
}
