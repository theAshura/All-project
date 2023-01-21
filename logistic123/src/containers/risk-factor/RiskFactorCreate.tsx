import RiskFactorCreateContainer from 'components/risk-factor/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const RiskFactorCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.RISK_FACTOR_CREATE} />
    <RiskFactorCreateContainer />
  </div>
);

export default RiskFactorCreate;
