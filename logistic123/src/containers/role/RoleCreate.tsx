import RoleCreateContainer from 'components/role/create/index';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';
import RoleAndPermissionProvider from 'contexts/role/RoleContext';

const RoleCreate = () => (
  <RoleAndPermissionProvider>
    <div>
      <BreadCrumb current={AppRouteConst.ROLE_CREATE} />
      <RoleCreateContainer />
    </div>
  </RoleAndPermissionProvider>
);

export default RoleCreate;
