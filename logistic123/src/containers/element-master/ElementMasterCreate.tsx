import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';
import ElementMasterNew from 'components/element-master/create';

const NewElementMaster = () => (
  <div>
    <BreadCrumb current={AppRouteConst.ELEMENT_MASTER_CREATE} />
    <ElementMasterNew />
  </div>
);

export default NewElementMaster;
