import CharterOwnerCreateContainer from 'components/topic/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const CharterOwnerCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.TOPIC_CREATE} />
    <CharterOwnerCreateContainer />
  </div>
);

export default CharterOwnerCreate;
