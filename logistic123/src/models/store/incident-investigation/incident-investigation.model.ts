import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetIncidentInvestigationsResponse,
  IncidentInvestigationDetailResponse,
} from '../../api/incident-investigation/incident-investigation.model';

export interface IncidentInvestigationStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listIncidentInvestigations: GetIncidentInvestigationsResponse;
  incidentInvestigationDetail: IncidentInvestigationDetailResponse;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
