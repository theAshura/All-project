import CategoryMappingCreateContainer from 'components/category-mapping/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const CategoryMappingCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.CATEGORY_MAPPING_CREATE} />
    <CategoryMappingCreateContainer />
  </div>
);

export default CategoryMappingCreate;
