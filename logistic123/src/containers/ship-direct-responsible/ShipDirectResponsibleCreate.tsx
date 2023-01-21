import ShipDirectResponsibleCreateContainer from 'components/ship-direct-responsible/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const ShipDirectResponsibleCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.SHIP_DIRECT_RESPONSIBLE_CREATE} />
    <ShipDirectResponsibleCreateContainer />
  </div>
);

export default ShipDirectResponsibleCreate;
