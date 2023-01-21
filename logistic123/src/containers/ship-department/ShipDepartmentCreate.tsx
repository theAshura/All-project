import ShipDepartmentCreateContainer from 'components/ship-department/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const ShipDepartmentCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.SHIP_DEPARTMENT_CREATE} />
    <ShipDepartmentCreateContainer />
  </div>
);

export default ShipDepartmentCreate;
