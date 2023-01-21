import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  RiskFactorDetailResponse,
  GetRiskFactorResponse,
} from '../../api/risk-factor/risk-factor.model';

export interface RiskFactorStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listRiskFactor: GetRiskFactorResponse;
  riskFactorDetail: RiskFactorDetailResponse;
  errorList: ErrorField[];
}
