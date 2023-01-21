import CDICreateContainer from 'components/cdi/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const CDICreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.CDI_CREATE} />
    <CDICreateContainer />
  </div>
);

export default CDICreate;
