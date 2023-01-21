import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  ListPSCDeficiencyResponse,
  PSCDeficiency,
} from '../../api/psc-deficiency/psc-deficiency.model';

export interface PSCDeficiencyState {
  loading: boolean;
  disable: boolean;
  listPSCDeficiency: ListPSCDeficiencyResponse;
  pscDeficiencyDetail: PSCDeficiency;
  errorList: ErrorField[];
  params: CommonApiParam;
}
