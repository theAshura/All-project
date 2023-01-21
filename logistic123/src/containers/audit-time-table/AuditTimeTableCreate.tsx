import AuditTimeTableCreateContainer from 'components/audit-time-table/create';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { AppRouteConst } from 'constants/route.const';
import CalendarTimeTableProvider from 'contexts/audit-time-table/CalendarTimeTable';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const AuditTimeTableCreate = () => (
  <PermissionCheck
    options={{
      feature: Features.AUDIT_INSPECTION,
      subFeature: SubFeatures.AUDIT_TIME_TABLE,
      action: ActionTypeEnum.CREATE,
    }}
  >
    {({ hasPermission }) =>
      hasPermission ? (
        <CalendarTimeTableProvider>
          <div>
            <BreadCrumb current={AppRouteConst.AUDIT_TIME_TABLE_CREATE} />
            <AuditTimeTableCreateContainer />
          </div>
        </CalendarTimeTableProvider>
      ) : (
        <NoPermissionComponent />
      )
    }
  </PermissionCheck>
);

export default AuditTimeTableCreate;
