import LocationCreateContainer from 'components/location/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const LocationCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.LOCATION_CREATE} />
    <LocationCreateContainer />
  </div>
);

export default LocationCreate;
