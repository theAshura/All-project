import StandardMasterCreateContainer from 'components/standard-master/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const StandardMasterCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.STANDARD_MASTER_CREATE} />
    <StandardMasterCreateContainer />
  </div>
);

export default StandardMasterCreate;
