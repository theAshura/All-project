import PscActionCreateContainer from 'components/psc-action/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const PscActionCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.PSC_ACTION_CREATE} />
    <PscActionCreateContainer />
  </div>
);

export default PscActionCreate;
