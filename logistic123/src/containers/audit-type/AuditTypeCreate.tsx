import AuditTypeCreateContainer from 'components/audit-type/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';

const AuditTypeCreate = () => (
  <div>
    <BreadCrumb current={AppRouteConst.AUDIT_TYPE_CREATE} />
    <AuditTypeCreateContainer />
  </div>
);

export default AuditTypeCreate;
