import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  checkExitResponse,
  GetIncidentTypesResponse,
  IncidentTypeDetailResponse,
} from '../../api/incident-type/incident-type.model';

export interface IncidentTypeStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listIncidentTypes: GetIncidentTypesResponse;
  incidentTypeDetail: IncidentTypeDetailResponse;
  errorList: ErrorField[];
  isExistField: checkExitResponse;
}
