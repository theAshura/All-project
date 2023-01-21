import ThirdCategoryCreateContainer from 'components/third-category/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const ThirdCategoryCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.THIRD_CATEGORY_CREATE} />
    <ThirdCategoryCreateContainer />
  </div>
);

export default ThirdCategoryCreate;
