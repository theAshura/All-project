import CategoryCreateContainer from 'components/category/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const CategoryCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.CATEGORY_CREATE} />
    <CategoryCreateContainer />
  </div>
);

export default CategoryCreate;
