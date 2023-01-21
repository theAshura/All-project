import EventTypeCreateContainer from 'components/event-type/create/index';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const EventTypeCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.EVENT_TYPE_CREATE} />
    <EventTypeCreateContainer />
  </div>
);

export default EventTypeCreate;
