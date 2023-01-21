import CharterOwnerCreateContainer from 'components/charter-owner/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const CharterOwnerCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.CHARTER_OWNER_CREATE} />
    <CharterOwnerCreateContainer />
  </div>
);

export default CharterOwnerCreate;
