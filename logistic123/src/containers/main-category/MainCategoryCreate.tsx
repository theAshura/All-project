import MainCategoryCreateContainer from 'components/main-category/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const MainCategoryCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.MAIN_CATEGORY_CREATE} />
    <MainCategoryCreateContainer />
  </div>
);

export default MainCategoryCreate;
