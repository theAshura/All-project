import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetVIQsResponse,
  PotentialRisk,
  ViqResponse,
} from '../../api/viq/viq.model';

export interface VIQStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  potentialRisk: PotentialRisk[];
  listVIQs: GetVIQsResponse;
  VIQDetail: ViqResponse;
  errorList: ErrorField[];
}
