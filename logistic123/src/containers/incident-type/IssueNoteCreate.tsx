import IncidentTypeCreateContainer from 'components/incident-type/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const IncidentTypeCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.INCIDENT_TYPE_CREATE} />
    <IncidentTypeCreateContainer />
  </div>
);

export default IncidentTypeCreate;
