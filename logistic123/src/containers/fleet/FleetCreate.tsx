import FleetCreateContainer from 'components/fleet/create/index';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const FleetCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.FLEET_CREATE} />
    <FleetCreateContainer />
  </div>
);

export default FleetCreate;
