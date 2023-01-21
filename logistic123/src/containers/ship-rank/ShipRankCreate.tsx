import ShipRankCreateContainer from 'components/ship-rank/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const ShipRankCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.SHIP_RANK} />
    <ShipRankCreateContainer />
  </div>
);

export default ShipRankCreate;
