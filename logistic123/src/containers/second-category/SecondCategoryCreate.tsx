import SecondCategoryCreateContainer from 'components/second-category/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const SecondCategoryCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.SECOND_CATEGORY_CREATE} />
    <SecondCategoryCreateContainer />
  </div>
);

export default SecondCategoryCreate;
